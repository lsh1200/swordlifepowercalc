// Character Live2D-style Animation
// Displacement filter + eyelash-sweep blink
(function () {
  var CHAR_IMG = 'character-clean.png';
  var DISP_IMG = 'character-displacement.png';
  var LASH_L = 'lash-l.png';
  var LASH_R = 'lash-r.png';

  var canvas = document.getElementById('charCanvas');
  if (!canvas) return;

  var panel = canvas.parentElement;

  function getSize() {
    var w = panel.clientWidth || 180;
    var h = panel.clientHeight || 300;
    if (h < 100) h = 300;
    if (w < 80) w = 180;
    return { w: w, h: h };
  }

  var size = getSize();

  var app = new PIXI.Application({
    view: canvas,
    width: size.w,
    height: size.h,
    backgroundAlpha: 0,
    antialias: true,
    autoDensity: true,
    resolution: 2,
  });

  var sprite = null;
  var dispSprite = null;
  var dispFilter = null;
  var blinkData = [];
  var skinGfx = null;
  var time = 0;
  var mouseX = 0;
  var mouseY = 0;
  var isHovering = false;

  // Blink state
  var blinkTimer = 0;
  var blinkInterval = 2;
  var blinkPhase = 0;
  var BLINK_SPEED = 2.5;

  // Skin color sampled from nose bridge
  var SKIN_COLOR = 0xD9C6BF;

  // Eye definitions (normalized to 591x848 image)
  var eyeDefs = [
    { // Left eye
      lashY: 229/848,      // where the lash strip sits (top of eye)
      eyeBottom: 262/848,   // bottom of eye opening
      left: 225/591,
      right: 300/591,
      lashH: 5/848,         // lash strip height
    },
    { // Right eye
      lashY: 227/848,
      eyeBottom: 260/848,
      left: 335/591,
      right: 393/591,
      lashH: 5/848,
    }
  ];

  PIXI.Assets.load([CHAR_IMG, DISP_IMG, LASH_L, LASH_R]).then(function (textures) {
    sprite = new PIXI.Sprite(textures[CHAR_IMG]);
    sprite.anchor.set(0.5, 0);
    app.stage.addChild(sprite);

    dispSprite = new PIXI.Sprite(textures[DISP_IMG]);
    dispSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    dispFilter = new PIXI.DisplacementFilter(dispSprite, 0);
    app.stage.addChild(dispSprite);
    sprite.filters = [dispFilter];

    // Skin fill layer (drawn behind lash sprites)
    skinGfx = new PIXI.Graphics();
    app.stage.addChild(skinGfx);

    // Lash sprites
    var lashTextures = [textures[LASH_L], textures[LASH_R]];
    for (var i = 0; i < eyeDefs.length; i++) {
      var lashSprite = new PIXI.Sprite(lashTextures[i]);
      lashSprite.anchor.set(0, 0);
      lashSprite.visible = false;
      app.stage.addChild(lashSprite);
      blinkData.push({ def: eyeDefs[i], lash: lashSprite });
    }

    fitSprite();
    app.ticker.add(animate);
  });

  function fitSprite() {
    if (!sprite) return;
    var s = getSize();
    app.renderer.resize(s.w, s.h);

    var tw = sprite.texture.width;
    var th = sprite.texture.height;
    var scale = s.w / tw;
    sprite.scale.set(scale);
    sprite.x = s.w * 0.55;
    sprite.y = 0;
  }

  function animate(delta) {
    time += delta * 0.016;
    var s = getSize();
    var dt = delta * 0.016;

    if (sprite) {
      var tw = sprite.texture.width;
      var th = sprite.texture.height;
      var baseScale = Math.max(s.w / tw, s.h / th);

      var breathY = 1 + Math.sin(time * 2.2) * 0.015;
      var breathX = 1 + Math.sin(time * 2.2) * 0.005;
      sprite.scale.set(baseScale * breathX, baseScale * breathY);

      var drift = Math.sin(time * 0.7) * 6;
      sprite.x = s.w * 0.55 + drift;

      var bob = Math.sin(time * 1.0) * 3;
      sprite.y = bob;

      if (isHovering) {
        sprite.x += (mouseX - s.w / 2) * 0.04;
        sprite.y += (mouseY - s.h / 2) * 0.02;
      }

      // Blink timer
      blinkTimer += dt;
      if (blinkPhase === 0 && blinkTimer >= blinkInterval) {
        blinkPhase = 0.001;
        blinkTimer = 0;
        blinkInterval = 3 + Math.random() * 4;
        if (Math.random() < 0.2) blinkInterval = 0.5;
      }

      var closeness = 0;
      if (blinkPhase > 0) {
        blinkPhase += dt * BLINK_SPEED;
        if (blinkPhase < 1) {
          closeness = blinkPhase;
        } else if (blinkPhase < 2) {
          closeness = 2 - blinkPhase;
        } else {
          blinkPhase = 0;
        }
        closeness = Math.max(0, Math.min(1, closeness));
        // Smoothstep
        closeness = closeness * closeness * (3 - 2 * closeness);
      }

      // Calculate sprite transform values
      var scX = sprite.scale.x;
      var scY = sprite.scale.y;
      var ox = sprite.x - tw * scX * 0.5; // sprite left edge on screen
      var oy = sprite.y; // sprite top edge on screen

      // Draw skin fill and position lash sprites
      if (skinGfx) {
        skinGfx.clear();
      }

      for (var i = 0; i < blinkData.length; i++) {
        var bd = blinkData[i];
        var def = bd.def;

        // Screen coordinates of this eye
        var eyeLeft = ox + def.left * tw * scX;
        var eyeRight = ox + def.right * tw * scX;
        var eyeTop = oy + def.lashY * th * scY; // where lash normally sits
        var eyeBottom = oy + def.eyeBottom * th * scY;
        var lashScreenH = def.lashH * th * scY;
        var eyeOpenH = eyeBottom - eyeTop;

        if (closeness > 0.01) {
          bd.lash.visible = true;

          // Lash position: slides from eyeTop down to eyeBottom
          var lashY = eyeTop + eyeOpenH * closeness;

          // Position and scale lash sprite
          bd.lash.x = eyeLeft;
          bd.lash.y = lashY - lashScreenH; // lash sits just above the sweep line
          bd.lash.width = eyeRight - eyeLeft;
          bd.lash.height = lashScreenH;

          // Skin fill: covers from eyeTop to lashY (area the lash has passed)
          if (skinGfx) {
            skinGfx.beginFill(SKIN_COLOR, 1);
            skinGfx.drawRect(eyeLeft, eyeTop, eyeRight - eyeLeft, lashY - eyeTop - lashScreenH);
            skinGfx.endFill();
          }
        } else {
          bd.lash.visible = false;
        }
      }
    }

    // Displacement
    if (dispFilter) {
      dispFilter.scale.x = 8 + Math.sin(time * 1.3) * 5;
      dispFilter.scale.y = 5 + Math.cos(time * 1.8) * 3;
      if (isHovering) {
        dispFilter.scale.x *= 1.5;
        dispFilter.scale.y *= 1.5;
      }
    }

    if (dispSprite) {
      dispSprite.x = Math.sin(time * 0.5) * 6;
      dispSprite.y = Math.cos(time * 0.8) * 4;
    }
  }

  panel.addEventListener('mouseenter', function () { isHovering = true; });
  panel.addEventListener('mouseleave', function () { isHovering = false; });
  panel.addEventListener('mousemove', function (e) {
    var rect = panel.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitSprite, 100);
  });

  var tsum = document.getElementById('tsum');
  if (tsum) {
    new MutationObserver(function () {
      setTimeout(fitSprite, 50);
    }).observe(tsum, { childList: true, subtree: true, characterData: true });
  }
})();
