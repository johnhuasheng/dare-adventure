(function(){
const $=s=>document.querySelector(s);
const root=document.documentElement;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(pointer:fine)').matches;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const seg=(p,a,b)=>clamp((p-a)/(b-a),0,1);
const ease=t=>1-Math.pow(1-t,3);
const fmt=n=>n.toLocaleString('en-US',{maximumFractionDigits:2});
const IMG=(id,w)=>`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w||1800}&q=75`;
const VID=f=>`https://videos.pexels.com/video-files/${f}`;
const wide=innerWidth>=900;
const M=DARE.media;
/* 本地优先：先加载 assets/ 里的文件，失败就换成网上地址 */
function loadVideo(v,local,remote){v.onerror=()=>{if(v.dataset.fell)return;v.dataset.fell='1';v.src=remote;if(!videoPaused)v.play().catch(()=>{})};v.src=local}

/* ---------------- Chapter data (按海拔从低到高) ---------------- */
const CH=DARE.chapters;

/* ---------------- Render chapters ---------------- */
$('#chapters').innerHTML=CH.map((c,i)=>`
<section class="chapter" id="${c.id}" data-alt="${c.alt}">
  <div class="media"><div class="ph"><img src="${c.localImg}" data-remote="${IMG(c.img)}" onerror="this.onerror=null;this.src=this.dataset.remote" alt="" loading="lazy" style="object-position:${c.pos}"><video muted loop playsinline preload="none" data-local="${c.localVid}" data-src="${VID(c.vid)}" data-end="${c.end}" aria-label="${c.cn}的动态画面"></video></div><div class="veil"></div></div>
  <div class="ch-in">
    <div class="ch-idx rise"><span class="n">${String(i+1).padStart(2,'0')} / 05</span><span class="lab">Chapter · ${c.cn}</span></div>
    <div class="ch-top-r rise d1"><div class="big">${c.big}</div><div class="lab" style="margin-top:6px">${c.bigLab}</div></div>
    <div class="ch-word"><div class="row">${[...c.word].map((ch,k)=>`<span style="transition-delay:${.05+k*.05}s">${ch}</span>`).join('')}</div><small>${c.cn}</small></div>
    <div class="ch-text rise d2"><h3>${c.title}</h3><p>${c.text}</p><div class="step"><b>第一步 ·</b> ${c.step}</div></div>
    <div class="ch-facts rise d3">${c.facts.map(f=>`<div><div class="lab">${f[0]}</div><p>${f[1]}</p></div>`).join('')}</div>
  </div>
</section>`).join('');
$('#chdots').innerHTML=CH.map((c,i)=>`<a href="#${c.id}" data-id="${c.id}"><span>${String(i+1).padStart(2,'0')} ${c.cn}</span><i></i></a>`).join('');

/* ---------------- Marquee ---------------- */
const words=DARE.marquee;
const unit=words.map((w,i)=>w.startsWith('<i>')?`<span class="it">${w.slice(3,-4)}</span>`:`<span class="${i%4===0?'fill':''}">${w}</span>`).join('');
$('#track').innerHTML=unit+unit;

/* ---------------- Grain texture ---------------- */
(function(){try{const c=document.createElement('canvas');c.width=c.height=160;const x=c.getContext('2d'),d=x.createImageData(160,160);for(let i=0;i<d.data.length;i+=4){const v=Math.random()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}x.putImageData(d,0,0);$('#grain').style.backgroundImage=`url(${c.toDataURL()})`}catch(e){}})();

/* ---------------- Smooth scroll (Lenis) ---------------- */
let lenis=null;
if(window.Lenis&&!reduce){try{lenis=new Lenis({lerp:.085,wheelMultiplier:.9});const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf)}catch(e){lenis=null}}
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const t=document.querySelector(a.getAttribute('href'));if(!t)return;e.preventDefault();
  if(lenis)lenis.scrollTo(t,{duration:1.8,easing:t=>1-Math.pow(1-t,4)});else t.scrollIntoView({behavior:reduce?'auto':'smooth'})});

/* ---------------- Hero video + loader ---------------- */
const hv=$('#heroVid');
const heroRemote=wide?M.heroVideo.remote:M.heroVideo.remoteMobile;
let videoPaused=reduce;
if(!reduce){loadVideo(hv,M.heroVideo.local,heroRemote);hv.play().catch(()=>{})}
hv.addEventListener('playing',()=>hv.classList.add('on'));
/* 只循环视频里最有冲击力的一段（滑雪者冲近镜头并急停扬雪），并稍微放慢 */
hv.addEventListener('loadedmetadata',()=>{hv.playbackRate=M.heroVideo.rate||1;if(M.heroVideo.start)hv.currentTime=hv.duration*M.heroVideo.start});
hv.addEventListener('timeupdate',()=>{if(scrub)return;const d=hv.duration;if(d&&M.heroVideo.end&&hv.currentTime>d*M.heroVideo.end)hv.currentTime=d*(M.heroVideo.start||0)});
/* 滚动控制：离开顶部后，视频进度跟着滚动走；回到顶部继续自动播放 */
let scrub=false,t0=0,curT=0,seeking=false,wantT=null;
function seekTo(t){if(seeking){wantT=t;return}seeking=true;hv.currentTime=t}
hv.addEventListener('seeked',()=>{seeking=false;if(wantT!=null){const t=wantT;wantT=null;seekTo(t)}});
const ldNum=$('#ldNum'),ldBar=$('#ldBar'),loader=$('#loader');
let shownPct=0,targetPct=0,videoReady=reduce,start=performance.now(),finished=false;
hv.addEventListener('canplay',()=>{videoReady=true});
function loaderTick(now){
  const t=now-start;
  targetPct=videoReady?100:Math.min(92,t/28);
  if(t>4200)targetPct=100;
  shownPct+=(targetPct-shownPct)*.08;if(targetPct-shownPct<.6)shownPct=targetPct;
  const v=Math.round(shownPct);ldNum.textContent=v;ldBar.style.width=v+'%';
  if(v>=100&&t>1100){if(!finished){finished=true;setTimeout(()=>{loader.classList.add('out');root.classList.add('ready');countUp()},250);setTimeout(()=>loader.remove(),1500)}return}
  requestAnimationFrame(loaderTick);
}
requestAnimationFrame(loaderTick);
function countUp(){document.querySelectorAll('[data-count]').forEach(el=>{const to=+el.dataset.count,pre=el.dataset.pre||'',suf=el.dataset.suf||'';if(reduce){el.textContent=pre+fmt(to)+suf;return}const t0=performance.now()+500;const step=n=>{const k=clamp((n-t0)/1600,0,1);el.textContent=pre+fmt(Math.round(to*ease(k)))+suf;if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)})}
const playBtn=$('#playBtn');
function setPaused(p){videoPaused=p;playBtn.textContent=p?'▶ PLAY':'❚❚ PAUSE';playBtn.setAttribute('aria-pressed',p);
  if(p){hv.pause();document.querySelectorAll('.chapter video').forEach(v=>v.pause())}else{if(!hv.getAttribute('src'))loadVideo(hv,M.heroVideo.local,heroRemote);if(!scrub)hv.play().catch(()=>{});syncChapterVideos()}}
if(reduce)setPaused(true);
playBtn.addEventListener('click',()=>setPaused(!videoPaused));

/* ---------------- Chapter videos: lazy load + play in view ---------------- */
const chapters=[...document.querySelectorAll('.chapter')];
const vis=new Map();
function syncChapterVideos(){chapters.forEach(c=>{const v=c.querySelector('video');if(vis.get(c)&&!videoPaused){if(!v.getAttribute('src')){loadVideo(v,v.dataset.local,v.dataset.src)}v.play().catch(()=>{})}else v.pause()})}
chapters.forEach(c=>{const v=c.querySelector('video');v.addEventListener('playing',()=>v.classList.add('on'));
  v.addEventListener('timeupdate',()=>{const e=+v.dataset.end;if(e<1&&v.duration&&v.currentTime>v.duration*e)v.currentTime=0})});
const pre=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target.querySelector('video');if(e.isIntersecting&&!v.getAttribute('src')&&!videoPaused){v.preload='auto';loadVideo(v,v.dataset.local,v.dataset.src)}}),{rootMargin:'60% 0px'});
chapters.forEach(c=>pre.observe(c));
const io=new IntersectionObserver(es=>es.forEach(e=>{vis.set(e.target,e.isIntersecting);if(e.isIntersecting)e.target.classList.add('seen');e.target.classList.toggle('on',e.intersectionRatio>.45);syncChapterVideos()}),{threshold:[0,.2,.45,.7]});
chapters.forEach(c=>io.observe(c));

/* ---------------- Scroll engine ---------------- */
const hero=$('.hero'),L=[1,2,3,4].map(n=>$('#L'+n)),bg=$('#heroBg'),dim=$('#heroDim'),cue=$('#cue'),rec=$('#rec'),bar=$('#progress'),dots=$('#chdots');
const altSecs=[...document.querySelectorAll('[data-alt]')];
const navLinks=[...document.querySelectorAll('#nav a')],dotLinks=[...dots.querySelectorAll('a')];
let altShown=0;
/* 位置只在加载、缩放时测量一次，滚动时直接用 scrollY 计算，避免每帧强制重排 */
const lay={vh:innerHeight,heroTop:0,heroH:1,ch:[],alt:[],docH:1};
function measure(){const sy=scrollY;lay.vh=innerHeight;const hr=hero.getBoundingClientRect();lay.heroTop=hr.top+sy;lay.heroH=hr.height;
  lay.ch=chapters.map(c=>{const r=c.getBoundingClientRect();return{el:c,top:r.top+sy,h:r.height,ph:c.querySelector('.ph'),media:c.querySelector('.media'),pk:'',mk:''}});
  lay.alt=altSecs.map(s=>({el:s,top:s.getBoundingClientRect().top+sy}));lay.docH=document.documentElement.scrollHeight;lastY=-1}
let lastY=-1,curSec=null,lastAlt='',dotsOn=null,heroVis=true;
measure();addEventListener('resize',measure);addEventListener('load',measure);if(document.fonts)document.fonts.ready.then(measure);setTimeout(measure,3000);
function frame(){
  const y=scrollY,vh=lay.vh,moved=y!==lastY;lastY=y;
  const heroRel=lay.heroTop-y,heroBottom=heroRel+lay.heroH;
  const p=clamp(-heroRel/(lay.heroH-vh),0,1);
  heroVis=heroBottom>0;
  if(heroVis){
    if(moved){
      bg.style.transform=`scale(${(1.04+ease(p)*.45).toFixed(4)})`;
      const a=seg(p,0,.55);
      L[0].style.transform=`translate3d(0,${(-a*62).toFixed(2)}vh,0)`;L[0].style.opacity=1-seg(p,.28,.55);
      L[1].style.transform=`translate3d(0,${(-a*38).toFixed(2)}vh,0)`;L[1].style.opacity=1-seg(p,.4,.62);
      const mm=seg(p,.12,.5);
      L[2].style.transform=`translate3d(0,${((1-ease(mm))*34-seg(p,.62,.95)*40).toFixed(2)}vh,0)`;L[2].style.opacity=Math.min(.35+mm,1-seg(p,.7,.95));
      const bb=seg(p,.35,.72);
      L[3].style.transform=`translate3d(0,${((1-ease(bb))*30).toFixed(2)}vh,0)`;L[3].style.opacity=seg(p,.3,.6);
      dim.style.opacity=seg(p,.82,1)*.92;
      cue.style.opacity=1-seg(p,0,.08);rec.style.opacity=1-seg(p,0,.2);
    }
    const hd=hv.duration;
    if(M.heroVideo.scrub&&hd&&!videoPaused&&hv.readyState>=2){
      const S=hd*(M.heroVideo.start||0),E=hd*(M.heroVideo.end||1);
      if(p>.012){
        if(!scrub){scrub=true;hv.pause();const c0=hv.currentTime;t0=c0>S+(E-S)*.45?S:Math.max(c0,S);curT=t0;if(t0!==c0)seekTo(t0)}
        const target=t0+(E-t0)*Math.min(1,p/(M.heroVideo.scrubUntil||.7));
        curT+=(target-curT)*.25;
        if(Math.abs(curT-hv.currentTime)>.045)seekTo(curT);
      }else if(scrub){scrub=false;wantT=null;hv.play().catch(()=>{})}
    }
  }
  if(moved){
    let inCh=false;
    for(const c of lay.ch){const top=c.top-y;if(top+c.h<0||top>vh)continue;
      if(top<vh*.5&&top+c.h>vh*.5)inCh=true;
      const q=(top+c.h/2-vh/2)/vh;const pk=`translate3d(0,${(q*-8).toFixed(2)}%,0) scale(1.06)`;
      if(pk!==c.pk){c.ph.style.transform=pk;c.pk=pk}
      const t=clamp(1-top/vh,0,1),s=.86+.14*ease(t);const mk=s<.999?`scale(${s.toFixed(4)})`:'none';
      if(mk!==c.mk){c.media.style.transform=mk;c.mk=mk}
    }
    if(inCh!==dotsOn){dots.classList.toggle('show',inCh);dotsOn=inCh}
    bar.style.transform=`scaleX(${(y/Math.max(1,lay.docH-vh)).toFixed(4)})`;
    let cur=lay.alt[0];for(const s of lay.alt){if(s.top-y<=vh*.5)cur=s}
    if(cur.el!==curSec){curSec=cur.el;navLinks.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+curSec.id));dotLinks.forEach(a=>a.classList.toggle('on',a.dataset.id===curSec.id))}
  }
  const tgt=curSec?parseFloat(curSec.dataset.alt):0;
  if(altShown!==tgt){altShown+=(tgt-altShown)*(reduce?1:.1);if(Math.abs(tgt-altShown)<.5)altShown=tgt}
  const v=altShown===tgt?tgt:Math.round(altShown);const txt=(v<0?'−':'')+fmt(Math.abs(v))+' M';
  if(txt!==lastAlt){$('#altNum').textContent=txt;lastAlt=txt}
  if(!videoPaused&&hv.src){if(!heroVis&&!hv.paused)hv.pause();else if(heroVis&&hv.paused&&!scrub)hv.play().catch(()=>{})}
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ---------------- Custom cursor ---------------- */
if(fine&&!reduce){
  root.classList.add('cur');
  const dot=$('#cursor'),ring=$('#ring');let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;dot.style.transform=`translate(${mx}px,${my}px)`});
  (function loop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.transform=`translate(${rx}px,${ry}px)`;requestAnimationFrame(loop)})();
  document.addEventListener('pointerover',e=>{ring.classList.toggle('hover',!!e.target.closest('a,button'));ring.classList.toggle('lamp',!!e.target.closest('#reveal')&&!e.target.closest('a,button'))});
}

/* ---------------- Hero words follow the pointer (depth) ---------------- */
if(fine&&!reduce){const ws=[...document.querySelectorAll('.hero .word')],depth=[10,16,24];let tx=0,ty=0,cx=0,cy=0;
  $('.stage').addEventListener('pointermove',e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5});
  (function par(){const dx=tx-cx,dy=ty-cy;if(Math.abs(dx)+Math.abs(dy)>.0005){cx+=dx*.06;cy+=dy*.06;ws.forEach((w,i)=>{w.style.translate=`${(-cx*depth[i]*2).toFixed(1)}px ${(-cy*depth[i]).toFixed(1)}px`})}requestAnimationFrame(par)})();}

/* ---------------- Snow particles ---------------- */
const sc=$('#snow'),sx=sc.getContext('2d');let SW=0,SH=0,flakes=[],wind=0,windT=0,heroVisible=true;
function mk(any){const z=Math.random();return{x:Math.random()*SW,y:any?Math.random()*SH:-10,z,r:.5+z*2,vy:.3+z*1.2,ph:Math.random()*6.28}}
function sizeSnow(){const d=1,rc=sc.getBoundingClientRect();SW=rc.width;SH=rc.height;sc.width=SW*d;sc.height=SH*d;sx.setTransform(d,0,0,d,0,0);flakes=Array.from({length:Math.round(Math.min(140,SW*SH/10000))},()=>mk(true))}
$('.stage').addEventListener('pointermove',e=>{windT=(e.clientX/innerWidth-.5)*3});
function snow(){if(heroVisible){wind+=(windT-wind)*.03;sx.clearRect(0,0,SW,SH);
  for(const f of flakes){f.ph+=.01;f.y+=f.vy;f.x+=Math.sin(f.ph)*.3+wind*(.3+f.z);if(f.y>SH+10||f.x<-20||f.x>SW+20)Object.assign(f,mk(false));sx.globalAlpha=.18+f.z*.5;sx.fillStyle='#fff';sx.beginPath();sx.arc(f.x,f.y,f.r,0,6.283);sx.fill()}}
  requestAnimationFrame(snow)}
sizeSnow();if(!reduce)requestAnimationFrame(snow);
new IntersectionObserver(es=>{heroVisible=es[0].isIntersecting}).observe(hero);

/* ---------------- Reveal: cave headlamp ---------------- */
const rv=$('#reveal'),rc=$('#revealCanvas'),rx2=rc.getContext('2d');
const mask=document.createElement('canvas'),mx2=mask.getContext('2d');
const rimg=new Image();rimg.onerror=()=>{if(!rimg.dataset.fell){rimg.dataset.fell='1';rimg.src=M.reveal.remote}};rimg.src=M.reveal.local;
const spots=(DARE.caveSpots||[]).map(s=>({...s,found:false}));
const tagsBox=$('#rvTags');
tagsBox.innerHTML=spots.map(s=>`<div class="rv-tag"><i></i><div><b>${s.t}</b><span>${s.d}</span></div></div>`).join('');
const tagEls=[...tagsBox.children];let foundN=0;
let RW=0,RH=0,ptr={x:0,y:0,has:false,last:0},wander=0,rvOn=false,boost=0,hold=false,map={s:1,ox:0,oy:0};
function sizeReveal(){const d=Math.min(devicePixelRatio||1,1.25);RW=rv.clientWidth;RH=rv.clientHeight;[rc,mask].forEach(c=>{c.width=RW*d;c.height=RH*d});rx2.setTransform(d,0,0,d,0,0);mx2.setTransform(d,0,0,d,0,0)}
function brush(x,y,R){for(let k=0;k<5;k++){const ox=(Math.random()-.5)*R*.6,oy=(Math.random()-.5)*R*.6,rr=R*(.45+Math.random()*.55);
    const g=mx2.createRadialGradient(x+ox,y+oy,0,x+ox,y+oy,rr);g.addColorStop(0,'rgba(0,0,0,.35)');g.addColorStop(.6,'rgba(0,0,0,.12)');g.addColorStop(1,'rgba(0,0,0,0)');
    mx2.fillStyle=g;mx2.beginPath();mx2.arc(x+ox,y+oy,rr,0,6.283);mx2.fill()}}
function coverDraw(ctx,img,w,h,px,py){const s=Math.max(w/img.width,h/img.height),iw=img.width*s,ih=img.height*s,ox=(w-iw)*px,oy=(h-ih)*py;map={s,ox,oy};ctx.drawImage(img,ox,oy,iw,ih)}
function reveal(ts){
  if(rvOn){
    mx2.globalCompositeOperation='destination-out';mx2.fillStyle='rgba(0,0,0,.03)';mx2.fillRect(0,0,RW,RH);mx2.globalCompositeOperation='source-over';
    let x,y;if(ptr.has&&ts-ptr.last<2200){x=ptr.x;y=ptr.y}else{wander+=.006;x=RW*(.5+.34*Math.sin(wander*1.3));y=RH*(.58+.22*Math.sin(wander*2.1+1))}
    boost=hold?Math.min(1.6,boost+.05):boost*.94;
    const R=Math.min(RW,RH)*(.15+boost*.12);brush(x,y,R);
    rx2.clearRect(0,0,RW,RH);
    if(rimg.complete&&rimg.naturalWidth){
      coverDraw(rx2,rimg,RW,RH,.5,.5);
      rx2.globalCompositeOperation='destination-in';rx2.drawImage(mask,0,0,RW,RH);
      // 头灯的暖色光斑
      rx2.globalCompositeOperation='lighter';const g=rx2.createRadialGradient(x,y,0,x,y,R*1.1);g.addColorStop(0,'rgba(255,214,160,.22)');g.addColorStop(.5,'rgba(255,170,110,.08)');g.addColorStop(1,'rgba(0,0,0,0)');rx2.fillStyle=g;rx2.fillRect(x-R*1.2,y-R*1.2,R*2.4,R*2.4);
      rx2.globalCompositeOperation='source-over';
      // 发现点：光照到就显示说明
      spots.forEach((s,i)=>{const sx=map.ox+s.x*rimg.naturalWidth*map.s,sy=map.oy+s.y*rimg.naturalHeight*map.s;
        tagEls[i].style.transform=`translate(${sx}px,${sy}px)`;
        if(!s.found&&Math.hypot(sx-x,sy-y)<R*.7){s.found=true;foundN++;tagEls[i].classList.add('on');$('#rvFound').textContent=foundN;
          if(foundN===spots.length)$('#rvHint').textContent='3 处全部找到了。黑暗里的东西，照亮之后就没那么可怕。'}});
    }
  }
  requestAnimationFrame(reveal)}
function setPtr(e){const b=rv.getBoundingClientRect();ptr.x=e.clientX-b.left;ptr.y=e.clientY-b.top;ptr.has=true;ptr.last=performance.now()}
rv.addEventListener('pointermove',setPtr);
rv.addEventListener('pointerdown',e=>{setPtr(e);hold=true});
addEventListener('pointerup',()=>{hold=false});
new IntersectionObserver(es=>{rvOn=es[0].isIntersecting}).observe(rv);
sizeReveal();requestAnimationFrame(reveal);

/* ---------------- First-step picker ---------------- */
const picker=$('#picker'),plan=$('#plan');let pick=1;
picker.innerHTML=CH.map((c,i)=>`<button type="button" data-i="${i}" aria-pressed="${i===pick}">${c.cn} ${c.word}</button>`).join('');
function renderPlan(){
  const c=CH[pick];
  plan.innerHTML=`<div class="img"><img src="${c.localImg}" data-remote="${IMG(c.img,1200)}" onerror="this.onerror=null;this.src=this.dataset.remote" alt="${c.cn}" style="object-position:${c.pos}"><div class="tag">${c.word}</div></div>
  <div class="txt"><div class="lab">${c.big} · ${c.bigLab}</div><h3>${c.cn}：${c.title}</h3>
  <div class="row hl"><div class="lab">第一步</div><div>${c.step}</div></div>
  <div class="row"><div class="lab">需要时间</div><div>${c.time}</div></div>
  <div class="row"><div class="lab">安全底线</div><div>${c.safe}</div></div>
  <div><a class="btn" href="#${c.id}">回到${c.cn}章节 ↑</a></div></div>`;
  [...picker.children].forEach((b,i)=>b.setAttribute('aria-pressed',i===pick));
}
picker.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;pick=+b.dataset.i;renderPlan()});
renderPlan();

/* ---------------- Quotes ---------------- */
const Q=DARE.quotes;
let qi=0;const qe=$('#quote'),qc=$('#quoteCn');
function showQ(){qe.textContent=Q[qi][0];qc.textContent=Q[qi][1]}
showQ();
if(!reduce)setInterval(()=>{qe.style.opacity=qc.style.opacity=0;setTimeout(()=>{qi=(qi+1)%Q.length;showQ();qe.style.opacity=qc.style.opacity=1},500)},7000);

addEventListener('resize',()=>{sizeSnow();sizeReveal()});
})();
