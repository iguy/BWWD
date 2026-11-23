---
title: "Animation: How a Drawing Learns to Blink"
slug: "animation"
oldUrl: "https://betterworldwithdesign.com/animation/"
oldPath: "/animation/"
pubDate: "2022-10-04"
updated: "2026-11-23"
description: "Four tiny animated drawings of an eye blinking, and a plain-English explanation of how a picture made of shapes can move on its own."
cover: "./images/animation/animation.svg"
coverAlt: ""
categories: ["Programming & Development"]
tags: []
wpId: 949
status: "pulled"
---

<p class="lede">These four little loops are early sketches of an eye: lids closing, a pupil widening, a slow breath. They were my first tries at making a drawing move with nothing but the picture file itself. No video, no plug-in, no code running in the background.</p>

<style>
.an-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 2rem 0; }
.an-grid figure { margin: 0; background: #2a2622; padding: 1rem; }
.an-grid img { width: 100%; height: auto; display: block; }
.an-grid figcaption { margin-top: .6rem; color: #ece4d3; font-size: .9rem; line-height: 1.4; }
@media (max-width: 640px) { .an-grid { grid-template-columns: 1fr; } }
</style>

<div class="an-grid">
  <figure><img src="./images/animation/animation.svg" alt="Two bars close in from the top and bottom while an oval squashes flat, like an eye blinking." /><figcaption><b>The blink.</b> Two bars slide in like eyelids while the oval in the middle squashes flat, then everything opens again. One loop takes 12 seconds.</figcaption></figure>
  <figure><img src="./images/animation/animation-1-1.svg" alt="A second version of the blink with slightly different shapes." /><figcaption><b>The blink, again.</b> The same idea with a small change to the shapes, to see how much a detail changes the feel.</figcaption></figure>
  <figure><img src="./images/animation/circle.svg" alt="Circles grow and shrink inside each other, like a pupil adjusting to light." /><figcaption><b>The pupil.</b> Rings grow and shrink inside each other, like an eye adjusting to the light.</figcaption></figure>
  <figure><img src="./images/animation/circle-1.svg" alt="A simpler version of the circles growing and shrinking." /><figcaption><b>The breath.</b> A simpler version: fewer rings, slower movement, more like breathing than looking.</figcaption></figure>
</div>

<h2>What you're looking at, in plain English</h2>
<p><strong>These are drawings, not videos.</strong> A video is a stack of photographs played one after another. Each of these is a single drawing made of a few shapes: some bars, a few circles and an oval. That's why each file is tiny, about the size of a short email.</p>
<p><strong>The drawing carries its own instructions.</strong> Tucked inside each file is a short list of notes, a bit like stage directions: "at the start, the top bar is here; halfway through, it's moved down to here; at the end, it's back where it began." The web browser reads those notes and fills in every step between them, smoothly, many times a second.</p>
<p><strong>Animators call those notes keyframes.</strong> Old cartoon studios worked the same way. A lead artist drew the important poses, the key frames, and assistants drew everything in between. Here the browser does the assistants' job.</p>
<p><strong>Why it stays sharp.</strong> The file type is called SVG (scalable vector graphics). Instead of storing dots of colour, it stores shapes as measurements, like "a circle this wide, at this spot". So it looks crisp on a phone, a laptop or a cinema screen, and it never goes blurry when you zoom in.</p>
<p><strong>Where it led.</strong> These blinking sketches turned into something bigger: a pair of eyes that follow your cursor around the page. You can see that in the <a href="/interactive-divi-eye-animation-a-living-plates-tutorial/">Living Plates eye animation tutorial</a>, and there's a cube that turns to look at your mouse on the <a href="/cube/">cube page</a>.</p>
