// Character Live2D-style Animation
// Uses PixiJS displacement filter + mesh-deformed eyelid blink
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
  var eyeMeshes = [];
  var time = 0;
  var mouseX = 0;
  var mouseY = 0;
  var isHovering = false;

  // Blink state
  var blinkTimer = 0;
  var blinkInterval = 2;
  var blinkPhase = 0;
  var BLINK_SPEED = 2.2; // slower for visible anime-style blink

  // Eye regions in normalized image coords (0-1)
  // Each eye: the rectangle covering from above eyelid to below eye
  // We'll create a mesh for this region and warp the top half down to close
  var eyeRegions = [
    // Left eye — includes skin above + eye + skin below
    { x: 220/591, y: 210/848, w: 85/591, h: 60/848 },
    // Right eye
    { x: 330/591, y: 208/848, w: 65/591, h: 60/848 }
  ];

  // How far down from the top of each eye region the "crease" is (where eyelid meets eye)
  // Vertices above this line stay fixed; vertices below get pushed down during blink
  var creaseRatio = 0.35; // 35% from top is the eyelid crease

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

    // Create eye meshes — each is a SimplePlane over the eye region
    // Using the SAME texture as the character, with UV coords for just the eye area
    // This overlays on top of the sprite and we deform its vertices to close the eye
    var ROWS = 6; // vertical subdivisions for smooth deformation
    var COLS = 4; // horizontal subdivisions

    for (var e = 0; e < eyeRegions.length; e++) {
      var region = eyeRegions[e];

      // Create a SimplePlane mesh
      var mesh = new PIXI.SimplePlane(charTex, COLS + 1, ROWS + 1);
      mesh.autoUpdate = true;

      // Set UV coordinates to map only the eye region of the texture
      var uvs = mesh.geometry.getBuffer('aTextureCoord').data;
      for (var row = 0; row <= ROWS; row++) {
        for (var col = 0; col <= COLS; col++) {
          var idx = (row * (COLS + 1) + col) * 2;
          var u = region.x + (col / COLS) * region.w;
          var v = region.y + (row / ROWS) * region.h;
          uvs[idx] = u;
          uvs[idx + 1] = v;
        }
      }
      mesh.geometry.getBuffer('aTextureCoord').update();

      app.stage.addChild(mesh);
      eyeMeshes.push({
        mesh: mesh,
        region: region,
        rows: ROWS,
        cols: COLS
      });
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

  function positionEyeMesh(em, spriteX, spriteY, scX, scY) {
    var tw = sprite.texture.width;
    var th = sprite.texture.height;
    var r = em.region;

    // The mesh's vertex positions define where it renders on screen
    var verts = em.mesh.geometry.getBuffer('aVertexPosition').data;
    var ox = spriteX - tw * scX * 0.5 + r.x * tw * scX;
    var oy = spriteY + r.y * th * scY;
    var pw = r.w * tw * scX;
    var ph = r.h * th * scY;

    for (var row = 0; row <= em.rows; row++) {
      for (var col = 0; col <= em.cols; col++) {
        var idx = (row * (em.cols + 1) + col) * 2;
        verts[idx] = ox + (col / em.cols) * pw;
        verts[idx + 1] = oy + (row / em.rows) * ph;
      }
    }

    em.mesh.geometry.getBuffer('aVertexPosition').update();
    // Store base positions for blink deformation
    em.baseVerts = new Float32Array(verts);
    em.ox = ox;
    em.oy = oy;
    em.pw = pw;
    em.ph = ph;
  }

  function applyBlink(em, closeness) {
    if (!em.baseVerts) return;
    var verts = em.mesh.geometry.getBuffer('aVertexPosition').data;
    var ph = em.ph;
    var creaseY = em.oy + ph * creaseRatio;

    for (var row = 0; row <= em.rows; row++) {
      for (var col = 0; col <= em.cols; col++) {
        var idx = (row * (em.cols + 1) + col) * 2;
        var baseY = em.baseVerts[idx + 1];

        // Vertices below the crease line get pushed upward toward the crease
        // This simulates the lower part of the eye being hidden by the eyelid
        if (baseY > creaseY) {
          var distFromCrease = baseY - creaseY;
          var maxTravel = ph * (1 - creaseRatio);
          var t = distFromCrease / maxTravel; // 0 at crease, 1 at bottom

          // Smoothstep for natural motion
          var ease = closeness * closeness * (3 - 2 * closeness);

          // Push vertex toward crease line
          verts[idx + 1] = baseY - distFromCrease * ease;
        } else {
          verts[idx + 1] = em.baseVerts[idx + 1];
        }

        // Keep X from base
        verts[idx] = em.baseVerts[idx];
      }
    }

    em.mesh.geometry.getBuffer('aVertexPosition').update();
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

      // Position eye meshes to match sprite
      var scX = sprite.scale.x;
      var scY = sprite.scale.y;
      for (var i = 0; i < eyeMeshes.length; i++) {
        positionEyeMesh(eyeMeshes[i], sprite.x, sprite.y, scX, scY);
      }

      // Blink
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

      for (var i = 0; i < eyeMeshes.length; i++) {
        applyBlink(eyeMeshes[i], closeness);
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
