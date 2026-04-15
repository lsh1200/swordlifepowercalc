// Character Live2D-style Animation
// Displacement filter + polygon eyelash-sweep blink
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

  // Blink
  var blinkTimer = 0;
  var blinkInterval = 2;
  var blinkPhase = 0;
  var BLINK_SPEED = 2.5;

  var SKIN_COLOR = 0xD9C6BF;

  // Eye polygon outlines (normalized 0-1, traced from actual image)
  var eyePolys = [
    // Left eye — almond shape
    [0.3959,0.2877, 0.4027,0.2795, 0.4196,0.2748, 0.4433,0.2724,
     0.4704,0.2736, 0.4873,0.2771, 0.4958,0.283, 0.4907,0.2925,
     0.4772,0.2995, 0.4535,0.3031, 0.4264,0.3019, 0.4061,0.2972],
    // Right eye — almond shape
    [0.6497,0.2854, 0.643,0.2771, 0.6261,0.2724, 0.6024,0.27,
     0.5821,0.2712, 0.5702,0.2759, 0.5668,0.283, 0.5702,0.2925,
     0.5821,0.2983, 0.6024,0.3007, 0.6261,0.2995, 0.643,0.2936]
  ];

  // Lash Y positions (normalized) — top of each eye
  var lashDefs = [
    { topY: 0.2724, botY: 0.3031, lashH: 5/848 }, // left
    { topY: 0.27,   botY: 0.3007, lashH: 5/848 }  // right
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

    skinGfx = new PIXI.Graphics();
    app.stage.addChild(skinGfx);

    var lashTextures = [textures[LASH_L], textures[LASH_R]];
    for (var i = 0; i < 2; i++) {
      var lashSprite = new PIXI.Sprite(lashTextures[i]);
      lashSprite.anchor.set(0, 0);
      lashSprite.visible = false;
      app.stage.addChild(lashSprite);
      blinkData.push({ lash: lashSprite, poly: eyePolys[i], def: lashDefs[i] });
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

  // Convert normalized polygon to screen coords, clipped to a Y threshold
  function polyToScreen(poly, ox, oy, tw, th, scX, scY, maxY) {
    var pts = [];
    for (var i = 0; i < poly.length; i += 2) {
      var sx = ox + poly[i] * tw * scX;
      var sy = oy + poly[i + 1] * th * scY;
      // Clip: any point below maxY gets clamped to maxY
      if (sy > maxY) sy = maxY;
      pts.push(sx, sy);
    }
    return pts;
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
        closeness = closeness * closeness * (3 - 2 * closeness);
      }

      var scX = sprite.scale.x;
      var scY = sprite.scale.y;
      var ox = sprite.x - tw * scX * 0.5;
      var oy = sprite.y;

      if (skinGfx) skinGfx.clear();

      for (var i = 0; i < blinkData.length; i++) {
        var bd = blinkData[i];
        var def = bd.def;

        var eyeTopScreen = oy + def.topY * th * scY;
        var eyeBotScreen = oy + def.botY * th * scY;
        var eyeH = eyeBotScreen - eyeTopScreen;
        var lashScreenH = def.lashH * th * scY;

        if (closeness > 0.01) {
          bd.lash.visible = true;

          // The "sweep line" moves from top to bottom of the eye
          var sweepY = eyeTopScreen + eyeH * closeness;

          // Draw skin-colored polygon clipped to sweepY
          // All polygon points below sweepY get clamped up to sweepY
          // This creates the effect of skin filling the eye shape from top down
          if (skinGfx) {
            var clipped = polyToScreen(bd.poly, ox, oy, tw, th, scX, scY, sweepY);
            skinGfx.beginFill(SKIN_COLOR, 1);
            skinGfx.drawPolygon(clipped);
            skinGfx.endFill();
          }

          // Position lash at the sweep line
          // Find the left/right extent of the polygon at the sweep line
          var polyMinX = Infinity, polyMaxX = -Infinity;
          for (var j = 0; j < bd.poly.length; j += 2) {
            var px = ox + bd.poly[j] * tw * scX;
            polyMinX = Math.min(polyMinX, px);
            polyMaxX = Math.max(polyMaxX, px);
          }
          bd.lash.x = polyMinX;
          bd.lash.y = sweepY - lashScreenH;
          bd.lash.width = polyMaxX - polyMinX;
          bd.lash.height = lashScreenH;
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
