// Character Live2D-style Animation
// Uses PixiJS displacement filter for breathing/swaying on a static image
(function () {
  var CHAR_IMG = 'character-clean.png';
  var DISP_IMG = 'character-displacement.png';

  var canvas = document.getElementById('charCanvas');
  if (!canvas) return;

  var panel = canvas.parentElement;

  function getSize() {
    var w = panel.clientWidth || 160;
    var h = panel.clientHeight || 300;
    // Ensure minimum dimensions
    if (h < 100) h = 300;
    if (w < 80) w = 160;
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
    resolution: window.devicePixelRatio || 1,
  });

  var sprite = null;
  var dispSprite = null;
  var dispFilter = null;
  var time = 0;
  var mouseX = 0;
  var mouseY = 0;
  var isHovering = false;

  PIXI.Assets.load([CHAR_IMG, DISP_IMG]).then(function (textures) {
    // Character sprite
    sprite = new PIXI.Sprite(textures[CHAR_IMG]);
    sprite.anchor.set(0.5, 0);
    app.stage.addChild(sprite);

    // Displacement filter for breathing/swaying
    dispSprite = new PIXI.Sprite(textures[DISP_IMG]);
    dispSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    dispFilter = new PIXI.DisplacementFilter(dispSprite, 0);
    app.stage.addChild(dispSprite);
    sprite.filters = [dispFilter];

    fitSprite();

    // Start animation loop
    app.ticker.add(animate);
  });

  function fitSprite() {
    if (!sprite) return;
    var s = getSize();
    app.renderer.resize(s.w, s.h);

    var tw = sprite.texture.width;
    var th = sprite.texture.height;

    // Cover: fill panel, crop overflow
    var scale = Math.max(s.w / tw, s.h / th);
    sprite.scale.set(scale);
    sprite.x = s.w / 2;
    sprite.y = 0;
  }

  function animate(delta) {
    time += delta * 0.016;

    var s = getSize();

    // Breathing: gentle vertical scale oscillation
    var breathCycle = Math.sin(time * 1.8) * 0.004;
    var breathY = 1 + breathCycle;

    // Idle sway: slow horizontal drift
    var swayCycle = Math.sin(time * 0.7) * 0.003;
    var swayX = 1 + swayCycle;

    if (sprite) {
      var tw = sprite.texture.width;
      var th = sprite.texture.height;
      var baseScale = Math.max(s.w / tw, s.h / th);

      sprite.scale.set(baseScale * swayX, baseScale * breathY);
      sprite.x = s.w / 2;

      // Subtle pivot toward mouse on hover
      if (isHovering) {
        sprite.x += (mouseX - s.w / 2) * 0.01;
        sprite.y = (mouseY - s.h / 2) * 0.005;
      } else {
        sprite.y = 0;
      }
    }

    // Displacement: animate for flowing hair/robe effect
    if (dispFilter) {
      var dispScale = 4 + Math.sin(time * 1.2) * 3;
      dispFilter.scale.x = dispScale * (isHovering ? 1.8 : 1);
      dispFilter.scale.y = Math.sin(time * 1.8) * 2;
    }

    if (dispSprite) {
      dispSprite.x = Math.sin(time * 0.6) * 5;
      dispSprite.y = Math.cos(time * 0.9) * 4;
    }
  }

  // Mouse tracking
  panel.addEventListener('mouseenter', function () { isHovering = true; });
  panel.addEventListener('mouseleave', function () { isHovering = false; });
  panel.addEventListener('mousemove', function (e) {
    var rect = panel.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  // Resize handling
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitSprite, 100);
  });

  // Also refit when tsum content changes (MutationObserver)
  var tsum = document.getElementById('tsum');
  if (tsum) {
    var observer = new MutationObserver(function () {
      setTimeout(fitSprite, 50);
    });
    observer.observe(tsum, { childList: true, subtree: true, characterData: true });
  }
})();
