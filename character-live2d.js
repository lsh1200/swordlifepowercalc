// Character Live2D-style Animation
// Uses PixiJS displacement filter for breathing/swaying on a static image
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
    resolution: 2,  // 2x resolution for sharp rendering
  });

  var sprite = null;
  var dispSprite = null;
  var dispFilter = null;
  var time = 0;
  var mouseX = 0;
  var mouseY = 0;
  var isHovering = false;

  PIXI.Assets.load([CHAR_IMG, DISP_IMG]).then(function (textures) {
    sprite = new PIXI.Sprite(textures[CHAR_IMG]);
    sprite.anchor.set(0.5, 0);
    app.stage.addChild(sprite);

    dispSprite = new PIXI.Sprite(textures[DISP_IMG]);
    dispSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    dispFilter = new PIXI.DisplacementFilter(dispSprite, 0);
    app.stage.addChild(dispSprite);
    sprite.filters = [dispFilter];

    fitSprite();
    app.ticker.add(animate);
  });

  function fitSprite() {
    if (!sprite) return;
    var s = getSize();
    app.renderer.resize(s.w, s.h);

    var tw = sprite.texture.width;
    var th = sprite.texture.height;
    var scale = Math.max(s.w / tw, s.h / th);
    sprite.scale.set(scale);
    sprite.x = s.w / 2;
    sprite.y = 0;
  }

  function animate(delta) {
    time += delta * 0.016;

    var s = getSize();

    // Breathing — visible chest rise/fall
    var breathCycle = Math.sin(time * 2.0) * 0.008;
    var breathY = 1 + breathCycle;

    // Idle sway — gentle side-to-side rocking
    var swayCycle = Math.sin(time * 0.8) * 0.005;
    var swayX = 1 + swayCycle;

    if (sprite) {
      var tw = sprite.texture.width;
      var th = sprite.texture.height;
      var baseScale = Math.max(s.w / tw, s.h / th);

      sprite.scale.set(baseScale * swayX, baseScale * breathY);

      // Horizontal drift — character sways left/right
      var drift = Math.sin(time * 0.6) * 3;
      sprite.x = s.w / 2 + drift;

      // Mouse parallax on hover
      if (isHovering) {
        sprite.x += (mouseX - s.w / 2) * 0.02;
        sprite.y = (mouseY - s.h / 2) * 0.01;
      } else {
        // Subtle vertical bob
        sprite.y = Math.sin(time * 1.2) * 1.5;
      }
    }

    // Displacement — hair and robe flowing
    if (dispFilter) {
      var baseDisp = 8 + Math.sin(time * 1.0) * 6;
      dispFilter.scale.x = baseDisp * (isHovering ? 2.0 : 1);
      dispFilter.scale.y = 5 + Math.sin(time * 1.5) * 4;
    }

    if (dispSprite) {
      // Scroll displacement map for organic wave motion
      dispSprite.x = Math.sin(time * 0.5) * 8;
      dispSprite.y = Math.cos(time * 0.7) * 6;
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

  // Resize
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitSprite, 100);
  });

  // Refit when report content changes
  var tsum = document.getElementById('tsum');
  if (tsum) {
    var observer = new MutationObserver(function () {
      setTimeout(fitSprite, 50);
    });
    observer.observe(tsum, { childList: true, subtree: true, characterData: true });
  }
})();
