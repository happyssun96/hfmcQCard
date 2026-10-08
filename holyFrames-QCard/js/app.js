const STAR_SVG = `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 2 C21.5 13 27 18.5 38 20 C27 21.5 21.5 27 20 38 C18.5 27 13 21.5 2 20 C13 18.5 18.5 13 20 2Z" fill="#FFE08A"/><circle cx="20" cy="20" r="3.2" fill="#FFF6D8"/></svg>`;

/* ---------- fire illustrations ---------- */
function flamePath(cx, top, w, h){
  return `M${cx},${top} C${cx+w*.25},${top+h*.32} ${cx+w},${top+h*.52} ${cx+w*.62},${top+h*.86} Q${cx},${top+h*1.06} ${cx-w*.62},${top+h*.86} C${cx-w},${top+h*.52} ${cx-w*.25},${top+h*.32} ${cx},${top} Z`;
}
function flames(cx, top, w, h){
  return `
  <path class="flame" d="${flamePath(cx,top,w,h)}" fill="#D9482B"/>
  <path class="flame f2" d="${flamePath(cx,top+h*.22,w*.68,h*.76)}" fill="#F2A33A"/>
  <path class="flame f3" d="${flamePath(cx,top+h*.45,w*.38,h*.52)}" fill="#FFE08A"/>`;
}
function log(x,y,len,angle,th=12){
  return `<g transform="rotate(${angle} ${x} ${y})">
    <rect x="${x-len/2}" y="${y-th/2}" width="${len}" height="${th}" rx="${th/2}" fill="#8A5E3B"/>
    <ellipse cx="${x+len/2-th/2}" cy="${y}" rx="${th/2.2}" ry="${th/2.2}" fill="#C9996A"/>
  </g>`;
}

// deterministic pseudo-random so stones look the same on every card
let _seed=7; const R2=(a,b)=>{_seed=(_seed*9301+49297)%233280; return a+(_seed/233280)*(b-a);};
function stone(x,y,rx,ry,back){
  const base=back?"#57525F":"#716C7A", hi=back?"#6E6978":"#9C97A6", lo=back?"#45414C":"#5A5562";
  return `<g><ellipse cx="${x.toFixed(1)}" cy="${(y+ry*.45).toFixed(1)}" rx="${(rx*1.05).toFixed(1)}" ry="${(ry*.7).toFixed(1)}" fill="rgba(0,0,0,.35)"/>
    <ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${base}"/>
    <ellipse cx="${x.toFixed(1)}" cy="${(y+ry*.35).toFixed(1)}" rx="${(rx*.85).toFixed(1)}" ry="${(ry*.5).toFixed(1)}" fill="${lo}" opacity=".7"/>
    <ellipse cx="${(x-rx*.28).toFixed(1)}" cy="${(y-ry*.38).toFixed(1)}" rx="${(rx*.5).toFixed(1)}" ry="${(ry*.38).toFixed(1)}" fill="${hi}" opacity=".85"/></g>`;
}
// log from outer end (x1,y1, cut face) to inner end (x2,y2, charred & glowing where it meets the fire)
function log2(x1,y1,x2,y2,th,burnt=true){
  const ang=Math.atan2(y2-y1,x2-x1)*180/Math.PI, len=Math.hypot(x2-x1,y2-y1), cx=(x1+x2)/2, cy=(y1+y2)/2, L=cx-len/2, Rr=cx+len/2;
  return `<g transform="rotate(${ang.toFixed(1)} ${cx} ${cy})">
    <rect x="${L}" y="${cy-th/2}" width="${len}" height="${th}" rx="${th/2}" fill="#7A5133"/>
    <rect x="${L+th*.4}" y="${cy-th/2+th*.12}" width="${len-th*.8}" height="${th*.28}" rx="${th*.14}" fill="#9C6C45" opacity=".75"/>
    <rect x="${L+th*.6}" y="${cy+th*.12}" width="${len-th*1.2}" height="${th*.14}" rx="${th*.07}" fill="#5C3B24" opacity=".8"/>
    ${burnt?`<rect x="${Rr-th*1.3}" y="${cy-th/2}" width="${th*1.3}" height="${th}" rx="${th/2}" fill="#3A2417"/>
    <rect x="${Rr-th*1.1}" y="${cy-th*.18}" width="${th*.9}" height="${th*.36}" rx="${th*.18}" fill="#FF7A2E" opacity=".75"/>`:`<ellipse cx="${Rr-th*.48}" cy="${cy}" rx="${th*.42}" ry="${th*.5}" fill="#C99A6B"/>`}
    <ellipse cx="${L+th*.48}" cy="${cy}" rx="${th*.42}" ry="${th*.5}" fill="#C99A6B"/>
    <ellipse cx="${L+th*.48}" cy="${cy}" rx="${th*.22}" ry="${th*.27}" fill="none" stroke="#9A6E46" stroke-width=".8"/>
  </g>`;
}
function art(level){
  if(level==="match"){
    return `<svg class="art" viewBox="0 0 120 150" aria-hidden="true">
      <ellipse cx="60" cy="132" rx="24" ry="5" fill="rgba(0,0,0,.25)"/>
      <g transform="rotate(14 60 100)">
        <rect x="56" y="62" width="8" height="70" rx="3" fill="#D8B48A"/>
        <ellipse cx="60" cy="62" rx="7.5" ry="9" fill="#8E2A1E"/>
        ${flames(60,18,15,44)}
      </g>
    </svg>`;
  }
  if(level==="bonfire"){
    return `<svg class="art" viewBox="0 0 120 150" aria-hidden="true">
      <ellipse cx="60" cy="134" rx="40" ry="6" fill="rgba(0,0,0,.28)"/>
      ${flames(60,40,30,82)}
      ${log(60,124,78,-16)}${log(60,124,78,16)}
    </svg>`;
  }
  // campfire: back stones -> leaning logs -> embers -> flames -> front logs -> front stones
  const ring=(from,to,step,big)=>{let o="";for(let d=from;d<=to;d+=step){const r=d*Math.PI/180,x=60+48*Math.cos(r),y=127+9.5*Math.sin(r);
      const rx=big?R2(6.5,8.5):R2(5,6.5), ry=big?R2(4.2,5.4):R2(3.2,4.2);o+=stone(x,y,rx,ry,!big);}return o;};
  return `<svg class="art" viewBox="0 0 120 150" aria-hidden="true">
    <ellipse cx="60" cy="134" rx="54" ry="8" fill="rgba(0,0,0,.32)"/>
    ${ring(196,344,21,false)}
    ${log2(22,124,52,74,9)}${log2(98,124,68,74,9)}${log2(60,122,60,76,8)}
    <ellipse cx="60" cy="117" rx="30" ry="8" fill="#FF7A2E" opacity=".5"/>
    <ellipse cx="60" cy="117" rx="17" ry="4.5" fill="#FFD36B" opacity=".5"/>
    ${log2(10,128,58,111,11)}${log2(110,128,62,111,11)}${log2(34,132,86,132,10,false)}
    ${ring(16,164,24,true)}
    <ellipse cx="60" cy="116" rx="22" ry="5.5" fill="#FF8A3D" opacity=".55"/>
    ${flames(44,64,15,58)}${flames(77,58,17,64)}${flames(61,18,27,102)}
    <circle class="spark" cx="42" cy="26" r="1.8" fill="#FFD36B"/>
    <circle class="spark" cx="80" cy="18" r="1.6" fill="#FFD36B" style="animation-delay:.8s"/>
    <circle class="spark" cx="62" cy="8" r="1.4" fill="#FFD36B" style="animation-delay:1.5s"/>
  </svg>`;
}

/* ---------- select screen ---------- */
const tiles = document.getElementById("tiles");
Object.entries(LEVELS).forEach(([key,L])=>{
  const b = document.createElement("button");
  b.className="tile"; b.dataset.level=key;
  b.innerHTML = `${art(key)}<div><p class="name">${L.name}</p><p class="desc">${L.desc}</p></div><span class="count">${L.items.length}장</span>`;
  b.addEventListener("click",()=>startLevel(key));
  tiles.appendChild(b);
});

/* ---------- draw logic ---------- */
const $ = id => document.getElementById(id);
const card=$("card"), front=$("front"), back=$("back"), stage=$("stage");
let level=null, deck=[], idx=-1, busy=false;
let stars=[], missionDeck=[], mIdx=0, inMission=false;
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait = ms => new Promise(r=>setTimeout(r, reduce? Math.min(ms,60) : ms));

function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const norm = it => typeof it==="string" ? {q:it} : it;
const isVs = it => !!(it && it.vs);
const esc = t => t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const br = t => esc(t).replace(/\n/g,"<br>");

function startLevel(key){
  level=key; const L=LEVELS[key];
  document.documentElement.style.setProperty("--accent",L.accent);
  document.documentElement.style.setProperty("--back",L.back);
  document.documentElement.style.setProperty("--front-bg",L.frontBg);
  document.documentElement.style.setProperty("--glow",L.glow);
  $("lvlName").textContent=L.name;
  deck=shuffle(L.items).map(norm); idx=-1; stars=[]; inMission=false; front.classList.remove("mission");
  back.innerHTML = `<div class="b-glow"></div>${art(key)}<div class="bname">${L.name}</div><div class="preview" id="preview"></div><div class="hint">카드를 눌러 뽑기</div>`;
  card.classList.remove("up","lift");
  front.innerHTML="";
  $("drawBtn").textContent="카드 뽑기";
  updateProgress();
  $("select").classList.remove("active"); $("draw").classList.add("active"); document.body.classList.add("drawing");
  window.scrollTo(0,0);
  Sound.level(key);
}

function updateProgress(){
  const n=Math.max(idx+1,0), t=deck.length;
  $("countTxt").textContent=`${Math.min(n,t)} / ${t}`;
  $("bar").style.width = t? `${Math.min(n,t)/t*100}%` : "0";
  $("prevBtn").disabled = idx<=0 || idx>=deck.length;
}

function renderFront(item, n){
  const L=LEVELS[level];
  let body;
  if(isVs(item)){
    body=`<div class="vs">${item.prompt?`<p class="prompt">${br(item.prompt)}</p>`:""}<div class="opt">${br(item.a)}</div><div class="mid">VS</div><div class="opt">${br(item.b)}</div></div>`;
  }else{
    body=`<p class="q">${br(item.q)}</p>`;
  }
  const follow = item.sub ? `<p class="sub">${br(item.sub)}</p>` : "";
  const starBtn = stars[idx] ? `<button type="button" class="star-btn" aria-label="별똥별 미션 열기">${STAR_SVG}</button>` : "";
  front.innerHTML=`${starBtn}
    <div class="f-head"><span class="type"><i></i>${isVs(item)?"밸런스게임":"질문"}</span><span>${L.name}</span></div>
    <div class="f-body">${body}${follow}</div>
    <div class="f-foot"><span>${n} / ${deck.length}</span><span>답하기 어려우면 넘겨도 괜찮아요</span></div>`;
  bindStar();
}

function bindStar(){
  const sb=front.querySelector(".star-btn");
  $("starHint").classList.toggle("on", !!sb);
  if(sb) sb.addEventListener("click",e=>{e.stopPropagation();openMission(sb);});
}

async function openMission(sb){
  if(busy) return;
  busy=true; $("drawBtn").disabled=true;
  sb.classList.add("pop"); $("starHint").classList.remove("on");
  await wait(380);
  stars[idx]=false;               // star used up for this card
  card.classList.remove("up"); await wait(460);
  if(mIdx>=missionDeck.length){ missionDeck=shuffle(MISSIONS); mIdx=0; }
  const M=missionDeck[mIdx++];
  let dots=""; for(let i=0;i<18;i++) dots+=`<i style="left:${Math.random()*100}%;top:${Math.random()*100}%;opacity:${(.2+Math.random()*.5).toFixed(2)}"></i>`;
  front.classList.add("mission"); inMission=true;
  front.innerHTML=`<div class="m-dots">${dots}</div>
    <div class="f-head"><span class="m-label">✦ 별똥별 미션</span><span>${LEVELS[level].name}</span></div>
    <div class="f-body"><p class="m-title">${esc(M.t)}</p><p class="m-text">${br(M.m)}</p>
      <button type="button" class="m-back">질문으로 돌아가기</button></div>
    <div class="f-foot"><span>별똥별이 떨어졌어요</span><span>${idx+1} / ${deck.length}</span></div>`;
  front.querySelector(".m-back").addEventListener("click",e=>{e.stopPropagation();closeMission();});
  card.classList.add("up"); await wait(460);
  $("drawBtn").disabled=false; busy=false;
}

async function closeMission(){
  if(busy||!inMission) return;
  busy=true;
  card.classList.remove("up"); await wait(460);
  front.classList.remove("mission"); inMission=false;
  renderFront(deck[idx], idx+1);
  card.classList.add("up"); await wait(460);
  busy=false;
}

function renderEnd(){
  $("starHint").classList.remove("on");
  front.innerHTML=`
    <div class="f-head"><span class="type"><i></i>끝</span><span>${LEVELS[level].name}</span></div>
    <div class="f-body"><p class="endmsg">이 불의 이야기를<br>모두 나눴어요.</p></div>
    <div class="f-foot"><span>다시 섞거나 다른 불을 골라보세요</span><span></span></div>`;
}

function spawnEmbers(){
  const box=$("embers"); box.innerHTML="";
  for(let i=0;i<10;i++){
    const s=document.createElement("span");
    s.style.left=(38+Math.random()*24)+"%";
    s.style.setProperty("--dx",(Math.random()*120-60)+"px");
    s.style.animationDelay=(Math.random()*.35)+"s";
    box.appendChild(s);
  }
}

async function drawNext(){
  if(busy||!level) return;
  if(idx>=deck.length){ // reshuffle
    deck=shuffle(LEVELS[level].items).map(norm); idx=-1; stars=[];
    $("drawBtn").textContent="카드 뽑기";
  }
  busy=true; $("drawBtn").disabled=true;
  const preview=$("preview");
  $("starHint").classList.remove("on");
  // 1. flip face down
  if(card.classList.contains("up")){ card.classList.remove("up","lift"); await wait(460); }
  // 2. shuffle + 3. preview
  const next = deck[idx+1];
  spawnEmbers();
  stage.classList.add("shuffling");
  await wait(320);
  if(preview){
    preview.textContent = next ? (isVs(next)?"밸런스게임":"질문") : "마지막";
    preview.classList.add("on");
  }
  await wait(480);
  stage.classList.remove("shuffling");
  // 4. reveal
  idx++;
  inMission=false; front.classList.remove("mission");
  if(idx<deck.length && stars[idx]===undefined) stars[idx] = level!=="match" && Math.random()<1/3;
  if(idx<deck.length){ renderFront(deck[idx], idx+1); } else { renderEnd(); }
  card.classList.add("up","lift");
  await wait(250);
  if(preview) preview.classList.remove("on");
  card.classList.remove("lift");
  await wait(220);
  updateProgress();
  $("drawBtn").textContent = idx>=deck.length ? "다시 섞기" : (idx===deck.length-1 ? "마지막 카드예요 · 끝내기" : "다음 카드");
  $("drawBtn").disabled=false; busy=false;
}

async function prevCard(){
  if(busy||idx<=0||idx>=deck.length) return;
  busy=true;
  $("starHint").classList.remove("on");
  card.classList.remove("up"); await wait(460);
  front.classList.remove("mission"); inMission=false;
  idx--; renderFront(deck[idx], idx+1);
  card.classList.add("up"); await wait(460);
  updateProgress();
  $("drawBtn").textContent="다음 카드";
  busy=false;
}

card.addEventListener("click",drawNext);
$("drawBtn").addEventListener("click",drawNext);
$("prevBtn").addEventListener("click",prevCard);
$("changeBtn").addEventListener("click",()=>{
  if(busy) return;
  $("draw").classList.remove("active"); $("select").classList.add("active"); level=null; document.body.classList.remove("drawing"); Sound.stop();
});
document.addEventListener("keydown",e=>{
  if(!$("draw").classList.contains("active")) return;
  if(e.code==="Space"||e.code==="ArrowRight"||e.code==="Enter"){ if(e.target.tagName!=="BUTTON"||e.code!=="Enter"){e.preventDefault();drawNext();} }
  if(e.code==="ArrowLeft"){ e.preventDefault(); prevCard(); }
});




/* ---------- ambient sound: wood-fire crackle (synthesised, no files) ---------- */
const Sound=(function(){
  let ctx=null, master, bedGain, bedLP, crackT=null, crickT=null, cur=null, enabled=true, noise=null, imp=null;
  let bgmGain=null, fireVolNode=null; const bgm=document.getElementById("bgm"); const BGM_MAX=.5;
  let volMusic=.45, volFire=.8, crickTimers=[];
  try{ const vm=localStorage.getItem("cc-vol-music"), vf=localStorage.getItem("cc-vol-fire");
       if(vm!==null) volMusic=+vm; if(vf!==null) volFire=+vf; }catch(e){}
  try{ enabled = localStorage.getItem("cc-sound")!=="off"; }catch(e){}
  // bed is now a very low, soft rumble (no hiss); character comes from woody "tok" knocks
  const P={
    match:   {bed:.018, lp:260, gap:[1100,2800], g:[.10,.22], pair:.35, pop:.03, sap:.10, crickets:false},
    bonfire: {bed:.05,  lp:200, gap:[260,900],   g:[.16,.38], pair:.55, pop:.12, sap:.18, crickets:false},
    campfire:{bed:.07,  lp:180, gap:[160,620],   g:[.18,.44], pair:.6,  pop:.18, sap:.22, crickets:true}
  };
  const R=(a,b)=>a+Math.random()*(b-a);
  function init(){
    if(ctx) return true;
    const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return false;
    try{ if(navigator.audioSession) navigator.audioSession.type="playback"; }catch(e){}
    ctx=new AC();
    master=ctx.createGain(); master.gain.value=0;
    const comp=ctx.createDynamicsCompressor(); comp.threshold.value=-14; comp.ratio.value=3;
    fireVolNode=ctx.createGain(); fireVolNode.gain.value=volFire*1.25;
    master.connect(fireVolNode).connect(comp).connect(ctx.destination);
    // background piano: media element -> its own gain (iOS ignores element.volume)
    try{
      const src=ctx.createMediaElementSource(bgm);
      bgmGain=ctx.createGain(); bgmGain.gain.value=0; src.connect(bgmGain).connect(ctx.destination);
    }catch(e){ bgmGain=null; }
    // brown noise for the rumble
    const len=ctx.sampleRate*4; noise=ctx.createBuffer(1,len,ctx.sampleRate);
    const d=noise.getChannelData(0); let last=0;
    for(let i=0;i<len;i++){ last=(last+.02*(Math.random()*2-1))/1.02; d[i]=last*3.2; }
    const fade=2048; for(let i=0;i<fade;i++){ const k=i/fade; d[i]*=k; d[len-1-i]*=k; } // seamless loop
    // tiny decaying impulse used to excite resonant "wood" filters
    const il=Math.floor(ctx.sampleRate*.004); imp=ctx.createBuffer(1,il,ctx.sampleRate);
    const id=imp.getChannelData(0); for(let i=0;i<il;i++) id[i]=(Math.random()*2-1)*Math.exp(-i/(il*.18));
    const bed=ctx.createBufferSource(); bed.buffer=noise; bed.loop=true;
    bedLP=ctx.createBiquadFilter(); bedLP.type="lowpass"; bedLP.frequency.value=200; bedLP.Q.value=.2;
    bedGain=ctx.createGain(); bedGain.gain.value=0;
    const lfo=ctx.createOscillator(), lfoG=ctx.createGain(); lfo.frequency.value=.13; lfoG.gain.value=.3;
    const breathe=ctx.createGain(); lfo.connect(lfoG).connect(breathe.gain); lfo.start();
    bed.connect(bedLP).connect(breathe).connect(bedGain).connect(master); bed.start();
    return true;
  }
  function out(node, pan){
    if(ctx.createStereoPanner){ const p=ctx.createStereoPanner(); p.pan.value=pan; node.connect(p).connect(master); }
    else node.connect(master);
  }
  // one woody knock: impulse -> resonant bandpass (+ a little body) -> short decay
  function tok(t, f, q, g, pan, decay){
    const src=ctx.createBufferSource(); src.buffer=imp;
    const bp=ctx.createBiquadFilter(); bp.type="bandpass"; bp.frequency.value=f; bp.Q.value=q;
    const body=ctx.createBiquadFilter(); body.type="peaking"; body.frequency.value=f*.5; body.gain.value=6; body.Q.value=1.5;
    const eg=ctx.createGain(); eg.gain.setValueAtTime(g*3.5,t); eg.gain.exponentialRampToValueAtTime(.0001,t+decay);
    src.connect(bp).connect(body).connect(eg); out(eg,pan); src.start(t);
  }
  function crackle(){
    if(!cur) return; const pr=P[cur]; const t=ctx.currentTime+.01, pan=R(-.55,.55);
    const f=R(950,2300), g=R(pr.g[0],pr.g[1]);
    tok(t, f, R(7,12), g, pan, R(.035,.07));                                   // 토
    if(Math.random()<pr.pair){                                                  // 톡
      const t2=t+R(.06,.13); tok(t2, f*R(1.05,1.25), R(7,12), g*R(.6,.9), pan+R(-.1,.1), R(.03,.06));
      if(Math.random()<.25) tok(t2+R(.05,.1), f*R(.9,1.15), R(7,11), g*R(.4,.7), pan, R(.03,.05));
    }
    if(Math.random()<pr.sap) tok(t+R(.02,.3), R(3200,4800), R(4,7), g*.35, R(-.7,.7), R(.012,.025)); // tiny sap tick
    if(Math.random()<pr.pop) tok(t+R(0,.08), R(420,700), R(3,5), g*1.4, R(-.4,.4), R(.08,.14));      // log pop
    crackT=setTimeout(crackle, R(pr.gap[0],pr.gap[1]));
  }
  // realistic field crickets: pulse trains (~30/s) grouped in chirps, sung in bouts with long pauses
  function chirp(t, c){
    const o=ctx.createOscillator(), o2=ctx.createOscillator(), g=ctx.createGain(), h=ctx.createGain(), lp=ctx.createBiquadFilter();
    const f=c.f*R(.995,1.005); o.type="sine"; o2.type="sine"; o.frequency.value=f; o2.frequency.value=f*2.01; h.gain.value=.1;
    lp.type="lowpass"; lp.frequency.value=9500-c.dist*5000; g.gain.value=0;
    o.connect(g); o2.connect(h).connect(g); g.connect(lp); out(lp,c.pan);
    const n=Math.round(R(c.pulses[0],c.pulses[1])), sp=R(.029,.036), v=c.vol*R(.75,1.1);
    for(let i=0;i<n;i++){
      const a=t+i*sp, vv=v*(i===0?.7:1)*(i===n-1?.8:1);
      g.gain.setValueAtTime(0,a); g.gain.linearRampToValueAtTime(vv,a+.003); g.gain.setTargetAtTime(0,a+.006,.0045);
      o.frequency.setValueAtTime(f*(1-i*.002),a);
    }
    o.start(t); o2.start(t); o.stop(t+n*sp+.06); o2.stop(t+n*sp+.06);
  }
  const CRICKETS=[
    {f:4350, pan:-.55, vol:.022, dist:.1, pulses:[3,4], gap:[.5,.8], bout:[1,3], rest:[5000,12000]},
    {f:4720, pan:.62,  vol:.013, dist:.35,pulses:[2,4], gap:[.55,.9], bout:[1,2], rest:[7000,16000]},
    {f:5050, pan:.08,  vol:.007, dist:.7, pulses:[3,5], gap:[.6,.9], bout:[1,3], rest:[6000,15000]}
  ];
  function singer(c){
    let left=0;
    function step(){
      if(!cur||!P[cur].crickets||!enabled) return;
      if(left<=0){ left=Math.round(R(c.bout[0],c.bout[1])); }
      chirp(ctx.currentTime+.02,c); left--;
      const next = left>0 ? R(c.gap[0],c.gap[1])*1000 : R(c.rest[0],c.rest[1]);
      crickTimers.push(setTimeout(step,next));
    }
    crickTimers.push(setTimeout(step, R(500,7000)));
  }
  function crickets(){
    if(!cur||!P[cur].crickets) return;
    CRICKETS.forEach(singer);
  }
  function strike(){ // match strike: dry scratch, then soft ignition
    const t=ctx.currentTime+.05;
    for(let i=0;i<9;i++) tok(t+i*.022, R(2600,4200), R(2,4), .09, 0, .02);
    const src=ctx.createBufferSource(); src.buffer=noise;
    const lp=ctx.createBiquadFilter(); lp.type="lowpass"; lp.frequency.setValueAtTime(250,t+.22); lp.frequency.exponentialRampToValueAtTime(900,t+.5);
    const g=ctx.createGain(); g.gain.setValueAtTime(.0001,t+.22); g.gain.exponentialRampToValueAtTime(.5,t+.36); g.gain.exponentialRampToValueAtTime(.0001,t+1.2);
    src.connect(lp).connect(g); out(g,0); src.start(t+.22, 0, 1.1);
  }
  function stopTimers(){ clearTimeout(crackT); clearTimeout(crickT); crackT=crickT=null; crickTimers.forEach(clearTimeout); crickTimers=[]; }
  function music(on){
    if(!ctx) return;
    const now=ctx.currentTime;
    if(on){
      const pr=bgm.play(); if(pr&&pr.catch) pr.catch(()=>{});
      if(bgmGain){ bgmGain.gain.cancelScheduledValues(now); bgmGain.gain.setTargetAtTime(BGM_MAX*volMusic, now, .25); }
      else bgm.volume=Math.min(1,BGM_MAX*volMusic);
    }else{
      if(bgmGain){ bgmGain.gain.cancelScheduledValues(now); bgmGain.gain.setTargetAtTime(0, now, .3); }
      setTimeout(()=>{ if(!enabled||document.hidden) bgm.pause(); }, 900);
    }
  }
  function wake(){ // first touch anywhere starts the piano
    if(!init()) return;
    if(ctx.state!=="running") ctx.resume();
    if(enabled) music(true);
  }
  function apply(){
    if(!ctx) return; const now=ctx.currentTime;
    master.gain.cancelScheduledValues(now); master.gain.setTargetAtTime(enabled&&cur?1:0, now, .35);
    if(cur){ bedGain.gain.setTargetAtTime(P[cur].bed, now, .6); bedLP.frequency.setTargetAtTime(P[cur].lp, now, .6); }
  }
  function level(key){
    if(!init()) return;
    if(ctx.state!=="running") ctx.resume();
    if(enabled) music(true);
    const changed = cur!==key; cur=key; stopTimers();
    if(enabled){ crackle(); crickets(); if(changed && key==="match") strike(); }
    apply();
  }
  function stop(){ cur=null; stopTimers(); apply(); }
  function setMuted(m){
    enabled=!m;
    try{ localStorage.setItem("cc-sound", enabled?"on":"off"); }catch(e){}
    if(enabled){ init(); if(ctx.state!=="running") ctx.resume(); music(true); if(cur){ stopTimers(); crackle(); crickets(); } }
    else { stopTimers(); music(false); }
    apply(); paint();
  }
  function setMusic(v){ volMusic=v; try{localStorage.setItem("cc-vol-music",v)}catch(e){}
    if(ctx&&bgmGain&&enabled) bgmGain.gain.setTargetAtTime(BGM_MAX*v, ctx.currentTime, .15); }
  function setFire(v){ volFire=v; try{localStorage.setItem("cc-vol-fire",v)}catch(e){}
    if(ctx&&fireVolNode) fireVolNode.gain.setTargetAtTime(v*1.25, ctx.currentTime, .15); }
  const ON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>', OFF='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6M21 9l-5 6"/></svg>';
  function paint(){
    document.querySelectorAll("[data-snd]").forEach(b=>{ b.innerHTML=enabled?ON:OFF; b.classList.toggle("off",!enabled); b.setAttribute("aria-label","소리 조절"); });
    const mb=document.getElementById("muteBtn"); if(mb) mb.textContent=enabled?"모든 소리 끄기":"소리 켜기";
  }
  document.addEventListener("visibilitychange",()=>{
    if(!ctx) return;
    if(document.hidden){ stopTimers(); bgm.pause(); ctx.suspend(); }
    else if(enabled){ ctx.resume(); music(true); if(cur){ crackle(); crickets(); } }
  });
  paint();
  // volume panel
  const panel=document.getElementById("volPanel"), inM=document.getElementById("volMusic"), inF=document.getElementById("volFire"), mb=document.getElementById("muteBtn");
  inM.value=Math.round(volMusic*100); inF.value=Math.round(volFire*100);
  const fill=el=>el.style.setProperty("--p",el.value+"%"); fill(inM); fill(inF);
  inM.addEventListener("input",()=>{fill(inM); if(!enabled) setMuted(false); setMusic(inM.value/100);});
  inF.addEventListener("input",()=>{fill(inF); if(!enabled) setMuted(false); setFire(inF.value/100);});
  mb.addEventListener("click",e=>{e.stopPropagation(); setMuted(enabled);});
  function openPanel(btn){
    const r=btn.getBoundingClientRect();
    panel.style.top=(r.bottom+10)+"px"; panel.style.right=Math.max(12,innerWidth-r.right)+"px";
    panel.hidden=false; requestAnimationFrame(()=>panel.classList.add("on"));
  }
  function closePanel(){ panel.classList.remove("on"); setTimeout(()=>{ if(!panel.classList.contains("on")) panel.hidden=true; },200); }
  document.querySelectorAll("[data-snd]").forEach(b=>b.addEventListener("click",e=>{
    e.stopPropagation(); if(panel.hidden||!panel.classList.contains("on")) openPanel(b); else closePanel();
  }));
  panel.addEventListener("click",e=>e.stopPropagation());
  document.addEventListener("click",()=>{ if(!panel.hidden) closePanel(); });
  window.addEventListener("resize",closePanel);
  const UNLOCK=["touchend","click","pointerup","keydown"];
  function unlock(){
    wake();
    setTimeout(()=>{ if(!bgm.paused || !enabled) UNLOCK.forEach(ev=>document.removeEventListener(ev,unlock,true)); },300);
  }
  UNLOCK.forEach(ev=>document.addEventListener(ev,unlock,true));
  return {level, stop, wake};
})();


/* ---------- intro ---------- */
(function(){
  const intro=document.getElementById("intro");
  document.getElementById("introArt").innerHTML=art("campfire");
  function go(){ try{ Sound.wake(); }catch(e){} intro.classList.add("out"); setTimeout(()=>intro.remove(),1000); }
  intro.addEventListener("click",go);
  intro.addEventListener("keydown",e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); go(); } });
  intro.focus();
})();

/* ---------- stars + constellations ---------- */
(function(){
  const sky=document.getElementById("sky");
  const n = Math.round(Math.min(140, 50 + (innerWidth*innerHeight)/9000));
  for(let i=0;i<n;i++){
    const st=document.createElement("span"); st.className="star"+(Math.random()<.4?" tw":"");
    const size=Math.random()<.86?.8+Math.random()*1.1:1.8+Math.random()*1.1;
    const y=Math.pow(Math.random(),1.25)*100; // a little denser toward the top
    st.style.cssText=`left:${Math.random()*100}%;top:${y}%;width:${size}px;height:${size}px;--o:${(.25+Math.random()*.6).toFixed(2)};opacity:var(--o);--d:${(3+Math.random()*4).toFixed(1)}s;--dl:${(-Math.random()*5).toFixed(1)}s`;
    sky.appendChild(st);
  }
  // [name, css position, width, points, edges]
  const C=[
    ["북두칠성","left:4%;top:13%",150,[[8,40],[30,30],[52,34],[70,44],[96,40],[110,62],[86,70]],[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]]],
    ["카시오페이아","right:3%;top:42%",120,[[6,22],[30,44],[56,26],[82,46],[110,18]],[[0,1],[1,2],[2,3],[3,4]]],
    ["오리온","left:5%;top:66%",110,[[20,10],[84,16],[44,52],[54,50],[64,48],[24,96],[88,92]],[[0,2],[1,4],[2,3],[3,4],[2,5],[4,6]]],
    ["백조","right:7%;top:80%",110,[[55,6],[55,40],[55,86],[16,30],[94,48]],[[0,1],[1,2],[3,1],[1,4]]]
  ];
  C.forEach(([name,pos,w,pts,edges])=>{
    const h=Math.max(...pts.map(p=>p[1]))+10;
    let svg=`<svg class="constel" style="${pos}" width="${w}" height="${h}" viewBox="0 0 ${w+6} ${h}" aria-hidden="true">`;
    edges.forEach(([a,b])=>svg+=`<line x1="${pts[a][0]}" y1="${pts[a][1]}" x2="${pts[b][0]}" y2="${pts[b][1]}"/>`);
    pts.forEach(p=>svg+=`<circle cx="${p[0]}" cy="${p[1]}" r="${(1.3+Math.random()*.9).toFixed(1)}"/>`);
    sky.insertAdjacentHTML("beforeend",svg+"</svg>");
  });
})();

/* ---------- shooting star every ~10s ---------- */
(function(){
  if(reduce) return;
  const sky=document.getElementById("sky");
  function fire(){
    const el=document.createElement("span"); el.className="shoot";
    el.style.left=(2+Math.random()*55)+"%"; el.style.top=(4+Math.random()*30)+"%";
    el.style.setProperty("--len",(220+Math.random()*140)+"px");
    sky.appendChild(el); requestAnimationFrame(()=>el.classList.add("go"));
    setTimeout(()=>el.remove(),1300);
  }
  setTimeout(fire,2500);
  setInterval(fire,10000);
})();

/* ---------- firelight: smooth random wandering ---------- */
(function(){
  if(reduce) return;
  const el=document.getElementById("card");
  const rnd=(a,b)=>a+Math.random()*(b-a);
  function layer(cfg){
    const st={x:0,w:cfg.w0,h:cfg.h0,o:cfg.o0}, tg={...st}, vel={x:0,w:0,h:0,o:0};
    let next=0;
    return function(t){
      if(t>next){
        tg.x=rnd(-cfg.dx,cfg.dx); tg.h=rnd(cfg.h0-cfg.dh*.6,cfg.h0+cfg.dh);
        tg.w=rnd(cfg.w0-cfg.dw,cfg.w0+cfg.dw); tg.o=rnd(cfg.o0-cfg.dop,cfg.o0);
        next=t+rnd(cfg.tmin,cfg.tmax);
      }
      for(const k of ["x","w","h","o"]){ // critically-damped-ish spring
        vel[k]+=(tg[k]-st[k])*cfg.k; vel[k]*=cfg.damp; st[k]+=vel[k];
      }
      return st;
    };
  }
  const L1=layer({w0:1,h0:1,o0:.95,dx:13,dw:.1,dh:.3,dop:.08,tmin:550,tmax:1300,k:.008,damp:.91});
  const L2=layer({w0:.9,h0:.85,o0:.6,dx:18,dw:.12,dh:.38,dop:.12,tmin:380,tmax:950,k:.012,damp:.9});
  function tick(t){
    if(document.getElementById("draw").classList.contains("active")){
      const a=L1(t), b=L2(t);
      el.style.setProperty("--g1x",a.x.toFixed(2)+"%"); el.style.setProperty("--g1w",a.w.toFixed(3));
      el.style.setProperty("--g1h",a.h.toFixed(3)); el.style.setProperty("--g1o",a.o.toFixed(3));
      el.style.setProperty("--g2x",b.x.toFixed(2)+"%"); el.style.setProperty("--g2w",b.w.toFixed(3));
      el.style.setProperty("--g2h",b.h.toFixed(3)); el.style.setProperty("--g2o",b.o.toFixed(3));
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
