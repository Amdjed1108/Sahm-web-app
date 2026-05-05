// Paste this in auth.js — this is your session gate
import { onAuthStateChanged } from "firebase/auth";

onAuthStateChanged(auth, (user) => {
  if (!user) return window.location.href = "auth.html";
  // get their role from Firestore users/{uid}
  const doc = await getDoc(doc(db, "users", user.uid));
  const role = doc.data().role;
  localStorage.setItem("role", role);
  localStorage.setItem("hospitalId", doc.data().hospitalId);
  // redirect by role
  const routes = { admin: "admin.html", er_doctor: "er.html", ... };
  window.location.href = routes[role];
});

/* ─── Canvas — confined to left panel ─── */
(function () {
    const canvas = document.getElementById('bg');
    const ctx    = canvas.getContext('2d');
    const left   = document.querySelector('.left');
    let W, H;
  
    function resize() {
      const r = left.getBoundingClientRect();
      W = canvas.width  = r.width;
      H = canvas.height = r.height;
    }
    addEventListener('resize', resize); resize();
  
    /* ─ Particles — slow random drift, scatter across full panel ─ */
    const COLS = ['37,99,235','78,110,245','150,175,255'];
    class Particle {
      constructor(instant) { this.init(instant); }
      init(instant) {
        /* spawn anywhere across the full panel */
        this.x = Math.random() * W;
        this.y = instant ? Math.random() * H : (Math.random() < 0.5 ? -8 : H + 8);
        /* slow drift in any direction */
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.12 + Math.random() * 0.22;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.trail = [];
        this.trailLen = 20 + Math.floor(Math.random() * 16);
        this.life = instant ? Math.floor(Math.random() * 280) : 0;
        this.maxLife = 300 + Math.floor(Math.random() * 280);
        this.r = 1.0 + Math.random() * 1.5;
        this.col = COLS[Math.floor(Math.random() * COLS.length)];
      }
      get a() {
        return Math.min(this.life / 50, (this.maxLife - this.life) / 50, 1) * 0.82;
      }
      step() {
        this.trail.unshift({x:this.x, y:this.y});
        if (this.trail.length > this.trailLen) this.trail.pop();
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        /* reset when off any edge or life ends */
        const offEdge = this.x < -12 || this.x > W + 12 || this.y < -12 || this.y > H + 12;
        if (offEdge || this.life >= this.maxLife) this.init(false);
      }
      draw() {
        const a = this.a; if (a < 0.01) return;
        for (let i = 1; i < this.trail.length; i++) {
          const f = 1 - i / this.trail.length;
          ctx.beginPath();
          ctx.arc(this.trail[i].x, this.trail[i].y, Math.max(0.25, this.r * f * 0.5), 0, Math.PI*2);
          ctx.fillStyle = `rgba(${this.col},${a * f * 0.5})`; ctx.fill();
        }
        const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 5);
        g.addColorStop(0, `rgba(${this.col},${a * 0.46})`);
        g.addColorStop(1, `rgba(${this.col},0)`);
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r * 5, 0, Math.PI*2);
        ctx.fillStyle = g; ctx.fill();
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(215,228,255,${a * 0.9})`; ctx.fill();
      }
    }
    const pts = Array.from({length:26}, () => new Particle(true));
  
    /* ─ ECG tracer ─ */
    const TRACER = (() => {
      const SHAPES = [
        {w:205,pts:[[0,0],[18,0],[23,.24],[28,0],[42,0],[45,-.52],[47,4.4],[51,-1.2],[59,0],[72,0],[85,.62],[97,0],[125,0]]},
        {w:175,pts:[[0,0],[50,0],[52,-.4],[53,9.2],[55,-2.8],[60,0],[120,0]]},
        {w:195,pts:[[0,0],[22,0],[26,-.18],[31,0],[43,0],[45,.55],[47,-5.1],[51,1.6],[59,0],[72,0],[84,-.58],[95,0],[120,0]]},
        {w:230,pts:[[0,0],[28,0],[40,1.2],[52,2.8],[64,3.6],[76,2.8],[88,.8],[100,0],[116,0],[132,.72],[146,0],[170,0]]},
        {w:185,pts:[[0,0],[24,0],[30,3.0],[38,0],[44,-3.2],[52,0],[66,0],[80,.4],[90,0],[110,0]]},
        {w:115,pts:[[0,0],[8,1.6],[16,-.4],[24,1.4],[32,-.4],[40,1.5],[48,-.4],[52,3.8],[56,-1.2],[62,0],[75,0]]},
        {w:240,pts:[[0,0],[100,0],[104,-.25],[106,4.8],[109,-1.0],[114,0],[200,0]]},
      ];
      let track=[], headX=-340, prev=null;
      const SPEED=58, TRAIL_PX=300, STEPS=130;
  
      function buildTrack() {
        track=[]; let cx=-TRAIL_PX-60, last=null;
        while (cx < W+220) {
          const pool = last ? SHAPES.filter(s=>s!==last) : SHAPES;
          const s = pool[Math.floor(Math.random()*pool.length)];
          track.push({startX:cx,shape:s}); cx+=s.w; last=s;
        }
      }
      function getY(px) {
        const baseY=H*0.768, amp=H*0.021;
        for (let i=0;i<track.length;i++) {
          const end=(i+1<track.length)?track[i+1].startX:track[i].startX+track[i].shape.w;
          if (px>=track[i].startX&&px<end) {
            const bx=px-track[i].startX, pts=track[i].shape.pts;
            for (let j=0;j<pts.length-1;j++) {
              if (bx>=pts[j][0]&&bx<=pts[j+1][0]) {
                const t=(bx-pts[j][0])/(pts[j+1][0]-pts[j][0]);
                return baseY+amp*(pts[j][1]+t*(pts[j+1][1]-pts[j][1]));
              }
            }
            return baseY;
          }
        }
        return baseY;
      }
      buildTrack();
      function tick(now) {
        if (!prev){prev=now;return;}
        const dt=Math.min(now-prev,60); prev=now;
        headX+=SPEED*dt/1000;
        if (headX>W+60){headX=-TRAIL_PX;buildTrack();}
      }
      function draw() {
        if (!track.length) return;
        const tailX=headX-TRAIL_PX;
        for (let i=0;i<STEPS;i++) {
          const ta=i/STEPS, tb=(i+1)/STEPS;
          const xa=tailX+TRAIL_PX*ta, xb=tailX+TRAIL_PX*tb;
          if (xb<0||xa>W) continue;
          ctx.beginPath();
          ctx.moveTo(xa,getY(xa)); ctx.lineTo(xb,getY(xb));
          ctx.strokeStyle=`rgba(37,99,235,${Math.pow(ta,1.5)*0.42})`;
          ctx.lineWidth=0.55+ta*1.15;
          ctx.lineJoin='round'; ctx.lineCap='round'; ctx.stroke();
        }
      }
      return {tick,draw};
    })();
  
    /* ─ Decorative ─ */
    function grid() {
      ctx.strokeStyle='rgba(255,255,255,.016)'; ctx.lineWidth=1;
      for (let x=0;x<W;x+=74){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
      for (let y=0;y<H;y+=74){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
    }
    function rings() {
      for (let i=1;i<=7;i++){
        ctx.beginPath();ctx.arc(W,0,(i/7)*W*0.9,0,Math.PI*2);
        ctx.strokeStyle=`rgba(37,99,235,${0.022+i*0.004})`;ctx.lineWidth=1;ctx.stroke();
      }
      for (let i=1;i<=5;i++){
        ctx.beginPath();ctx.arc(0,H,(i/5)*W*0.55,-Math.PI/2,0);
        ctx.strokeStyle=`rgba(124,58,237,${0.02+i*0.005})`;ctx.lineWidth=1;ctx.stroke();
      }
    }
    const cpts=[[.14,.17],[.82,.13],[.76,.83],[.18,.80],[.90,.47]];
    function crosses(now) {
      cpts.forEach(([fx,fy],i)=>{
        const a=0.045+0.022*Math.sin(now*0.00038+i*1.28),s=7;
        const cx=fx*W,cy=fy*H;
        ctx.strokeStyle=`rgba(37,99,235,${a})`;ctx.lineWidth=1.1;
        ctx.beginPath();ctx.moveTo(cx-s,cy);ctx.lineTo(cx+s,cy);ctx.stroke();
        ctx.beginPath();ctx.moveTo(cx,cy-s);ctx.lineTo(cx,cy+s);ctx.stroke();
      });
    }
  
    function frame(now) {
      ctx.clearRect(0,0,W,H);
      grid(); rings(); crosses(now);
      pts.forEach(p=>{p.step();p.draw();});
      TRACER.tick(now); TRACER.draw();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();
  
  /* ─── Password toggle ─── */
  const pwI=document.getElementById('pw'),pwtBtn=document.getElementById('pwt'),eyeEl=document.getElementById('eye');
  pwtBtn.onclick=()=>{
    const show=pwI.type==='password'; pwI.type=show?'text':'password';
    eyeEl.innerHTML=show
      ?'<line x1="1" y1="1" x2="23" y2="23"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><path d="M1 12s4-8 11-8"/>'
      :'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
  };
  
  /* ─── Sign in ─── */
  const sb=document.getElementById('sb'),errEl=document.getElementById('err');
  const sidEl=document.getElementById('sid');
  
  function fieldError(el,on){
    el.style.borderColor = on ? '#DC2626' : '';
    el.style.boxShadow  = on ? '0 0 0 3px rgba(220,38,38,.12)' : '';
  }
  
  sidEl.addEventListener('input',()=>fieldError(sidEl,false));
  pwI.addEventListener('input',()=>fieldError(pwI,false));
  
  sb.onclick=async()=>{
    const id=sidEl.value.trim(), pw=pwI.value;
    /* Clear previous state */
    errEl.classList.remove('show');
    fieldError(sidEl,false); fieldError(pwI,false);
  
    /* Validate empty */
    let hasErr=false;
    if (!id){ fieldError(sidEl,true); hasErr=true; }
    if (!pw){ fieldError(pwI,true);  hasErr=true; }
    if (hasErr){ showErr(!id&&!pw?'Staff ID and password are required.':!id?'Staff ID is required.':'Password is required.'); return; }
  
    sb.classList.add('loading'); sb.disabled=true;
    await new Promise(r=>setTimeout(r,1400));
    sb.classList.remove('loading'); sb.disabled=false;
    fieldError(sidEl,true); fieldError(pwI,true);
    showErr('Incorrect Staff ID or password. Please try again.');
  };
  
  function showErr(m){
    errEl.textContent = m;
    void errEl.offsetWidth;
    errEl.classList.add('show');
    const b = document.querySelector('.form-block');
    /* Lock current visible state before resetting animation */
    b.style.opacity   = '1';
    b.style.transform = 'translateY(0)';
    b.style.animation = 'none';
    requestAnimationFrame(() => { b.style.animation = 'shake .3s ease'; });
  }
  document.addEventListener('keydown',e=>{if(e.key==='Enter')sb.click();});
  const sty=document.createElement('style');
  sty.textContent='@keyframes shake{0%,100%{transform:translateX(0)}22%{transform:translateX(-5px)}44%{transform:translateX(5px)}66%{transform:translateX(-3px)}88%{transform:translateX(3px)}}';
  document.head.appendChild(sty);