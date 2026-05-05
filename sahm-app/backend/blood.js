const COMPATIBLE_WITH = {
    'O−':  ['O−','O+','A−','A+','B−','B+','AB−','AB+'],
    'O+':  ['O+','A+','B+','AB+'],
    'A−':  ['A−','A+','AB−','AB+'],
    'A+':  ['A+','AB+'],
    'B−':  ['B−','B+','AB−','AB+'],
    'B+':  ['B+','AB+'],
    'AB−': ['AB−','AB+'],
    'AB+': ['AB+'],
  };
  // When doctor requests blood for patient with type X,
  // query bloodInventory where bloodType is in COMPATIBLE_WITH[X]

  /* ── Constants ── */
const STAFF_PIN = {
  '3344': {name:'Dr. Amrani',  role:'Blood Bank Technician'},
  '7788': {name:'Dr. Zidane',  role:'Hémobiologiste'},
};

const ALL_TYPES = ['A+','A−','B+','B−','O+','O−','AB+','AB−'];

/* Blood a patient of type X can RECEIVE from */
const CAN_RECEIVE_FROM = {
  'O−':  ['O−'],
  'O+':  ['O−','O+'],
  'A−':  ['O−','A−'],
  'A+':  ['O−','O+','A−','A+'],
  'B−':  ['O−','B−'],
  'B+':  ['O−','O+','B−','B+'],
  'AB−': ['O−','A−','B−','AB−'],
  'AB+': ['O−','O+','A−','A+','B−','B+','AB−','AB+'],
};

/* ── Inventory ── */
let INVENTORY = {
  'A+':  {qty:12, expDays:28},
  'A−':  {qty:2,  expDays:5},
  'B+':  {qty:8,  expDays:30},
  'B−':  {qty:1,  expDays:3},
  'O+':  {qty:15, expDays:35},
  'O−':  {qty:3,  expDays:12},
  'AB+': {qty:4,  expDays:22},
  'AB−': {qty:0,  expDays:0},
};

/* ── Requests ── */
let REQUESTS = [];
let HISTORY  = [];

/* Load from localStorage (requests sent by doctors in er.html) */
function loadFromStorage(){
  try {
    const raw = localStorage.getItem('sahm_blood_requests');
    if(raw){
      const stored = JSON.parse(raw);
      // Merge: add any that aren't already in REQUESTS
      stored.forEach(r => {
        if(!REQUESTS.find(x => x.id === r.id)) REQUESTS.push(r);
      });
    }
  } catch(e){}
}

/* ── PIN state ── */
let pinVal = '', pinAction = '', pinTargetId = '';

function nowStr(){ return new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}); }

/* ── Inventory status helpers ── */
function invStatus(type){
  const qty = INVENTORY[type].qty;
  if(qty === 0) return 'critical';
  if(qty <= 3)  return 'low';
  return 'ok';
}

/* ── Render inventory ── */
function renderInventory(){
  const grid = document.getElementById('inv-grid');
  grid.innerHTML = '';
  ALL_TYPES.forEach(t => {
    const inv = INVENTORY[t];
    const st = invStatus(t);
    const card = document.createElement('div');
    card.className = `inv-card ${st}`;
    card.title = `Click + to add ${t} stock`;
    const expHtml = inv.expDays > 0 && inv.expDays <= 7
      ? `<div class="inv-expiry">Exp. in ${inv.expDays}d</div>` : '';
    card.innerHTML = `
      <button class="inv-add-btn" onclick="event.stopPropagation();openAddStock('${t}')" title="Add ${t} stock">+</button>
      <div class="inv-type">${t}</div>
      <div class="inv-qty">${inv.qty === 0 ? '—' : inv.qty}</div>
      <div class="inv-unit">units</div>
      ${expHtml}`;
    grid.appendChild(card);
  });
}

/* ── Render stats ── */
function renderStats(){
  const total = ALL_TYPES.reduce((s,t) => s + INVENTORY[t].qty, 0);
  const pending = REQUESTS.filter(r => r.status === 'pending').length;
  const critical = ALL_TYPES.filter(t => invStatus(t) === 'critical').length;
  document.getElementById('stats-bar').innerHTML = `
    <div class="stat-card">
      <div class="stat-num ok">${total}</div>
      <div class="stat-label">Total units</div>
    </div>
    <div class="stat-card">
      <div class="stat-num ${pending > 0 ? 'warn' : 'ok'}">${pending}</div>
      <div class="stat-label">Pending requests</div>
    </div>
    <div class="stat-card">
      <div class="stat-num ${critical > 0 ? 'alert' : 'ok'}">${critical}</div>
      <div class="stat-label">Types critical</div>
    </div>`;
}

/* ── Render requests ── */
function renderRequests(){
  const list = document.getElementById('req-list');
  const countEl = document.getElementById('req-count');
  const active = REQUESTS.filter(r => r.status !== 'delivered');
  countEl.textContent = active.length;

  if(!active.length){
    list.innerHTML = '<div class="empty-msg">No active blood requests.</div>';
    return;
  }
  list.innerHTML = '';

  // Sort: immediate first, then urgent, then routine; within each group by time desc
  const order = {immediate:0,urgent:1,routine:2};
  const sorted = [...active].sort((a,b) => (order[a.urgency]||2) - (order[b.urgency]||2));

  sorted.forEach(r => {
    const compatTypes = CAN_RECEIVE_FROM[r.patientBloodType] || [];
    const chips = compatTypes.map(t => {
      const avail = INVENTORY[t] && INVENTORY[t].qty > 0;
      return `<span class="compat-chip${avail ? '' : ' unavail'}" title="${avail ? INVENTORY[t].qty+' units available' : 'Out of stock'}">${t}</span>`;
    }).join('');

    let actionHtml = '';
    if(r.status === 'pending'){
      actionHtml = `<button class="act-btn confirm" onclick="openPin('confirm','${r.id}')">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Confirm (PIN)</button>`;
    } else if(r.status === 'confirmed'){
      actionHtml = `<button class="act-btn dispatch" onclick="advanceStatus('${r.id}','dispatched')">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Mark dispatched</button>`;
    } else if(r.status === 'dispatched'){
      actionHtml = `<button class="act-btn delivered" onclick="advanceStatus('${r.id}','delivered')">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Mark delivered</button>`;
    }

    const statusMap = {pending:'pending',confirmed:'confirmed',dispatched:'dispatched',delivered:'delivered'};
    const card = document.createElement('div');
    card.className = `req-card ${r.urgency}`;
    card.innerHTML = `
      <div class="req-card-head">
        <span class="urgency-badge ${r.urgency}">${r.urgency}</span>
        <span class="req-patient">${r.patientName}</span>
        <span class="req-time">${r.requestedAt}</span>
      </div>
      <div class="req-card-body">
        <div class="req-row">
          <span class="req-lbl">Patient blood</span>
          <span class="req-val blood">${r.patientBloodType || '—'}</span>
        </div>
        <div class="req-row">
          <span class="req-lbl">Compatible from</span>
          <div style="display:flex;flex-wrap:wrap;gap:4px">${chips || '<span style="font-size:12px;color:var(--text3)">—</span>'}</div>
        </div>
        <div class="req-row">
          <span class="req-lbl">Units needed</span>
          <span class="req-val">${r.unitsNeeded} unit${r.unitsNeeded > 1 ? 's' : ''}</span>
        </div>
        <div class="req-row">
          <span class="req-lbl">Requested by</span>
          <span class="req-val doctor">${r.doctorName}</span>
        </div>
        ${r.notes ? `<div class="req-notes">${r.notes}</div>` : ''}
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
          <div class="req-actions">${actionHtml}</div>
          <span class="req-status-badge ${r.status}">${r.status}</span>
        </div>
        ${r.confirmedBy ? `<div style="font-size:10.5px;color:var(--text3)">Confirmed by ${r.confirmedBy} · ${r.confirmedAt||''}</div>` : ''}
      </div>`;
    list.appendChild(card);
  });
}

/* ── Render history ── */
function renderHistory(){
  const list = document.getElementById('hist-list');
  const countEl = document.getElementById('hist-count');
  const done = [...REQUESTS.filter(r => r.status === 'delivered'), ...HISTORY];
  countEl.textContent = done.length;
  if(!done.length){ list.innerHTML = '<div class="empty-msg">No completed requests today.</div>'; return; }
  list.innerHTML = '';
  done.forEach(r => {
    const row = document.createElement('div');
    row.className = 'hist-row';
    row.innerHTML = `<div class="hist-time">${r.requestedAt}</div>
      <div class="hist-who">${r.doctorName}</div>
      <div class="hist-what">${r.patientName} · ${r.patientBloodType} · ${r.unitsNeeded} unit${r.unitsNeeded>1?'s':''} · <strong>${r.urgency}</strong></div>`;
    list.appendChild(row);
  });
}

/* ── Notif dot ── */
function renderNotif(){
  const dot = document.getElementById('notif-dot');
  const pending = REQUESTS.filter(r => r.status === 'pending').length;
  if(pending){ dot.classList.add('has-count'); dot.textContent = pending; }
  else { dot.classList.remove('has-count'); dot.textContent = ''; }
}

function renderAll(){
  renderStats();
  renderInventory();
  renderRequests();
  renderHistory();
  renderNotif();
}

/* ── Status advance ── */
function advanceStatus(id, newStatus){
  const r = REQUESTS.find(x => x.id === id);
  if(!r) return;
  r.status = newStatus;
  if(newStatus === 'delivered'){
    // Deduct inventory
    const types = CAN_RECEIVE_FROM[r.patientBloodType] || [];
    let remaining = r.unitsNeeded;
    types.forEach(t => {
      if(remaining <= 0) return;
      const avail = INVENTORY[t].qty;
      const take = Math.min(avail, remaining);
      INVENTORY[t].qty -= take;
      remaining -= take;
    });
  }
  saveToStorage();
  renderAll();
}

/* ── Add stock ── */
let stockType = null;
function openAddStock(type){
  stockType = type;
  if(type) document.getElementById('st-type').value = type;
  document.getElementById('stock-modal').classList.add('show');
}
function closeStock(){ document.getElementById('stock-modal').classList.remove('show'); }
function submitStock(){
  const type = document.getElementById('st-type').value;
  const qty  = parseInt(document.getElementById('st-qty').value) || 0;
  const exp  = parseInt(document.getElementById('st-exp').value) || 35;
  if(!type || qty <= 0){ alert('Select a blood type and enter a valid quantity.'); return; }
  if(INVENTORY[type]){
    INVENTORY[type].qty += qty;
    INVENTORY[type].expDays = exp;
  }
  HISTORY.push({
    id:'h'+Date.now(), patientName:'Stock entry', patientBloodType:type,
    doctorName:'Blood Bank', unitsNeeded:qty, urgency:'routine',
    requestedAt:nowStr(), status:'delivered',
  });
  closeStock();
  document.getElementById('st-qty').value='';
  document.getElementById('st-exp').value='';
  document.getElementById('st-note').value='';
  document.getElementById('st-type').value='';
  renderAll();
}

/* ── Incoming banner ── */
function showBanner(msg){
  const b = document.getElementById('incoming-banner');
  document.getElementById('banner-text').textContent = msg;
  b.classList.add('show');
}
function dismissBanner(){ document.getElementById('incoming-banner').classList.remove('show'); }

/* ── localStorage sync (cross-page) ── */
function saveToStorage(){
  try { localStorage.setItem('sahm_blood_requests', JSON.stringify(REQUESTS)); } catch(e){}
}

window.addEventListener('storage', e => {
  if(e.key === 'sahm_blood_requests'){
    const prev = REQUESTS.length;
    loadFromStorage();
    if(REQUESTS.length > prev){
      const newest = REQUESTS[REQUESTS.length - 1];
      showBanner(`New ${newest.urgency.toUpperCase()} request — ${newest.patientName} · ${newest.patientBloodType}`);
    }
    renderAll();
  }
});

/* ── PIN ── */
function openPin(action, targetId){
  pinAction = action; pinTargetId = targetId; pinVal = ''; updatePinDots();
  const subs = {confirm:'Confirm blood request'};
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
  const staff = STAFF_PIN[pinVal];
  const staffName = staff ? staff.name + ' (' + staff.role + ')' : 'Staff (PIN: '+pinVal+')';
  if(pinAction === 'confirm'){
    const r = REQUESTS.find(x => x.id === pinTargetId);
    if(r){ r.status = 'confirmed'; r.confirmedBy = staffName; r.confirmedAt = nowStr(); }
    saveToStorage();
    renderAll();
  }
}

/* ── Demo: load seeded request ── */
function seedDemoRequest(){
  if(REQUESTS.length === 0){
    REQUESTS.push({
      id: 'demo1',
      patientName: 'M. Benali · Bed D-01',
      patientBloodType: 'A+',
      doctorName: 'Dr. Rédha (ER)',
      requestedAt: '09:14',
      urgency: 'immediate',
      unitsNeeded: 2,
      notes: 'Post-trauma hemorrhage, BP unstable. Needs blood before surgical consult.',
      status: 'pending',
      confirmedBy: null,
      confirmedAt: null,
    });
    saveToStorage();
  }
}

/* ── Init ── */
loadFromStorage();
seedDemoRequest();
renderAll();