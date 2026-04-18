// Character Live2D-style Animation
// Displacement filter + per-eye patch blink (base stays static)
(function () {
  var CHAR_IMG      = 'assets/images/character-open.png';
  var DISP_IMG      = 'assets/images/character-displacement.png';
  var EYE_L_HALF    = 'assets/images/eye-L-half.png';
  var EYE_L_CLOSED  = 'assets/images/eye-L-closed.png';
  var EYE_R_HALF    = 'assets/images/eye-R-half.png';
  var EYE_R_CLOSED  = 'assets/images/eye-R-closed.png';

  // Anchor X at the head's horizontal centroid so the head lands at panel center.
  var ANCHOR_X = 0.630;

  // Per-eye patch positions as fractions of the base image (1024x1266).
  // Tight crops covering only the eye region itself (no eyebrow/forehead).
  var EYE_L = { x: 0.5137, y: 0.2385, w: 0.0850, h: 0.0458 };
  var EYE_R = { x: 0.6582, y: 0.2417, w: 0.0859, h: 0.0427 };

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
    resolution: Math.min(window.devicePixelRatio || 1, 3),
  });

  PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.LINEAR;
  PIXI.BaseTexture.defaultOptions.mipmap = PIXI.MIPMAP_MODES.ON;

  var charContainer = null;
  var sprite = null;
  var eyeL = null;
  var eyeR = null;
  var texL_half = null, texL_closed = null, curL = null;
  var texR_half = null, texR_closed = null, curR = null;
  var dispSprite = null;
  var dispFilter = null;
  var time = 0;
  var mouseX = 0;
  var mouseY = 0;
  var isHovering = false;
  var currentParallaxX = 0;
  var currentParallaxY = 0;
  var targetParallaxX = 0;
  var targetParallaxY = 0;
  var hoverAmount = 0;

  var blinkTimer = 0;
  var blinkInterval = 2;
  var blinkPhase = 0;
  var BLINK_SPEED = 7;

  PIXI.Assets.load([CHAR_IMG, DISP_IMG, EYE_L_HALF, EYE_L_CLOSED, EYE_R_HALF, EYE_R_CLOSED]).then(function (textures) {
    // One container for base + eye overlays so they all share a single
    // filter pass — identical displacement warp on every pixel.
    charContainer = new PIXI.Container();
    app.stage.addChild(charContainer);

    sprite = new PIXI.Sprite(textures[CHAR_IMG]);
    sprite.anchor.set(ANCHOR_X, 0);
    charContainer.addChild(sprite);

    texL_half = textures[EYE_L_HALF];
    texL_closed = textures[EYE_L_CLOSED];
    texR_half = textures[EYE_R_HALF];
    texR_closed = textures[EYE_R_CLOSED];
    curL = texL_half;
    curR = texR_half;

    eyeL = new PIXI.Sprite(texL_half);
    eyeL.anchor.set(0, 0);
    eyeL.visible = false;
    charContainer.addChild(eyeL);

    eyeR = new PIXI.Sprite(texR_half);
    eyeR.anchor.set(0, 0);
    eyeR.visible = false;
    charContainer.addChild(eyeR);

    dispSprite = new PIXI.Sprite(textures[DISP_IMG]);
    dispSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    dispFilter = new PIXI.DisplacementFilter(dispSprite, 0);
    // Single filter on the container — composited base+eyes warp as one image
    charContainer.filters = [dispFilter];
    app.stage.addChild(dispSprite);

    fitSprite();
    app.ticker.add(animate);
  }).catch(function () {
    // Asset load failed — degrade gracefully, calculator still works
  });

  function fitSprite() {
    if (!sprite) return;
    var s = getSize();
    app.renderer.resize(s.w, s.h);
    var tw = sprite.texture.width;
    var th = sprite.texture.height;
    var baseScale = Math.min(s.w / tw, s.h / th);
    sprite.scale.set(baseScale);
    // On mobile the character is its own full panel → head at 50% (screen center).
    // On desktop the character overlaps the report box → head at 65% (visible center).
    var xRatio = window.innerWidth < 768 ? 0.5 : 0.65;
    sprite.x = s.w * xRatio;
    sprite.y = 0;
    positionEyes();
  }

  function placeEye(sp, frac) {
    var tw = sprite.texture.width;
    var th = sprite.texture.height;
    var sx = sprite.scale.x;
    var sy = sprite.scale.y;
    var imgLeft = sprite.x - ANCHOR_X * tw * sx;
    var imgTop  = sprite.y;
    sp.x = imgLeft + frac.x * tw * sx;
    sp.y = imgTop  + frac.y * th * sy;
    sp.width  = frac.w * tw * sx;
    sp.height = frac.h * th * sy;
  }

  function positionEyes() {
    if (!sprite || !eyeL || !eyeR) return;
    placeEye(eyeL, EYE_L);
    placeEye(eyeR, EYE_R);
  }

  function animate(delta) {
    if (panel.offsetParent === null || panel.clientHeight === 0) return;
    time += delta * 0.016;
    var s = getSize();
    var dt = delta * 0.016;

    if (sprite) {
      var tw = sprite.texture.width;
      var th = sprite.texture.height;
      var baseScale = Math.min(s.w / tw, s.h / th);

      var breathY = 1 + Math.sin(time * 2.2) * 0.015;
      var breathX = 1 + Math.sin(time * 2.2) * 0.005;
      sprite.scale.set(baseScale * breathX, baseScale * breathY);

      var drift = Math.sin(time * 0.7) * 6;
      var xRatio = window.innerWidth < 768 ? 0.5 : 0.65;
      sprite.x = s.w * xRatio + drift;

      var bob = Math.sin(time * 1.0) * 3;
      sprite.y = bob;

      var hoverTarget = isHovering ? 1 : 0;
      var hoverLerp = isHovering ? 0.06 : 0.003;
      hoverAmount += (hoverTarget - hoverAmount) * hoverLerp;

      if (isHovering) {
        targetParallaxX = (mouseX - s.w / 2) * 0.04;
        targetParallaxY = (mouseY - s.h / 2) * 0.02;
      }
      targetParallaxX *= isHovering ? 1 : 0.998;
      targetParallaxY *= isHovering ? 1 : 0.998;

      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.05;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.05;
      sprite.x += currentParallaxX;
      sprite.y += currentParallaxY;

      positionEyes();

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

      if (closeness < 0.33) {
        eyeL.visible = false;
        eyeR.visible = false;
      } else {
        eyeL.visible = true;
        eyeR.visible = true;
        var nextL = closeness >= 0.75 ? texL_closed : texL_half;
        var nextR = closeness >= 0.75 ? texR_closed : texR_half;
        if (nextL !== curL) { eyeL.texture = nextL; curL = nextL; }
        if (nextR !== curR) { eyeR.texture = nextR; curR = nextR; }
      }
    }

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
