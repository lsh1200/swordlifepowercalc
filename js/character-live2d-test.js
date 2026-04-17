// Character Live2D-style Animation
// Displacement filter + 2-frame eye overlay blink (half -> closed crossfade)
(function () {
  var CHAR_IMG   = 'assets/images/character-clean.png';
  var DISP_IMG   = 'assets/images/character-displacement.png';
  var EYE_HALF   = 'assets/images/eye-half-closed.png';
  var EYE_CLOSED = 'assets/images/eye-closed.png';

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
  var dispFilterHalf = null;
  var dispFilterClosed = null;
  var eyeHalf = null;
  var eyeClosed = null;
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

  // Eye region position normalized against 1024x1536 base (see scripts/extract-character-assets.py)
  var eyeRegionPos = { x: 378/1024, y: 218/1536, w: 274/1024, h: 94/1536 };

  PIXI.Assets.load([CHAR_IMG, DISP_IMG, EYE_HALF, EYE_CLOSED]).then(function (textures) {
    sprite = new PIXI.Sprite(textures[CHAR_IMG]);
    sprite.anchor.set(0.5, 0);
    app.stage.addChild(sprite);

    dispSprite = new PIXI.Sprite(textures[DISP_IMG]);
    dispSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    dispFilter = new PIXI.DisplacementFilter(dispSprite, 0);
    dispFilterHalf = new PIXI.DisplacementFilter(dispSprite, 0);
    dispFilterClosed = new PIXI.DisplacementFilter(dispSprite, 0);
    app.stage.addChild(dispSprite);
    sprite.filters = [dispFilter];

    // Eye overlays (half + closed crossfade during blink)
    eyeHalf = new PIXI.Sprite(textures[EYE_HALF]);
    eyeHalf.visible = false;
    eyeHalf.alpha = 0;
    eyeHalf.filters = [dispFilterHalf];
    app.stage.addChild(eyeHalf);

    eyeClosed = new PIXI.Sprite(textures[EYE_CLOSED]);
    eyeClosed.visible = false;
    eyeClosed.alpha = 0;
    eyeClosed.filters = [dispFilterClosed];
    app.stage.addChild(eyeClosed);

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
    if (!sprite || !eyeHalf || !eyeClosed) return;
    var tw = sprite.texture.width;
    var th = sprite.texture.height;
    var scX = sprite.scale.x;
    var scY = sprite.scale.y;
    var ox = sprite.x - tw * scX * 0.5;
    var oy = sprite.y;

    var ex = ox + eyeRegionPos.x * tw * scX;
    var ey = oy + eyeRegionPos.y * th * scY;
    var ew = eyeRegionPos.w * tw * scX;
    var eh = eyeRegionPos.h * th * scY;

    eyeHalf.x = eyeClosed.x = ex;
    eyeHalf.y = eyeClosed.y = ey;
    eyeHalf.width  = eyeClosed.width  = ew;
    eyeHalf.height = eyeClosed.height = eh;
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

      if (eyeHalf && eyeClosed) {
        // closeness 0.0  -> neither visible
        // closeness 0.5  -> half at full, closed hidden
        // closeness 1.0  -> closed at full, half fading back out
        var halfAlpha   = Math.max(0, 1 - Math.abs(closeness - 0.5) * 2);
        var closedAlpha = Math.max(0, (closeness - 0.5) * 2);
        eyeHalf.visible   = halfAlpha   > 0.02;
        eyeClosed.visible = closedAlpha > 0.02;
        eyeHalf.alpha   = halfAlpha;
        eyeClosed.alpha = closedAlpha;
      }
    }

    // Displacement — hover boost uses smooth hoverAmount
    if (dispFilter) {
      var hoverBoost = 1 + hoverAmount * 0.5;
      var dispX = (8 + Math.sin(time * 1.3) * 5) * hoverBoost;
      var dispY = (5 + Math.cos(time * 1.8) * 3) * hoverBoost;
      dispFilter.scale.x = dispX;
      dispFilter.scale.y = dispY;
      if (dispFilterHalf)   { dispFilterHalf.scale.x   = dispX; dispFilterHalf.scale.y   = dispY; }
      if (dispFilterClosed) { dispFilterClosed.scale.x = dispX; dispFilterClosed.scale.y = dispY; }
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
