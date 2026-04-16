// Character Live2D-style Animation
// Displacement filter + AI-generated closed-eye overlay blink
(function () {
  var CHAR_IMG = 'assets/images/character-clean.png';
  var DISP_IMG = 'assets/images/character-displacement.png';
  var EYE_L = 'assets/images/eye-left-closed.png';
  var EYE_R = 'assets/images/eye-right-closed.png';

  if (typeof PIXI === 'undefined') return;
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
  var eyeL = null;
  var eyeR = null;
  var time = 0;
  var mouseX = 0;
  var mouseY = 0;
  var isHovering = false;
  var currentParallaxX = 0;
  var currentParallaxY = 0;
  var targetParallaxX = 0;
  var targetParallaxY = 0;
  var hoverAmount = 0; // 0=not hovering, 1=fully hovering (lerped)

  // Blink
  var blinkTimer = 0;
  var blinkInterval = 2;
  var blinkPhase = 0;
  var BLINK_SPEED = 7;

  // Eye patch positions in full 591x848 image (normalized)
  var leftEyePos  = { x: 210/591, y: 215/848, w: 90/591, h: 50/848 };
  var rightEyePos = { x: 320/591, y: 213/848, w: 85/591, h: 50/848 };

  PIXI.Assets.load([CHAR_IMG, DISP_IMG, EYE_L, EYE_R]).then(function (textures) {
    sprite = new PIXI.Sprite(textures[CHAR_IMG]);
    sprite.anchor.set(0.5, 0);
    app.stage.addChild(sprite);

    dispSprite = new PIXI.Sprite(textures[DISP_IMG]);
    dispSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    dispFilter = new PIXI.DisplacementFilter(dispSprite, 0);
    app.stage.addChild(dispSprite);
    sprite.filters = [dispFilter];

    // Closed-eye overlays
    eyeL = new PIXI.Sprite(textures[EYE_L]);
    eyeL.visible = false;
    eyeL.alpha = 0;
    app.stage.addChild(eyeL);

    eyeR = new PIXI.Sprite(textures[EYE_R]);
    eyeR.visible = false;
    eyeR.alpha = 0;
    app.stage.addChild(eyeR);

    fitSprite();
    app.ticker.add(animate);
  }).catch(function() {
    // Asset load failed — degrade gracefully, calculator still works
  });

  var isMobile = window.innerWidth < 768;

  function fitSprite() {
    if (!sprite) return;
    var s = getSize();
    app.renderer.resize(s.w, s.h);
    var tw = sprite.texture.width;
    var th = sprite.texture.height;
    var scale = s.w / tw;
    sprite.scale.set(scale);
    sprite.x = s.w * (isMobile ? 0.50 : 0.55);
    sprite.y = 0;
  }

  function positionEyes() {
    if (!sprite || !eyeL || !eyeR) return;
    var tw = sprite.texture.width;
    var th = sprite.texture.height;
    var scX = sprite.scale.x;
    var scY = sprite.scale.y;
    var ox = sprite.x - tw * scX * 0.5;
    var oy = sprite.y;

    eyeL.x = ox + leftEyePos.x * tw * scX;
    eyeL.y = oy + leftEyePos.y * th * scY;
    eyeL.width = leftEyePos.w * tw * scX;
    eyeL.height = leftEyePos.h * th * scY;

    eyeR.x = ox + rightEyePos.x * tw * scX;
    eyeR.y = oy + rightEyePos.y * th * scY;
    eyeR.width = rightEyePos.w * tw * scX;
    eyeR.height = rightEyePos.h * th * scY;
  }

  function animate(delta) {
    // Skip rendering when panel is hidden to save GPU/CPU
    if (panel.offsetParent === null || panel.clientHeight === 0) return;
    time += delta * 0.016;
    var s = getSize();
    var dt = delta * 0.016;

    if (sprite) {
      var tw = sprite.texture.width;
      var th = sprite.texture.height;
      var baseScale = isMobile ? (s.w / tw) : Math.max(s.w / tw, s.h / th);

      var breathY = 1 + Math.sin(time * 2.2) * 0.015;
      var breathX = 1 + Math.sin(time * 2.2) * 0.005;
      sprite.scale.set(baseScale * breathX, baseScale * breathY);

      var drift = Math.sin(time * 0.7) * (isMobile ? 3 : 6);
      sprite.x = s.w * (isMobile ? 0.50 : 0.55) + drift;

      var bob = Math.sin(time * 1.0) * 3;
      sprite.y = bob;

      // Lerp hover amount — slow fade out when cursor leaves
      var hoverTarget = isHovering ? 1 : 0;
      var hoverLerp = isHovering ? 0.06 : 0.003;
      hoverAmount += (hoverTarget - hoverAmount) * hoverLerp;

      if (isHovering) {
        targetParallaxX = (mouseX - s.w / 2) * 0.04;
        targetParallaxY = (mouseY - s.h / 2) * 0.02;
      }
      // When not hovering, target stays at last position and slowly decays
      targetParallaxX *= isHovering ? 1 : 0.998;
      targetParallaxY *= isHovering ? 1 : 0.998;

      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.05;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.05;
      sprite.x += currentParallaxX;
      sprite.y += currentParallaxY;

      // Position eye overlays to match sprite
      positionEyes();

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
        closeness = closeness * closeness * (3 - 2 * closeness);
      }

      if (eyeL && eyeR) {
        eyeL.visible = closeness > 0.05;
        eyeR.visible = closeness > 0.05;
        eyeL.alpha = closeness;
        eyeR.alpha = closeness;
      }
    }

    // Displacement — hover boost uses smooth hoverAmount
    if (dispFilter) {
      var hoverBoost = 1 + hoverAmount * 0.5;
      dispFilter.scale.x = (8 + Math.sin(time * 1.3) * 5) * hoverBoost;
      dispFilter.scale.y = (5 + Math.cos(time * 1.8) * 3) * hoverBoost;
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
