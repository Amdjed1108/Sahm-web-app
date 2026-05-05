import { db } from "./config.js";
import { collection, addDoc } from "firebase/firestore";

onSnapshot(
  query(collection(db, "prenotifications"),
    where("hospitalId", "==", hospitalId),
    where("status", "==", "incoming"),
    orderBy("eta", "asc")),
  (snap) => snap.forEach(d => renderIncomingCard(d.data())) // your existing render function
);

/* ── Constants ── */
const DOCTORS_PIN = {
    '1234': {name:'Dr. Rédha', role:'ER Doctor'},
    '5678': {name:'Dr. Mansouri', role:'Cardiologist'},
    '9012': {name:'Dr. Meziani', role:'Neurologist'},
  };
  
  /* ── Data ── */
  let PATIENTS = [
    {id:'e1',name:'Amara Boulmerka',nid:'198206123456789',sex:'Male',age:62,dob:'12 Apr 1962',blood:'A+',allergies:'None',meds:'Warfarin 5mg',reason:'Unconscious on arrival, head trauma',contact:'Farid B. · 0550 111 222',doctor:'Dr. Rédha (ER Doctor)',gcs:6,severity:'severe',time:nowStr(),status:'active',exams:[],notes:{interro:'',clin:'',notes:'',by:''},conclusion:'',decision:null,
      medHistory:[
        {date:'14 Jan 2024',service:'Neurologie',title:'TIA episode',detail:'Transient ischemic attack, resolved in 2h. MRI clear. Prescribed aspirin 100mg.'},
        {date:'03 Aug 2022',service:'Cardiologie',title:'Atrial fibrillation',detail:'Paroxysmal AF, cardioverted. Started on Warfarin 5mg. Follow-up every 3 months.'},
      ],
      log:[{time:nowStr(),who:'Intern',what:'Registered — GCS 6 (Severe)'}]},
    {id:'e2',name:'Sonia Dahmani',nid:'199009055678901',sex:'Female',age:34,dob:'05 Sep 1990',blood:'O−',allergies:'Penicillin',meds:'None',reason:'Severe chest pain, diaphoresis',contact:'Mehdi D. · 0661 333 444',doctor:'Dr. Rédha (ER Doctor)',gcs:11,severity:'moderate',time:nowStr(),status:'active',exams:[],notes:{interro:'',clin:'',notes:'',by:''},conclusion:'',decision:null,
      medHistory:[],
      log:[{time:nowStr(),who:'Intern',what:'Registered — GCS 11 (Moderate)'}]},
  ];
  
  let NOTIF_MSGS = [
    {id:'n1',from:'Ambulance',msg:'Incoming patient — GCS 6, Protection Civile, ETA 8 min. Male, ~62y, head trauma.',time:nowStr(),read:false},
  ];
  
  let selectedId = null;
  let pinVal = '', pinAction = '';
  
  function nowStr(){ return new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}); }
  
  /* ── Severity helpers ── */
  function gcsSeverity(gcs){
    if(gcs <= 8) return 'severe';
    if(gcs <= 14) return 'moderate';
    return 'normal';
  }
  function gcsChipClass(sev){
    if(sev === 'severe') return 'severe';
    if(sev === 'moderate') return 'moderate';
    return 'normal';
  }
  function gcsLabel(gcs, sev){
    const labels = {severe:'Severe',moderate:'Moderate',normal:'Normal'};
    return `GCS ${gcs} — ${labels[sev]||sev}`;
  }
  
  /* ── Notif ── */
  function renderNotif(){
    const dot = document.getElementById('notif-dot');
    const unread = NOTIF_MSGS.filter(m => !m.read);
    if(unread.length){ dot.classList.add('has-count'); dot.textContent = unread.length; }
    else { dot.classList.remove('has-count'); dot.textContent = ''; }
  }
  
  /* ── Patient tabs ── */
  function renderTabs(){
    const bar = document.getElementById('pt-tabs-bar');
    const countEl = document.getElementById('pt-count');
    bar.innerHTML = '';
    countEl.textContent = PATIENTS.length + (PATIENTS.length === 1 ? ' patient' : ' patients');
    bar.appendChild(countEl);
    PATIENTS.forEach(p => {
      const tab = document.createElement('div');
      tab.className = 'pt-tab' + (p.id === selectedId ? ' active' : '');
      const chipClass = gcsChipClass(p.severity || gcsSeverity(p.gcs));
      tab.innerHTML = `<div class="pt-tab-name">${p.name.split(' ')[0]} ${p.name.split(' ').pop()}</div>
        <div class="pt-tab-meta">
          <span class="gcs-chip ${chipClass}">GCS ${p.gcs}</span>
          <span class="pt-tab-time">${p.time}</span>
        </div>`;
      tab.onclick = () => selectPatient(p.id);
      bar.appendChild(tab);
    });
  }
  
  /* ── Select patient ── */
  function selectPatient(id){
    selectedId = id;
    renderTabs();
    const p = PATIENTS.find(x => x.id === id);
    if(!p) return;
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('pt-view').style.display = 'block';
    renderHeader(p);
    renderInfoGrid(p);
    renderMedHistory(p);
    renderExams(p);
    populateConclusion(p);
    renderDecision(p);
    renderHistory(p);
  }
  
  /* ── Header ── */
  function renderHeader(p){
    document.getElementById('ph-name').textContent = p.name;
    document.getElementById('ph-meta').textContent = `DOB: ${p.dob} · ${p.blood} · ${p.doctor}`;
    const badge = document.getElementById('ph-gcs-badge');
    const sev = p.severity || gcsSeverity(p.gcs);
    badge.textContent = `GCS ${p.gcs}`;
    badge.className = `gcs-badge-large ${gcsChipClass(sev)}`;
  }
  
  /* ── Info grid ── */
  function renderInfoGrid(p){
    const sev = p.severity || gcsSeverity(p.gcs);
    const sevColors = {severe:'color:var(--red)',moderate:'color:var(--urg)',normal:'color:var(--stab)'};
    document.getElementById('info-grid-body').innerHTML = `
      <div class="info-item"><div class="info-label">Full name</div><div class="info-val bold">${p.name}</div></div>
      <div class="info-item"><div class="info-label">GCS on arrival</div><div class="info-val bold" style="${sevColors[sev]||''}">${p.gcs}/15 — ${sev.charAt(0).toUpperCase()+sev.slice(1)}</div></div>
      <div class="info-item"><div class="info-label">Date of birth</div><div class="info-val">${p.dob} (${p.age} y)</div></div>
      <div class="info-item"><div class="info-label">Sex</div><div class="info-val">${p.sex||'—'}</div></div>
      <div class="info-item"><div class="info-label">National ID</div><div class="info-val mono">${p.nid||'—'}</div></div>
      <div class="info-item"><div class="info-label">Blood type</div><div class="info-val blood">${p.blood}</div></div>
      <div class="info-item"><div class="info-label">Allergies</div><div class="info-val">${p.allergies||'None'}</div></div>
      <div class="info-item"><div class="info-label">Medications</div><div class="info-val">${p.meds||'None'}</div></div>
      <div class="info-item info-grid full"><div class="info-label">Chief complaint</div><div class="info-val">${p.reason}</div></div>
      <div class="info-item info-grid full"><div class="info-label">Emergency contact</div><div class="info-val">${p.contact}</div></div>
      <div class="info-item"><div class="info-label">Assigned doctor</div><div class="info-val">${p.doctor}</div></div>
      <div class="info-item"><div class="info-label">Arrival time</div><div class="info-val mono">${p.time}</div></div>`;
  }
  
  /* ── Medical History ── */
  function renderMedHistory(p){
    const body = document.getElementById('history-body');
    const badge = document.getElementById('history-badge');
    const hist = p.medHistory || [];
    if(!hist.length){
      badge.textContent = 'None on file';
      body.innerHTML = '<div style="font-size:12px;color:var(--text3);font-style:italic">No prior history on file.</div>';
      return;
    }
    badge.textContent = hist.length + (hist.length === 1 ? ' entry' : ' entries');
    body.innerHTML = '';
    hist.forEach(h => {
      const row = document.createElement('div');
      row.style.cssText = 'padding:8px 0;border-bottom:1px solid var(--border);display:flex;flex-direction:column;gap:3px';
      row.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:11px;font-weight:700;color:var(--text3);font-family:'JetBrains Mono',monospace">${h.date||'—'}</span>
          ${h.service ? `<span style="font-size:10.5px;font-weight:600;padding:1px 6px;border-radius:4px;background:var(--blue-bg);color:var(--blue);border:1px solid var(--blue-br)">${h.service}</span>` : ''}
        </div>
        <div style="font-size:12.5px;font-weight:600;color:var(--text)">${h.title||'—'}</div>
        ${h.detail ? `<div style="font-size:12px;color:var(--text2);line-height:1.5">${h.detail}</div>` : ''}`;
      row.lastElementChild.style.borderBottom = 'none';
      body.appendChild(row);
    });
    if(body.lastChild) body.lastChild.style.borderBottom = 'none';
  }
  
  /* ── Exams ── */
  function renderExams(p){
    const list = document.getElementById('exam-list');
    if(!p.exams.length){ list.innerHTML = '<div style="font-size:12px;color:var(--text3);font-style:italic">No exams requested yet.</div>'; return; }
    list.innerHTML = '';
    p.exams.forEach(ex => {
      const row = document.createElement('div');
      row.className = 'exam-row';
      const deptClass = ex.dept === 'Radiology' ? 'rad' : 'bio';
      row.innerHTML = `
        <div class="exam-info">
          <div class="exam-type">${ex.type}</div>
          <div class="exam-sub">${ex.by} · ${ex.time}</div>
        </div>
        <span class="exam-dept-badge ${deptClass}">${ex.dept}</span>
        <span class="exam-badge ${ex.status === 'done' ? 'done' : 'pending'}">${ex.status === 'done' ? 'Done' : 'Pending'}</span>`;
      list.appendChild(row);
    });
  }
  
  function openExamForm(){ document.getElementById('exam-form').style.display = 'flex'; document.getElementById('exam-form').style.flexDirection = 'column'; }
  function closeExamForm(){ document.getElementById('exam-form').style.display = 'none'; }
  
  function submitExam(docName){
    const p = PATIENTS.find(x => x.id === selectedId); if(!p) return;
    const sel = document.getElementById('ef-type');
    const type = sel.value; if(!type) return;
    const opt = sel.options[sel.selectedIndex];
    const dept = opt.dataset.dept || 'Lab';
    const notes = document.getElementById('ef-notes').value;
    const ex = {type, dept, notes, by: docName || 'Dr.', time: nowStr(), status:'pending'};
    p.exams.push(ex);
    p.log.push({time:nowStr(),who:ex.by,what:`Requested ${type} (${dept})`});
    renderExams(p);
    renderHistory(p);
    closeExamForm();
    document.getElementById('ef-type').value = '';
    document.getElementById('ef-notes').value = '';
  }
  
  /* ── Conclusion ── */
  function populateConclusion(p){
    document.getElementById('conclusion-text').value = p.conclusion || '';
  }
  
  /* ── Verdict ── */
  let selectedVerdict = null;
  function selectVerdict(btn){
    document.querySelectorAll('.verdict-opt').forEach(o => o.classList.remove('on','go','rean','fwd'));
    btn.classList.add('on', btn.dataset.d);
    selectedVerdict = btn.dataset.d;
    const extra = document.getElementById('verdict-extra');
    extra.classList.add('show');
    document.getElementById('fwd-field').style.display = selectedVerdict === 'fwd' ? '' : 'none';
  }
  
  function renderDecision(p){
    document.querySelectorAll('.verdict-opt').forEach(o => o.classList.remove('on','go','rean','fwd'));
    document.getElementById('verdict-extra').classList.remove('show');
    const fin = document.getElementById('verdict-finalized');
    const btn = document.getElementById('verdict-submit-btn');
    fin.style.display = 'none';
    btn.style.display = '';
    if(p.decision){
      fin.style.display = 'block';
      fin.className = 'verdict-finalized';
      fin.textContent = `${p.decision.label}${p.decision.detail ? ' → ' + p.decision.detail : ''} · ${p.decision.by} at ${p.decision.time}`;
      btn.style.display = 'none';
    }
  }
  
  function finalizeDecision(docName){
    if(!selectedVerdict) return;
    const p = PATIENTS.find(x => x.id === selectedId); if(!p) return;
    const labels = {go:'✓ Good to go — discharge',rean:'⟳ Réanimation',fwd:'→ Forward to service'};
    const conclusion = document.getElementById('conclusion-text').value;
    p.conclusion = conclusion;
    let detail = '';
    if(selectedVerdict === 'fwd') detail = document.getElementById('fwd-service').value;
    p.decision = {d: selectedVerdict, label: labels[selectedVerdict], detail, by: docName, time: nowStr()};
    const what = `Verdict: ${labels[selectedVerdict]}${detail ? ' → ' + detail : ''}` + (conclusion ? ` | Conclusion: ${conclusion.slice(0,60)}${conclusion.length>60?'…':''}` : '');
    p.log.push({time:nowStr(),who:docName,what});
    document.getElementById('verdict-author').textContent = docName;
    renderDecision(p);
    renderHistory(p);
  }
  
  /* ── History ── */
  function renderHistory(p){
    const body = document.getElementById('consult-history-body');
    const badge = document.getElementById('history-count');
    if(!p.log || !p.log.length){ body.innerHTML='<div style="font-size:12px;color:var(--text3);font-style:italic">No history yet.</div>'; badge.textContent='0'; return; }
    badge.textContent = p.log.length;
    body.innerHTML = '';
    [...p.log].reverse().forEach(e => {
      const row = document.createElement('div');
      row.className = 'log-entry';
      row.innerHTML = `<div class="log-time">${e.time}</div><div class="log-who">${e.who}</div><div class="log-what">${e.what}</div>`;
      body.appendChild(row);
    });
  }
  
  /* ── Log button ── */
  document.getElementById('btn-log').addEventListener('click', () => {
    const p = PATIENTS.find(x => x.id === selectedId); if(!p) return;
    alert(p.log.map(e => `[${e.time}] ${e.who}: ${e.what}`).join('\n'));
  });
  
  /* ── PIN ── */
  function openPin(action){
    pinAction = action; pinVal = ''; updatePinDots();
    const subs = {exam:'Authorise exam request',decision:'Confirm final verdict'};
    document.getElementById('pin-sub').textContent = subs[action] || 'Enter your 4-digit PIN';
    document.getElementById('pin-modal').classList.add('show');
  }
  function closePin(){ document.getElementById('pin-modal').classList.remove('show'); }
  function pinTap(n){
    if(pinVal.length >= 4) return;
    pinVal += n; updatePinDots();
    if(pinVal.length === 4) setTimeout(() => { processPinAction(); closePin(); }, 280);
  }
  function pinDel(){ pinVal = pinVal.slice(0,-1); updatePinDots(); }
  function updatePinDots(){ for(let i=0;i<4;i++) document.getElementById('pd'+i).classList.toggle('on', i < pinVal.length); }
  function processPinAction(){
    const doc = DOCTORS_PIN[pinVal];
    const docName = doc ? doc.name + ' (' + doc.role + ')' : 'Unknown (PIN: '+pinVal+')';
    if(pinAction === 'exam') openExamForm();
    else if(pinAction === 'decision') finalizeDecision(docName);
  }
  
  /* ── Register ── */
  let regGcsE=0, regGcsV=0, regGcsM=0;
  
  function setRegGCS(btn){
    const g = btn.dataset.g;
    const wasOn = btn.classList.contains('on');
    document.querySelectorAll(`.gcs-btn[data-g="${g}"]`).forEach(b => b.classList.remove('on'));
    if(!wasOn){
      btn.classList.add('on');
      if(g==='re') regGcsE = parseInt(btn.dataset.v);
      else if(g==='rv') regGcsV = parseInt(btn.dataset.v);
      else regGcsM = parseInt(btn.dataset.v);
    } else {
      if(g==='re') regGcsE = 0;
      else if(g==='rv') regGcsV = 0;
      else regGcsM = 0;
    }
    updateRegGCS();
  }
  
  function updateRegGCS(){
    const numEl = document.getElementById('reg-gcs-score-num');
    const routingBlock = document.getElementById('reg-gcs-routing-block');
    const routingTitle = document.getElementById('reg-gcs-routing-title');
    const routingSub = document.getElementById('reg-gcs-routing-sub');
    if(!regGcsE || !regGcsV || !regGcsM){
      numEl.textContent='—'; numEl.className='gcs-score-num';
      routingBlock.className='gcs-routing-block pending';
      routingTitle.textContent='Select all 3 components';
      routingSub.textContent='Eye · Verbal · Motor';
      return;
    }
    const score = regGcsE+regGcsV+regGcsM;
    numEl.textContent = score;
    if(score===15){ numEl.className='gcs-score-num normal'; routingBlock.className='gcs-routing-block office'; routingTitle.textContent='✓ Doctor\'s Office'; routingSub.textContent='GCS 15 — Normal neurological status'; }
    else if(score>=9){ numEl.className='gcs-score-num moderate'; routingBlock.className='gcs-routing-block er'; routingTitle.textContent='→ ER Déchocage'; routingSub.textContent=`GCS ${score}/15 — Moderate impairment`; }
    else { numEl.className='gcs-score-num severe'; routingBlock.className='gcs-routing-block er'; routingTitle.textContent='⚠ ER Déchocage'; routingSub.textContent=`GCS ${score}/15 — Severe, immediate care required`; }
  }
  
  document.getElementById('btn-register').addEventListener('click', () => {
    document.getElementById('reg-panel').classList.add('open');
  });
  document.getElementById('reg-close').addEventListener('click', closeReg);
  document.getElementById('rg-cancel').addEventListener('click', closeReg);
  function closeReg(){ document.getElementById('reg-panel').classList.remove('open'); }
  
  document.getElementById('rg-submit').addEventListener('click', () => {
    const name = document.getElementById('rg-name').value.trim();
    if(!name){ document.getElementById('rg-name').style.borderColor = 'var(--red)'; return; }
    if(!regGcsE || !regGcsV || !regGcsM){ alert('Complete the Glasgow Coma Scale first.'); return; }
    const gcs = regGcsE + regGcsV + regGcsM;
    const sev = gcsSeverity(gcs);
    const p = {
      id: 'e'+Date.now(), name,
      dob: document.getElementById('rg-dob').value || '—',
      nid: document.getElementById('rg-nid').value || '—',
      sex: document.getElementById('rg-sex').value || '—',
      blood: document.getElementById('rg-blood').value || '—',
      allergies: document.getElementById('rg-allerg').value || 'None',
      meds: document.getElementById('rg-meds').value || 'None',
      reason: document.getElementById('rg-reason').value || '—',
      contact: (document.getElementById('rg-cname').value || '—') + ' · ' + (document.getElementById('rg-cphone').value || '—'),
      doctor: '—',
      gcs, severity: sev, age: '—',
      time: nowStr(), status: 'active',
      exams: [], notes: {interro:'',clin:'',notes:'',by:''}, conclusion: '', decision: null,
      log: [{time:nowStr(),who:'Intern',what:`Registered — GCS ${gcs} (${sev.charAt(0).toUpperCase()+sev.slice(1)})`}],
    };
    PATIENTS.push(p);
    renderTabs();
    closeReg();
    selectPatient(p.id);
    // reset form
    ['rg-name','rg-dob','rg-nid','rg-allerg','rg-meds','rg-cname','rg-cphone'].forEach(id => {
      const el = document.getElementById(id); if(el) el.value = '';
    });
    document.getElementById('rg-reason').value = '';
    regGcsE=0; regGcsV=0; regGcsM=0;
    document.querySelectorAll('.gcs-btn[data-g^="r"]').forEach(b => b.classList.remove('on'));
    updateRegGCS();
  });
  
  /* ── Init ── */
  renderTabs();
  renderNotif();
  if(PATIENTS.length) selectPatient(PATIENTS[0].id);