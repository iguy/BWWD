---
title: "Interactive Divi Eye Animation: A Living Plates Tutorial"
slug: "interactive-divi-eye-animation-a-living-plates-tutorial"
oldUrl: "https://betterworldwithdesign.com/interactive-divi-eye-animation-a-living-plates-tutorial/"
oldPath: "/interactive-divi-eye-animation-a-living-plates-tutorial/"
pubDate: "2026-06-17"
updated: "2026-06-17"
description: ""
cover: ""
coverAlt: ""
categories: ["Programming & Development"]
tags: []
wpId: 7622
status: "pulled"
---

<div class="et_pb_section_0 et_pb_section et_section_regular et_flex_section">
<div class="et_pb_row_0 et_pb_row et_flex_row">
<div class="et_pb_column_0 et_pb_column et-last-child et_flex_column et_pb_css_mix_blend_mode_passthrough et_flex_column_24_24 et_flex_column_24_24_tablet et_flex_column_24_24_phone">
<div class="et_pb_code_0 et_pb_code et_pb_module"><div class="et_pb_code_inner"><!-- ============================================================
     DELSARTE EYES (v2) — paste ALL of this into ONE Divi Code module,
     replacing what's there now. Scoped to .eyes-plate.
     Change from v1: pupils follow the cursor for everyone; only the
     idle drift + blinking switch off under "reduce motion".
     ============================================================ -->

<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=EB+Garamond:ital@0;1&display=swap" rel="stylesheet">

<style>
.eyes-plate{
  --paper:#e7dcc4; --paper-light:#f3ecdb; --paper-edge:#c9bc9c;
  --ink:#241c14; --ink-soft:#5a4d3c; --oxblood:#6e2b2b;
  position:relative; overflow:hidden;
  max-width:760px; margin:0 auto;
  padding:clamp(26px,5vw,54px) clamp(22px,5vw,58px) clamp(22px,4vw,44px);
  background:linear-gradient(180deg,#ece2cc,#e3d7bd);
  outline:1px solid var(--ink); outline-offset:-7px;
  box-shadow:0 0 0 1px var(--ink),0 18px 50px -28px rgba(36,28,20,.65);
  font-family:"EB Garamond",Georgia,serif; color:var(--ink);
}
.eyes-plate *{box-sizing:border-box}
.eyes-plate::before{
  content:""; position:absolute; inset:0; pointer-events:none;
  opacity:.05; mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.eyes-plate__fig{ position:absolute; top:14px; right:18px;
  font-style:italic; font-size:.92rem; color:var(--oxblood); }
.eyes-plate__eyebrow{ text-transform:uppercase; letter-spacing:.34em;
  font-size:.72rem; color:var(--ink-soft); text-align:center;
  margin:0 0 clamp(14px,3vw,22px); }
.eyes-plate svg{ display:block; width:100%; height:auto; }
.eyes-plate__title{ font-family:"Cormorant Garamond",Georgia,serif;
  font-weight:600; font-size:clamp(1.9rem,5.4vw,3rem); line-height:1.04;
  text-align:center; margin:clamp(16px,3.5vw,26px) 0 .35em; }
.eyes-plate__caption{ text-align:center; font-style:italic;
  font-size:clamp(1rem,2.6vw,1.18rem); color:var(--ink-soft); margin:0; }
.eyes-plate__rule{ width:46px; margin:18px auto 0;
  border-top:1px solid var(--ink-soft); }
.eyes-plate__hint{ text-align:center; font-size:.78rem; letter-spacing:.12em;
  text-transform:uppercase; color:var(--ink-soft); margin:14px 0 0; opacity:.7; }
</style>

<div class="eyes-plate">
  <span class="eyes-plate__fig">Fig. 1</span>
  <p class="eyes-plate__eyebrow">Delsarte System of Expression</p>
  <svg id="delsarteEyes" viewBox="0 0 600 320" role="img"
       aria-label="A pair of engraved eyes whose pupils follow your cursor."></svg>
  <h2 class="eyes-plate__title">The Eye Follows the Beholder</h2>
  <p class="eyes-plate__caption">Move across the plate — the gaze attends you.</p>
  <div class="eyes-plate__rule"></div>
  <p class="eyes-plate__hint">move your cursor · drag on touch</p>
</div>

<script>
(() => {
  const svg = document.getElementById("delsarteEyes");
  if (!svg || svg.dataset.built) return;
  svg.dataset.built = "1";
  const SVGNS="http://www.w3.org/2000/svg", VBW=600, VBH=320;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DRAW_EYEBALL = true;
  const EYES=[{cx:160,cy:160,rx:118,ry:66,ir:34},{cx:440,cy:160,rx:118,ry:66,ir:34}];
  const el=(n,a={})=>{const e=document.createElementNS(SVGNS,n);for(const k in a)e.setAttribute(k,a[k]);return e;};
  const almond=(cx,cy,rx,ry)=>`M ${cx-rx} ${cy} C ${cx-rx*0.45} ${cy-ry}, ${cx+rx*0.45} ${cy-ry}, ${cx+rx} ${cy} C ${cx+rx*0.45} ${cy+ry}, ${cx-rx*0.45} ${cy+ry}, ${cx-rx} ${cy} Z`;
  const defs=el("defs");
  EYES.forEach((e,i)=>{const cp=el("clipPath",{id:`dsopen${i}`});cp.appendChild(el("path",{d:almond(e.cx,e.cy,e.rx,e.ry)}));defs.appendChild(cp);});
  svg.appendChild(defs);
  const irisGroups=[], eyeballs=[];
  EYES.forEach((e,i)=>{
    const eye=el("g");
    const ball=el("g",{"clip-path":`url(#dsopen${i})`});
    if(DRAW_EYEBALL){
      ball.appendChild(el("path",{d:almond(e.cx,e.cy,e.rx,e.ry),fill:"var(--paper-light)"}));
      ball.appendChild(el("path",{d:almond(e.cx,e.cy,e.rx,e.ry),fill:"none",stroke:"var(--ink-soft)","stroke-width":10,opacity:.12}));
    }
    const iris=el("g");
    if(DRAW_EYEBALL){
      iris.appendChild(el("circle",{cx:e.cx,cy:e.cy,r:e.ir,fill:"#d8c8a6",stroke:"var(--ink)","stroke-width":1.6}));
      const rays=el("g",{stroke:"var(--ink-soft)","stroke-width":0.8,opacity:.75});
      for(let a=0;a<40;a++){const t=a/40*Math.PI*2;rays.appendChild(el("line",{x1:e.cx+Math.cos(t)*(e.ir*0.42),y1:e.cy+Math.sin(t)*(e.ir*0.42),x2:e.cx+Math.cos(t)*(e.ir*0.94),y2:e.cy+Math.sin(t)*(e.ir*0.94)}));}
      iris.appendChild(rays);
      iris.appendChild(el("circle",{cx:e.cx,cy:e.cy,r:e.ir*0.5,fill:"none",stroke:"var(--ink)","stroke-width":1}));
    }
    iris.appendChild(el("circle",{cx:e.cx,cy:e.cy,r:e.ir*0.46,fill:"var(--ink)"}));
    iris.appendChild(el("circle",{cx:e.cx-e.ir*0.16,cy:e.cy-e.ir*0.18,r:e.ir*0.12,fill:"var(--paper-light)",opacity:.9}));
    ball.appendChild(iris); eye.appendChild(ball);
    eye.appendChild(el("path",{d:almond(e.cx,e.cy,e.rx,e.ry),fill:"none",stroke:"var(--ink)","stroke-width":2.4,"stroke-linecap":"round"}));
    // upper-lid lashes: short, hugging the lid, fanning gently outward
    const lashes=el("g",{stroke:"var(--ink)","stroke-width":1.3,"stroke-linecap":"round"});
    const N=14;                                           // number of lashes
    for(let l=0;l<N;l++){
      const t=-0.74+(l/(N-1))*1.48;                       // position across the lid
      const s=Math.sqrt(Math.max(1e-4,1-t*t));
      const x=e.cx+t*e.rx, y=e.cy-e.ry*s;                 // point on the upper lid
      let nx=(e.ry*t)/(e.rx*s), ny=-1;                    // outward normal (up + away)
      const nl=Math.hypot(nx,ny); nx/=nl; ny/=nl;
      const L=6+3*Math.abs(t);                            // lash length (shorter now)
      const bx=x-nx*1.5, by=y-ny*1.5;                     // anchor just inside the lid
      lashes.appendChild(el("line",{x1:bx,y1:by,x2:bx+nx*(L+1.5),y2:by+ny*(L+1.5)}));
    }
    eye.appendChild(lashes);
    // eyebrow: a single clean arched stroke above the eye
    const hw=e.rx*0.78, peakY=e.cy-e.ry-30, endY=e.cy-e.ry-14, th=6;  // arch height & thickness
    eye.appendChild(el("path",{
      d:`M ${e.cx-hw} ${endY} Q ${e.cx} ${peakY} ${e.cx+hw} ${endY}`
       +` Q ${e.cx} ${peakY+th} ${e.cx-hw} ${endY} Z`,
      fill:"var(--ink)"
    }));
    svg.appendChild(eye);
    irisGroups.push({node:iris}); eyeballs.push({node:ball,e});
  });

  // ---- motion: tracking is always on; drift + blink respect reduce-motion ----
  let pointer=null,lastMove=-9999;const cur=EYES.map(()=>({x:0,y:0}));let blink={t:-9999,dur:170};
  const toVB=(x,y)=>{const r=svg.getBoundingClientRect();return{x:(x-r.left)/r.width*VBW,y:(y-r.top)/r.height*VBH};};
  const setP=(x,y)=>{pointer=toVB(x,y);lastMove=performance.now();};
  addEventListener("pointermove",e=>setP(e.clientX,e.clientY),{passive:true});
  addEventListener("touchmove",e=>{const t=e.touches[0];if(t)setP(t.clientX,t.clientY);},{passive:true});
  addEventListener("pointerleave",()=>pointer=null);
  if(!reduce){(function sb(){setTimeout(()=>{blink.t=performance.now();sb();},2600+Math.random()*3600);})();}
  requestAnimationFrame(function frame(now){
    const idle=now-lastMove>1800;
    EYES.forEach((e,i)=>{
      const maxX=e.rx-e.ir-8,maxY=e.ry-e.ir-6;let tx=0,ty=0;
      if(pointer&&!idle){let dx=pointer.x-e.cx,dy=pointer.y-e.cy;const k=Math.min(1,1/Math.hypot(dx/maxX,dy/maxY)||0);tx=dx*k;ty=dy*k;}
      else if(!reduce){const t=now/1000;tx=Math.sin(t*0.6+i)*maxX*0.55;ty=Math.sin(t*0.85+1.3)*maxY*0.45;}
      cur[i].x+=(tx-cur[i].x)*0.14;cur[i].y+=(ty-cur[i].y)*0.14;
      irisGroups[i].node.setAttribute("transform",`translate(${cur[i].x.toFixed(2)} ${cur[i].y.toFixed(2)})`);
      let sy=1;if(!reduce){const bt=now-blink.t;if(bt>=0&&bt<blink.dur){sy=1-Math.sin(bt/blink.dur*Math.PI)*0.94;}}
      eyeballs[i].node.setAttribute("transform",`translate(0 ${e.cy}) scale(1 ${sy.toFixed(3)}) translate(0 ${-e.cy})`);
    });
    requestAnimationFrame(frame);
  });
})();
</script>
</div></div>
</div>
</div>
</div>

<div class="et_pb_section_1 et_pb_section et_section_regular et_flex_section">
<div class="et_pb_row_1 et_pb_row et_flex_row">
<div class="et_pb_column_1 et_pb_column et-last-child et_flex_column et_pb_css_mix_blend_mode_passthrough et_flex_column_24_24 et_flex_column_24_24_tablet et_flex_column_24_24_phone">
<div class="et_pb_text_0 et_pb_text et_pb_bg_layout_light et_pb_module et_flex_module"><div class="et_pb_text_inner"><h2><b>Design History: The Delsarte System of Expression</b></h2>
<p><span style="font-weight: 400;">On this page is a pair of eyes that watch your cursor as it moves across them. If you're on a phone, drag a finger instead. What's odd about them is their age: they're built from a drawing that's roughly 140 years old. </span></p>
<p><span style="font-weight: 400;">The engraving is from Genevieve Stebbins's <i>Delsarte System of Expression</i>, a performance and elocution manual first published in the 1880s. Among its charts is a plate that breaks the human eye down into combinations of upper lid and brow — a kind of grammar of the gaze, each small drawing a different shade of feeling. The book has been in the public domain for a long time, which means anyone is free to use those illustrations. I took the eye from that plate and gave it its gaze back.</span></p>
</div></div>

<div class="et_pb_text_1 et_pb_text et_pb_bg_layout_light et_pb_module et_flex_module"><div class="et_pb_text_inner"><h2><b>How the Cursor-Tracking SVG Animation Works</b></h2>
<p><span style="font-weight: 400;">A flat engraving can't move its own pupils, so the eyes you see here aren't the scanned plate. They're redrawn as SVG — vector line-work styled to echo the original's ink and cross-hatching. Drawing them as vectors does two things: it keeps them crisp at any size, and, more usefully, it lets the pupils actually move.</span></p>
<p><span style="font-weight: 400;">A small script does the watching. Every time your cursor (or finger) moves, it measures the direction and distance from each eye to the pointer, then slides that eye's pupil toward it — capped so the pupil never slips out from under the lid. The motion is eased rather than instant, which is what makes it read as a glance instead of a twitch. Stop moving, and after a short pause the eyes begin a slow idle drift; every few seconds, they blink.</span></p>
<p><span style="font-weight: 400;">It also honours the "reduce motion" accessibility setting. For visitors who've asked their device to minimise motion, the self-running drift and blink switch off — but the cursor-follow stays, because that's motion the visitor is choosing to create rather than something looping at them. And the whole thing is wrapped in its own scoped container, so none of its styling leaks out into the rest of the page.</span></p>
</div></div>

<div class="et_pb_text_2 et_pb_text et_pb_bg_layout_light et_pb_module et_flex_module"><div class="et_pb_text_inner"><h2><b>How to Add the Cursor-Following Eye Effect to Your Divi Site</b></h2>
<p><span style="font-weight: 400;">You'll need Divi's </span><b>Code module</b><span style="font-weight: 400;">, which lets you drop raw HTML, CSS and JavaScript straight into a layout.</span></p>
<p>&nbsp;</p>
<ol>
<li style="font-weight: 400;" aria-level="1"><span style="font-weight: 400;">Edit your page with the Visual Builder and add a </span><b>Code</b><span style="font-weight: 400;"> module where you want the eyes to sit.</span></li>
<li style="font-weight: 400;" aria-level="1"><span style="font-weight: 400;">Paste the entire snippet below into the module's </span><b>Content → Code</b><span style="font-weight: 400;"> box — all of it: the </span><span style="font-weight: 400;">&lt;link&gt;</span><span style="font-weight: 400;">, the </span><span style="font-weight: 400;">&lt;style&gt;</span><span style="font-weight: 400;">, the </span><span style="font-weight: 400;">&lt;div&gt;</span><span style="font-weight: 400;"> and the </span><span style="font-weight: 400;">&lt;script&gt;</span><span style="font-weight: 400;">. It all goes in that one box. The CSS does </span><i><span style="font-weight: 400;">not</span></i><span style="font-weight: 400;"> go in Divi's separate CSS field.</span></li>
<li style="font-weight: 400;" aria-level="1"><span style="font-weight: 400;">Save and exit the builder.</span></li>
<li style="font-weight: 400;" aria-level="1"><span style="font-weight: 400;">View the </span><b>published page</b><span style="font-weight: 400;"> — not the Visual Builder. Divi doesn't run custom JavaScript inside the builder, so the eyes only appear on the live page (or through Preview).</span></li>
</ol>
</div></div>
</div>
</div>
</div>

<div class="et_pb_section_2 et_pb_section et_section_regular et_flex_section">
<div class="et_pb_row_2 et_pb_row et_flex_row">
<div class="et_pb_column_2 et_pb_column et-last-child et_flex_column et_pb_css_mix_blend_mode_passthrough et_flex_column_24_24 et_flex_column_24_24_tablet et_flex_column_24_24_phone">
<div class="et_pb_text_3 et_pb_text et_pb_bg_layout_light et_pb_module et_flex_module"><div class="et_pb_text_inner"><h3><span style="font-weight: 400;">Here's the complete code:</span></h3>
</div></div>

<div class="et_pb_code_1 et_pb_code et_pb_module"><div class="et_pb_code_inner"><script src="https://gist.github.com/iguy/a67bace60d50e85f8dd0181674c602e5.js"></script></div></div>

<div class="et_pb_text_4 et_pb_text et_pb_bg_layout_light et_pb_module et_flex_module"></div>
</div>
</div>
</div>

<div class="et_pb_section_3 et_pb_section et_section_regular et_flex_section">
<div class="et_pb_row_3 et_pb_row et_flex_row">
<div class="et_pb_column_3 et_pb_column et-last-child et_flex_column et_pb_css_mix_blend_mode_passthrough et_flex_column_24_24 et_flex_column_24_24_tablet et_flex_column_24_24_phone">
<div class="et_pb_text_5 et_pb_text et_pb_bg_layout_light et_pb_module et_flex_module"><div class="et_pb_text_inner"><h2><b>Troubleshooting Custom Animation</b></h2>
<p><span style="font-weight: 400;">If </span><span style="font-weight: 400;">t</span><span style="font-weight: 400;">he eyes still don't appear on the live page, a security plugin or your user role may be stripping the </span><span style="font-weight: 400;">&lt;script&gt;</span><span style="font-weight: 400;"> out when the page saves. In that case, move just the </span><span style="font-weight: 400;">&lt;script&gt;…&lt;/script&gt;</span><span style="font-weight: 400;"> portion into </span><b>Divi → Theme Options → Integration → "Add code to the body of your blog,"</b><span style="font-weight: 400;"> and leave everything else in the module.</span></p>
<h2><b>Customizing the Interactive Eye Effect</b></h2>
<p><span style="font-weight: 400;">A handful of values near the bottom of the script are meant to be changed:</span></p>
<p>&nbsp;</p>
<ul>
<li style="font-weight: 400;" aria-level="1"><b>Spacing</b><span style="font-weight: 400;"> — the </span><span style="font-weight: 400;">cx</span><span style="font-weight: 400;"> numbers in the </span><span style="font-weight: 400;">EYES</span><span style="font-weight: 400;"> line set each eye's horizontal centre. Move them apart for a wider gap, together for a narrower one.</span></li>
<li style="font-weight: 400;" aria-level="1"><b>Lashes</b><span style="font-weight: 400;"> — </span><span style="font-weight: 400;">N</span><span style="font-weight: 400;"> is how many there are, and the </span><span style="font-weight: 400;">L</span><span style="font-weight: 400;"> line controls their length.</span></li>
<li style="font-weight: 400;" aria-level="1"><b>Brows</b><span style="font-weight: 400;"> — </span><span style="font-weight: 400;">peakY</span><span style="font-weight: 400;"> sets how high the brow sits (a smaller number brings it closer to the eye), and </span><span style="font-weight: 400;">the</span><span style="font-weight: 400;"> is its thickness.</span></li>
<li style="font-weight: 400;" aria-level="1"><b>Colors</b><span style="font-weight: 400;"> — the CSS variables at the top (</span><span style="font-weight: 400;">--paper</span><span style="font-weight: 400;">, </span><span style="font-weight: 400;">--ink</span><span style="font-weight: 400;">, and the rest) recolor the entire plate. Swap in your own palette to match your site.</span></li>
<li style="font-weight: 400;" aria-level="1"><b>Your own artwork</b><span style="font-weight: 400;"> — set </span><span style="font-weight: 400;">DRAW_EYEBALL</span><span style="font-weight: 400;"> to </span><span style="font-weight: 400;">false</span><span style="font-weight: 400;">, add an </span><span style="font-weight: 400;">&lt;image&gt;</span><span style="font-weight: 400;"> of an aligned engraving, and nudge the eye centers so the pupils land in its sockets. Then it's your illustration doing the looking.</span></li>
</ul>
<p>&nbsp;</p>
<p><span style="font-weight: 400;">This is the first in a series — </span><i><span style="font-weight: 400;">Living Plates</span></i><span style="font-weight: 400;"> — that brings public-domain illustrations back to life one plate at a time. If there's an old engraving you'd like to see move, that's exactly the kind of thing I'm collecting.</span></p>
</div></div>
</div>
</div>
</div>
