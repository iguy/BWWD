---
title: "Cube"
slug: "cube"
oldUrl: "https://betterworldwithdesign.com/cube/"
oldPath: "/cube/"
pubDate: "2022-10-03"
updated: "2026-11-23"
description: "A 3D cube in CSS that follows your mouse: move to tilt it, drag to spin it."
cover: ""
coverAlt: ""
categories: ["Programming & Development"]
tags: []
wpId: 929
status: "pulled"
---

<p class="lede">Move your mouse and the cube turns to look at it. Drag it, or swipe on a phone, to give it a spin. It's built from six HTML squares and CSS 3D transforms, with a little JavaScript for the motion.</p>

<style>
.bc-stage { position: relative; height: min(70vh, 520px); margin: 2rem 0; display: grid; place-items: center; perspective: 900px; background: var(--paper-deep, #ddd2bd); overflow: hidden; touch-action: none; cursor: grab; user-select: none; }
.bc-stage.is-drag { cursor: grabbing; }
.bc-cube { --size: min(48vw, 240px); position: relative; width: var(--size); height: var(--size); transform-style: preserve-3d; will-change: transform; }
.bc-face { position: absolute; inset: 0; display: grid; place-items: center; border: 6px solid #2a2622; backface-visibility: hidden; }
.bc-face::after { content: ""; display: block; }
.bc-front  { transform: translateZ(calc(var(--size) / 2)); background: #ece4d3; }
.bc-front::after { width: 62%; aspect-ratio: 1; border-radius: 50%; background: #a9503d; }
.bc-back   { transform: rotateY(180deg) translateZ(calc(var(--size) / 2)); background: #44596f; }
.bc-back::after { width: 55%; aspect-ratio: 1; background: #ece4d3; }
.bc-right  { transform: rotateY(90deg) translateZ(calc(var(--size) / 2)); background: #c79d4f; }
.bc-right::after { width: 64%; aspect-ratio: 1; background: #2a2622; clip-path: polygon(50% 6%, 100% 94%, 0 94%); }
.bc-left   { transform: rotateY(-90deg) translateZ(calc(var(--size) / 2)); background: #2a2622; }
.bc-left::after { width: 60%; aspect-ratio: 1; border-radius: 50%; background: #c79d4f; box-shadow: 0 0 0 calc(var(--size) * .06) #2a2622, 0 0 0 calc(var(--size) * .1) #a9503d; }
.bc-top    { transform: rotateX(90deg) translateZ(calc(var(--size) / 2)); background: #a9503d; }
.bc-top::after { width: 70%; height: 22%; background: #ece4d3; }
.bc-bottom { transform: rotateX(-90deg) translateZ(calc(var(--size) / 2)); background: #ece4d3; }
.bc-bottom::after { width: 60%; aspect-ratio: 1; background: #44596f; clip-path: polygon(0 0, 100% 0, 0 100%); }
.bc-shadow { position: absolute; bottom: 12%; width: 40%; height: 18px; border-radius: 50%; background: rgba(42,38,34,.25); filter: blur(8px); }
.bc-hint { position: absolute; left: 1rem; bottom: .8rem; margin: 0; font-size: .72rem; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: #5a534a; }
</style>

<div class="bc-stage" aria-label="A 3D cube that turns towards your pointer. Drag to spin it." role="img">
  <div class="bc-shadow"></div>
  <div class="bc-cube">
    <div class="bc-face bc-front"></div><div class="bc-face bc-back"></div>
    <div class="bc-face bc-right"></div><div class="bc-face bc-left"></div>
    <div class="bc-face bc-top"></div><div class="bc-face bc-bottom"></div>
  </div>
  <p class="bc-hint">Move · drag · flick</p>
</div>

<script>
(function () {
  var stage = document.querySelector('.bc-stage'), cube = stage && stage.querySelector('.bc-cube');
  if (!cube) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rx = -18, ry = 32, vx = 0, vy = 0, tx = -18, ty = 32, drag = null, idle = 0;
  function frame() {
    if (drag) { /* position set by the pointer */ }
    else if (Math.abs(vx) > 0.02 || Math.abs(vy) > 0.02) { rx += vx; ry += vy; vx *= 0.95; vy *= 0.95; tx = rx; ty = ry; }
    else { idle++; if (idle > 120 && !reduce) ty += 0.15; rx += (tx - rx) * 0.08; ry += (ty - ry) * 0.08; }
    cube.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
    requestAnimationFrame(frame);
  }
  // Pointer anywhere on the page: the cube turns towards it
  window.addEventListener('pointermove', function (e) {
    if (drag) return;
    var r = stage.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var dx = Math.max(-1, Math.min(1, (e.clientX - cx) / (innerWidth / 2)));
    var dy = Math.max(-1, Math.min(1, (e.clientY - cy) / (innerHeight / 2)));
    var turns = Math.round(ry / 360) * 360;
    tx = -dy * 40; ty = turns + dx * 55; idle = 0;
  }, { passive: true });
  // Drag to spin, with momentum on release
  stage.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, y: e.clientY }; vx = vy = 0; stage.classList.add('is-drag'); stage.setPointerCapture(e.pointerId); });
  stage.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY;
    ry += dx * 0.5; rx -= dy * 0.5; vy = dx * 0.5; vx = -dy * 0.5; idle = 0;
  });
  function end() { if (!drag) return; drag = null; stage.classList.remove('is-drag'); }
  stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
  requestAnimationFrame(frame);
})();
</script>

<h2>How it works</h2>
<p>Each face is a square div pushed out from the centre with <code>translateZ</code> and turned into place with <code>rotateX</code> or <code>rotateY</code>. The parent uses <code>transform-style: preserve-3d</code> so the faces share one 3D space, and the stage sets the <code>perspective</code>.</p>
<p>The script eases the cube's rotation toward a target set by where your pointer is, keeps the speed of a drag after you let go, and lets it drift slowly when nobody is touching it. The faces carry the Bauhaus shapes used across this site: circle, square and triangle.</p>
