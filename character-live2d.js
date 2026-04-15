// Character Live2D-style Animation
// Uses PixiJS displacement filter + mesh eyelid overlay blink
(function () {
  var CHAR_IMG = 'character-clean.png';
  var DISP_IMG = 'character-displacement.png';

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
  var eyeLids = [];
  var time = 0;
  var mouseX = 0;
  var mouseY = 0;
  var isHovering = false;

  // Blink state
  var blinkTimer = 0;
  var blinkInterval = 2;
  var blinkPhase = 0;
  var BLINK_SPEED = 2.5;

  // Eye definitions (normalized to image 591x848)
  // skinRegion: the thin strip of skin ABOVE the eye (the eyelid texture source)
  // eyeTop: where the eye opening starts (top of iris)
  // eyeBottom: where the eye opening ends (bottom of eye)
  // Use nose bridge area as skin texture source — clean skin, no hair/eyebrow
  var skinSource = { x: 290/591, y: 243/848, w: 35/591, h: 12/848 };

  var eyeDefs = [
    { // Left eye
      skinUV: skinSource,
      eyeTop: 230/848,
      eyeBottom: 262/848,
      left: 220/591,
      right: 305/591,
    },
    { // Right eye
      skinUV: skinSource,
      eyeTop: 228/848,
      eyeBottom: 260/848,
      left: 328/591,
      right: 393/591,
    }
  ];

  var ROWS = 4;
  var COLS = 4;

  PIXI.Assets.load([CHAR_IMG, DISP_IMG]).then(function (textures) {
    var charTex = textures[CHAR_IMG];

    sprite = new PIXI.Sprite(charTex);
    sprite.anchor.set(0.5, 0);
    app.stage.addChild(sprite);

    dispSprite = new PIXI.Sprite(textures[DISP_IMG]);
    dispSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    dispFilter = new PIXI.DisplacementFilter(dispSprite, 0);
    app.stage.addChild(dispSprite);
    sprite.filters = [dispFilter];

    // Create eyelid meshes — each maps UV to the skin strip above the eye
    // The mesh starts as a thin strip at the eyelid crease
    // During blink, the bottom vertices stretch DOWN to cover the eye
    // Because the UV maps to skin texture, it paints skin over the eye
    for (var e = 0; e < eyeDefs.length; e++) {
      var def = eyeDefs[e];

      var mesh = new PIXI.SimplePlane(charTex, COLS + 1, ROWS + 1);
      mesh.autoUpdate = true;

      // UV: all rows map to the same thin skin strip (repeated vertically)
      // This makes the whole mesh show skin texture regardless of how tall it stretches
      var uvs = mesh.geometry.getBuffer('aTextureCoord').data;
      for (var row = 0; row <= ROWS; row++) {
        for (var col = 0; col <= COLS; col++) {
          var idx = (row * (COLS + 1) + col) * 2;
          var u = def.skinUV.x + (col / COLS) * def.skinUV.w;
          // Map all rows to the same vertical band of skin
          var v = def.skinUV.y + (row / ROWS) * def.skinUV.h;
          uvs[idx] = u;
          uvs[idx + 1] = v;
        }
      }
      mesh.geometry.getBuffer('aTextureCoord').update();

      app.stage.addChild(mesh);
      eyeLids.push({ mesh: mesh, def: def });
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

  function positionLid(lid, spriteX, spriteY, scX, scY, closeness) {
    var tw = sprite.texture.width;
    var th = sprite.texture.height;
    var def = lid.def;
    var verts = lid.mesh.geometry.getBuffer('aVertexPosition').data;

    var ox = spriteX - tw * scX * 0.5;

    var lidLeft = ox + def.left * tw * scX;
    var lidRight = ox + def.right * tw * scX;
    var lidTop = spriteY + def.eyeTop * th * scY;
    var lidBottom = spriteY + def.eyeBottom * th * scY;
    var eyeHeight = lidBottom - lidTop;

    var ease = closeness * closeness * (3 - 2 * closeness);

    // When closed (ease=1): mesh covers from lidTop to lidBottom (full eye)
    // When open (ease=0): mesh is zero height at lidTop (invisible)
    var meshBottom = lidTop + eyeHeight * ease;

    for (var row = 0; row <= ROWS; row++) {
      for (var col = 0; col <= COLS; col++) {
        var idx = (row * (COLS + 1) + col) * 2;
        var x = lidLeft + (col / COLS) * (lidRight - lidLeft);
        var y = lidTop + (row / ROWS) * (meshBottom - lidTop);
        verts[idx] = x;
        verts[idx + 1] = y;
      }
    }

    lid.mesh.geometry.getBuffer('aVertexPosition').update();
    lid.mesh.visible = ease > 0.01;
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
      }

      // Position eyelid meshes
      var scX = sprite.scale.x;
      var scY = sprite.scale.y;
      for (var i = 0; i < eyeLids.length; i++) {
        positionLid(eyeLids[i], sprite.x, sprite.y, scX, scY, closeness);
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
