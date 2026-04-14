// Character Live2D-style Animation
// Uses PixiJS displacement filter for breathing/swaying on a static image
(function () {
  var CHAR_IMG = 'character-clean.png';
  var DISP_IMG = 'character-displacement.png';
  var LID_L_IMG = 'eyelid-left.png';
  var LID_R_IMG = 'eyelid-right.png';

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
  var lidL = null;
  var lidR = null;
  var time = 0;
  var mouseX = 0;
  var mouseY = 0;
  var isHovering = false;

  // Blink state
  var blinkTimer = 0;
  var blinkInterval = 3 + Math.random() * 4; // 3-7 seconds between blinks
  var blinkPhase = 0; // 0 = open, >0 = in blink animation
  var BLINK_DURATION = 0.15; // seconds for close, same for open

  // Eye positions in normalized image coordinates
  var leftEye = { x: 0.406, y: 0.233, w: 0.110, h: 0.036 };
  var rightEye = { x: 0.533, y: 0.231, w: 0.102, h: 0.036 };

  PIXI.Assets.load([CHAR_IMG, DISP_IMG, LID_L_IMG, LID_R_IMG]).then(function (textures) {
    sprite = new PIXI.Sprite(textures[CHAR_IMG]);
    sprite.anchor.set(0.5, 0);
    app.stage.addChild(sprite);

    dispSprite = new PIXI.Sprite(textures[DISP_IMG]);
    dispSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    dispFilter = new PIXI.DisplacementFilter(dispSprite, 0);
    app.stage.addChild(dispSprite);
    sprite.filters = [dispFilter];

    // Eyelid overlays
    lidL = new PIXI.Sprite(textures[LID_L_IMG]);
    lidL.anchor.set(0, 0);
    lidL.scale.y = 0; // hidden by default
    app.stage.addChild(lidL);

    lidR = new PIXI.Sprite(textures[LID_R_IMG]);
    lidR.anchor.set(0, 0);
    lidR.scale.y = 0;
    app.stage.addChild(lidR);

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

    // Position eyelids relative to sprite
    positionLids(scale);
  }

  function positionLids(scale) {
    if (!lidL || !lidR || !sprite) return;
    var tw = sprite.texture.width;
    var th = sprite.texture.height;
    var ox = sprite.x - tw * scale * 0.5; // sprite left edge

    lidL.x = ox + leftEye.x * tw * scale;
    lidL.y = sprite.y + leftEye.y * th * scale;
    lidL.width = leftEye.w * tw * scale;
    // height set by blink animation

    lidR.x = ox + rightEye.x * tw * scale;
    lidR.y = sprite.y + rightEye.y * th * scale;
    lidR.width = rightEye.w * tw * scale;
  }

  function animate(delta) {
    time += delta * 0.016;

    var s = getSize();

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

      // Update eyelid positions to follow sprite
      positionLids(baseScale * breathX);
      if (lidL) {
        lidL.x += drift;
        lidL.y += bob;
        if (isHovering) {
          lidL.x += (mouseX - s.w / 2) * 0.04;
          lidL.y += (mouseY - s.h / 2) * 0.02;
        }
      }
      if (lidR) {
        lidR.x += drift;
        lidR.y += bob;
        if (isHovering) {
          lidR.x += (mouseX - s.w / 2) * 0.04;
          lidR.y += (mouseY - s.h / 2) * 0.02;
        }
      }
    }

    // Blink animation
    blinkTimer += delta * 0.016;
    if (blinkPhase === 0 && blinkTimer >= blinkInterval) {
      blinkPhase = 0.001; // start blink
      blinkTimer = 0;
      blinkInterval = 3 + Math.random() * 4;
      // 20% chance of double blink
      if (Math.random() < 0.2) {
        blinkInterval = 0.4;
      }
    }

    if (blinkPhase > 0) {
      blinkPhase += delta * 0.016;
      var t = blinkPhase;
      var closeness = 0;
      if (t < BLINK_DURATION) {
        // Closing
        closeness = t / BLINK_DURATION;
      } else if (t < BLINK_DURATION * 2) {
        // Opening
        closeness = 1 - (t - BLINK_DURATION) / BLINK_DURATION;
      } else {
        // Done
        blinkPhase = 0;
        closeness = 0;
      }

      var eyeH_L = leftEye.h * sprite.texture.height * (sprite.scale.y || 1);
      var eyeH_R = rightEye.h * sprite.texture.height * (sprite.scale.y || 1);
      if (lidL) lidL.height = eyeH_L * closeness;
      if (lidR) lidR.height = eyeH_R * closeness;
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
