/* ─── Data ─── */
const STAFF = [
  {id:'s1',name:'Dr. Reda Mansour',sid:'DR001',role:'doctor',office:'Generalist',isActive:true,lastSeen:'Now',color:'#2563EB',abbr:'RM'},
  {id:'s2',name:'Dr. Amina Khelifa',sid:'DR002',role:'doctor',office:'Generalist',isActive:false,lastSeen:'Yesterday 14:02',color:'#7C3AED',abbr:'AK'},
  {id:'s3',name:'Sarah Benali',sid:'SC001',role:'secretary',office:'Admission',isActive:true,lastSeen:'Now',color:'#059669',abbr:'SB'},
  {id:'s4',name:'Karim Tlemcani',sid:'SC002',role:'secretary',office:'Admission',isActive:false,lastSeen:'Yesterday 22:10',color:'#D97706',abbr:'KT'},
  {id:'s5',name:'Dr. Mansouri Rachid',sid:'SP001',role:'specialist',office:'Cardiology',isActive:true,lastSeen:'Now',color:'#DC2626',abbr:'MR'},
  {id:'s6',name:'Dr. Lilia Ferhat',sid:'SP002',role:'specialist',office:'Radiology',isActive:false,lastSeen:'Today 14:35',color:'#0891B2',abbr:'LF'},
  {id:'s7',name:'Dr. Hassan Benmoussa',sid:'AD001',role:'admin',office:'Direction',isActive:true,lastSeen:'Now',color:'#0C1520',abbr:'HB'},
];

const PATIENTS = [
  {name:'Amira Benali',ticket:'A-001',triage:'critical',status:'waiting',office:'ER-A',time:'10:28',admitted:'Sarah Benali'},
  {name:'Youcef Rahmani',ticket:'A-004',triage:'urgent',status:'waiting',office:'ER-A',time:'09:55',admitted:'Karim Tlemcani'},
  {name:'Sara Madi',ticket:'A-007',triage:'stable',status:'waiting',office:'ER-A',time:'11:02',admitted:'Sarah Benali'},
  {name:'Karim Bensalem',ticket:'A-002',triage:'critical',status:'in-consult',office:'ER-A',time:'09:12',admitted:'Sarah Benali'},
  {name:'Nadia Hamdi',ticket:'A-003',triage:'urgent',status:'pending-specialist',office:'ER-A',time:'09:31',admitted:'Karim Tlemcani'},
  {name:'Farid Khelifi',ticket:'A-008',triage:'urgent',status:'passed',office:'ER-A',time:'10:14',admitted:'Sarah Benali'},
  {name:'Omar Cherif',ticket:'A-005',triage:'stable',status:'completed',office:'ER-A',time:'08:44',admitted:'Sarah Benali'},
];

const FULL_LOG = [
  {time:'11:02',who:'Sarah Benali',role:'Secretary',action:'Admitted patient — Triage: Stable',patient:'Sara Madi',ip:'192.168.1.42',type:'admit'},
  {time:'10:48',who:'Dr. Mansouri',role:'Specialist (Cardiology)',action:'Validated AI summary for Holter result',patient:'Nadia Hamdi',ip:'192.168.1.55',type:'validate'},
  {time:'10:45',who:'Dr. Mansouri',role:'Specialist (Cardiology)',action:'Uploaded exam result — Holter Monitor',patient:'Nadia Hamdi',ip:'192.168.1.55',type:'upload'},
  {time:'10:38',who:'Dr. Reda Mansour',role:'Doctor (ER-A)',action:'Marked patient as did not attend — ticket A-008',patient:'Farid Khelifi',ip:'192.168.1.30',type:'status'},
  {time:'10:28',who:'Sarah Benali',role:'Secretary',action:'Admitted patient — Triage: Critical',patient:'Amira Benali',ip:'192.168.1.42',type:'admit'},
  {time:'10:14',who:'Sarah Benali',role:'Secretary',action:'Forwarded to Office ER-A',patient:'Farid Khelifi',ip:'192.168.1.42',type:'assign'},
  {time:'10:08',who:'Dr. Reda Mansour',role:'Doctor (ER-A)',action:'Opened consultation — patient arrived',patient:'Nadia Hamdi',ip:'192.168.1.30',type:'consult'},
  {time:'09:55',who:'Karim Tlemcani',role:'Secretary',action:'Admitted patient — Triage: Urgent',patient:'Youcef Rahmani',ip:'192.168.1.44',type:'admit'},
  {time:'09:44',who:'Dr. Reda Mansour',role:'Doctor (Generalist)',action:'Sent exam request — Holter Monitor · Urgency: Urgent',patient:'Nadia Hamdi',ip:'192.168.1.30',type:'exam'},
  {time:'09:38',who:'Dr. Reda Mansour',role:'Doctor (ER-A)',action:'Opened consultation',patient:'Nadia Hamdi',ip:'192.168.1.30',type:'consult'},
  {time:'09:31',who:'Karim Tlemcani',role:'Secretary',action:'Forwarded to Office ER-A',patient:'Nadia Hamdi',ip:'192.168.1.44',type:'assign'},
  {time:'09:27',who:'Karim Tlemcani',role:'Secretary',action:'Admitted patient — Triage: Urgent',patient:'Nadia Hamdi',ip:'192.168.1.44',type:'admit'},
  {time:'09:24',who:'Dr. Reda Mansour',role:'Doctor (ER-A)',action:'Sent exam request — Chest X-ray · Urgency: Critical',patient:'Karim Bensalem',ip:'192.168.1.30',type:'exam'},
  {time:'09:18',who:'Dr. Reda Mansour',role:'Doctor (ER-A)',action:'Opened consultation',patient:'Karim Bensalem',ip:'192.168.1.30',type:'consult'},
  {time:'09:12',who:'Sarah Benali',role:'Secretary',action:'Forwarded to Office ER-A',patient:'Karim Bensalem',ip:'192.168.1.42',type:'assign'},
  {time:'09:08',who:'Sarah Benali',role:'Secretary',action:'Admitted patient — Triage: Critical',patient:'Karim Bensalem',ip:'192.168.1.42',type:'admit'},
  {time:'09:02',who:'Dr. Reda Mansour',role:'Doctor (ER-A)',action:'Consultation completed',patient:'Omar Cherif',ip:'192.168.1.30',type:'status'},
  {time:'08:50',who:'Dr. Reda Mansour',role:'Doctor (ER-A)',action:'Opened consultation',patient:'Omar Cherif',ip:'192.168.1.30',type:'consult'},
  {time:'08:44',who:'Sarah Benali',role:'Secretary',action:'Forwarded to Office ER-A',patient:'Omar Cherif',ip:'192.168.1.42',type:'assign'},
  {time:'08:40',who:'Sarah Benali',role:'Secretary',action:'Admitted patient — Triage: Stable',patient:'Omar Cherif',ip:'192.168.1.42',type:'admit'},
  {time:'08:02',who:'Dr. Hassan Benmoussa',role:'Admin',action:'System login — session started',patient:'—',ip:'192.168.1.10',type:'auth'},
  {time:'07:55',who:'Dr. Reda Mansour',role:'Doctor',action:'Login — session started',patient:'—',ip:'192.168.1.30',type:'auth'},
  {time:'07:52',who:'Sarah Benali',role:'Secretary',action:'Login — session started',patient:'—',ip:'192.168.1.42',type:'auth'},
  {time:'07:48',who:'Dr. Mansouri Rachid',role:'Specialist (Cardiology)',action:'Login — session started',patient:'—',ip:'192.168.1.55',type:'auth'},
];

let SENT_MESSAGES = [
  {id:'m1',to:'All staff',type:'alert',text:'Maintenance window tonight 23:00–01:00. Please wrap up active consultations before that time.',time:'09:15',reads:3,total:5},
  {id:'m2',to:'Dr. Reda Mansour',type:'info',text:'Patient A-003 — family is requesting an update on the consultation status.',time:'10:02',reads:1,total:1},
];

/* ─── Current page state ─── */
let currentPage='overview';
let logFilter='all';
let logSearch='';
let staffSearch='';
let editingStaff=null;

/* ─── Sidebar nav ─── */
function navTo(page,el){
  document.querySelectorAll('.sb-item').forEach(i=>i.classList.remove('active'));
  el.classList.add('active');
  currentPage=page;
  renderPage();
}

/* ─── Render pages ─── */
function renderPage(){
  const main=document.getElementById('main-content');
  main.innerHTML='';
  if(currentPage==='overview')renderOverview(main);
  else if(currentPage==='staff')renderStaff(main);
  else if(currentPage==='presence')renderPresence(main);
  else if(currentPage==='log')renderLog(main);
  else if(currentPage==='messages')renderMessages(main);
}

/* ─── Overview ─── */
function renderOverview(main){
  const waiting=PATIENTS.filter(p=>p.status==='waiting').length;
  const inprog=PATIENTS.filter(p=>p.status==='in-consult'||p.status==='pending-specialist').length;
  const completed=PATIENTS.filter(p=>p.status==='completed').length;
  const onShift=STAFF.filter(s=>s.isActive).length;
  const crit=PATIENTS.filter(p=>p.triage==='critical').length;
  main.innerHTML=`
    <div class="page-title">Dashboard</div>
    <div class="page-sub">Hospital overview · ${new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-card-top">
          <div class="stat-icon" style="background:var(--blue-bg)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
          <span class="stat-trend">Today</span>
        </div>
        <div class="stat-val">${PATIENTS.length}</div>
        <div class="stat-label">Total patients</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-top">
          <div class="stat-icon" style="background:var(--urg-bg)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
        </div>
        <div class="stat-val">${waiting}</div>
        <div class="stat-label">Waiting</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-top">
          <div class="stat-icon" style="background:var(--purple-bg)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
        </div>
        <div class="stat-val">${inprog}</div>
        <div class="stat-label">In consultation</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-top">
          <div class="stat-icon" style="background:var(--stab-bg)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
        </div>
        <div class="stat-val">${completed}</div>
        <div class="stat-label">Completed</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-top">
          <div class="stat-icon" style="background:var(--crit-bg)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg></div>
        </div>
        <div class="stat-val">${crit}</div>
        <div class="stat-label">Critical cases</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-top">
          <div class="stat-icon" style="background:var(--stab-bg)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14"/><path d="M4.93 4.93a10 10 0 000 14.14"/></svg></div>
          <span class="stat-trend">${STAFF.filter(s=>s.isActive).length} / ${STAFF.length}</span>
        </div>
        <div class="stat-val">${onShift}</div>
        <div class="stat-label">Staff present</div>
      </div>
    </div>
    <!-- Patient table -->
    <div class="card">
      <div class="card-head">
        <div><div class="card-title">Active patients</div><div class="card-sub">All patients today — ${PATIENTS.length} total</div></div>
      </div>
      <table class="tbl">
        <thead><tr><th>Patient</th><th>Ticket</th><th>Triage</th><th>Status</th><th>Office</th><th>Admitted</th><th>Time</th></tr></thead>
        <tbody>${PATIENTS.map(p=>`<tr>
          <td style="font-weight:600">${p.name}</td>
          <td><span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text3)">${p.ticket}</span></td>
          <td><span class="role-badge ${p.triage==='critical'?'doctor':p.triage==='urgent'?'specialist':'secretary'}" style="background:${p.triage==='critical'?'var(--crit-bg)':p.triage==='urgent'?'var(--urg-bg)':'var(--stab-bg)'};color:${p.triage==='critical'?'var(--crit)':p.triage==='urgent'?'var(--urg)':'var(--stab)'};border-color:${p.triage==='critical'?'var(--crit-br)':p.triage==='urgent'?'var(--urg-br)':'var(--stab-br)'}">${p.triage.charAt(0).toUpperCase()+p.triage.slice(1)}</span></td>
          <td>${statusLabel(p.status)}</td>
          <td style="color:var(--text3);font-size:12px">${p.office}</td>
          <td style="color:var(--text3);font-size:12px">${p.admitted}</td>
          <td style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text3)">${p.time}</td>
        </tr>`).join('')}</tbody>
      </table>
    </div>
    <!-- Recent log preview -->
    <div class="card">
      <div class="card-head">
        <div><div class="card-title">Recent activity</div><div class="card-sub">Last 5 entries</div></div>
        <button class="btn-ghost" onclick="navTo('log',document.querySelector('[data-page=log]'))">View all</button>
      </div>
      ${FULL_LOG.slice(0,5).map(e=>`<div class="log-entry">
        <div class="log-type-dot" style="background:${logTypeColor(e.type)}"></div>
        <div class="log-ts">${e.time}</div>
        <div class="log-who-wrap"><div class="log-who-name">${e.who}</div><div class="log-who-role">${e.role}</div></div>
        <div class="log-action">${e.action}</div>
        <div class="log-patient">${e.patient}</div>
      </div>`).join('')}
    </div>`;
}

/* ─── Staff ─── */
function renderStaff(main){
  main.innerHTML=`
    <div class="page-title">Staff</div>
    <div class="page-sub">Manage accounts, credentials, and access — admin only</div>
    <div class="card">
      <div class="card-head">
        <div><div class="card-title">All staff members</div><div class="card-sub">${STAFF.length} accounts</div></div>
        <div class="card-actions">
          <div class="filter-wrap" style="min-width:200px">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position:absolute;left:9px;top:50%;transform:translateY(-50%);color:var(--text3);pointer-events:none"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input class="filter-input" placeholder="Search staff…" oninput="filterStaff(this.value)" style="width:200px;height:32px;padding-left:32px">
          </div>
          <button class="btn-primary" onclick="openStaffModal(null,'add')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add staff
          </button>
        </div>
      </div>
      <table class="tbl" id="staff-tbl">
        <thead><tr><th>Name</th><th>Staff ID</th><th>Role</th><th>Office / Specialty</th><th>Status</th><th>Last seen</th><th>Actions</th></tr></thead>
        <tbody id="staff-tbody">${renderStaffRows(STAFF)}</tbody>
      </table>
    </div>`;
}

function renderStaffRows(list){
  return list.map(s=>`<tr>
    <td><span style="font-weight:600">${s.name}</span></td>
    <td><span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text3)">${s.sid}</span></td>
    <td><span class="role-badge ${s.role}">${s.role.charAt(0).toUpperCase()+s.role.slice(1)}</span></td>
    <td style="color:var(--text2);font-size:12.5px">${s.office}</td>
    <td><span class="status-dot ${s.isActive?'on':'off'}"></span>${s.isActive?'<span style="font-size:12px;color:#059669;font-weight:600">Logged in</span>':'<span style="font-size:12px;color:var(--text3)">Offline</span>'}</td>
    <td style="font-size:12px;color:var(--text3)">${s.lastSeen}</td>
    <td>
      <div style="display:flex;gap:5px;align-items:center">
        <button class="icon-action view" title="View info" onclick="openStaffModal('${s.id}','view')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button class="icon-action edit" title="Edit" onclick="openStaffModal('${s.id}','edit')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="icon-action del" title="Delete" onclick="deleteStaff('${s.id}')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </div>
    </td>
  </tr>`).join('');
}

function deleteStaff(sid){
  const s=STAFF.find(x=>x.id===sid);if(!s)return;
  if(!confirm(`Delete ${s.name} (${s.sid})?\nThis cannot be undone.`))return;
  const idx=STAFF.findIndex(x=>x.id===sid);
  if(idx>-1)STAFF.splice(idx,1);
  if(currentPage==='staff')renderPage();
}

function filterStaff(q){
  const list=q?STAFF.filter(s=>s.name.toLowerCase().includes(q.toLowerCase())||s.sid.toLowerCase().includes(q.toLowerCase())):STAFF;
  const tbody=document.getElementById('staff-tbody');
  if(tbody)tbody.innerHTML=renderStaffRows(list);
}

function openStaffModal(sid,mode){
  editingStaff=sid?STAFF.find(s=>s.id===sid):null;
  const isView=mode==='view';
  const isEdit=mode==='edit';
  const isAdd=mode==='add'||!sid;
  document.getElementById('sm-title').textContent=isView?'Staff info':isEdit?'Edit staff member':'Add staff member';
  /* toggle readonly */
  ['sm-name','sm-sid','sm-office','sm-pw','sm-pw2','sm-pin'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.disabled=isView;
  });
  const roleEl=document.getElementById('sm-role');if(roleEl)roleEl.disabled=isView;
  /* show/hide pw fields (only for add) */
  document.getElementById('sm-pw-wrap').style.display=isView?'none':'';
  document.getElementById('sm-pw2-wrap').style.display=isView&&isAdd?'none':isView?'none':'';
  document.getElementById('sm-cred-divider').style.display=isView?'none':'';
  if(editingStaff){
    document.getElementById('sm-name').value=editingStaff.name;
    document.getElementById('sm-sid').value=editingStaff.sid;
    document.getElementById('sm-role').value=editingStaff.role;
    document.getElementById('sm-office').value=editingStaff.office;
    document.getElementById('sm-pin').value='';
    document.getElementById('sm-pw').value='';
    document.getElementById('sm-pw2').value='';
  } else {
    ['sm-name','sm-sid','sm-office','sm-pw','sm-pw2','sm-pin'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  }
  /* footer buttons */
  const foot=document.querySelector('#staff-modal .modal-foot');
  if(isView){
    foot.innerHTML=`<button class="btn-ghost" onclick="closeStaffModal()">Close</button>`;
  } else {
    foot.innerHTML=`<button class="btn-ghost" onclick="closeStaffModal()">Cancel</button><button class="btn-primary" onclick="saveStaff()">Save</button>`;
  }
  document.getElementById('staff-modal').classList.add('show');
}

function closeStaffModal(){document.getElementById('staff-modal').classList.remove('show');}

function saveStaff(){
  const name=document.getElementById('sm-name').value.trim();
  const sid=document.getElementById('sm-sid').value.trim();
  if(!name||!sid){alert('Name and Staff ID are required.');return;}
  if(editingStaff){
    editingStaff.name=name;editingStaff.sid=sid;
    editingStaff.role=document.getElementById('sm-role').value;
    editingStaff.office=document.getElementById('sm-office').value;
  } else {
    STAFF.push({id:'s'+Date.now(),name,sid,role:document.getElementById('sm-role').value,office:document.getElementById('sm-office').value||'—',isActive:false,lastSeen:'Never',color:'#6B7280',abbr:name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()});
  }
  closeStaffModal();
  if(currentPage==='staff')renderPage();
}

/* ─── Presence ─── */
function renderPresence(main){
  const on=STAFF.filter(s=>s.isActive);
  const off=STAFF.filter(s=>!s.isActive);
  main.innerHTML=`
    <div class="page-title">Staff presence</div>
    <div class="page-sub">Who is currently logged in · ${on.length} present, ${off.length} offline</div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-head"><div class="card-title">Currently logged in</div><div class="card-sub">${on.length} staff members active</div></div>
      <div class="presence-grid">
        ${on.map(s=>`<div class="pres-card active">
          <div class="pres-avatar" style="background:${s.color}">${s.abbr}</div>
          <div class="pres-info"><div class="pres-name">${s.name}</div><div class="pres-meta">${s.role.charAt(0).toUpperCase()+s.role.slice(1)} · ${s.office}</div><div class="pres-meta" style="color:#059669;font-weight:600">Active · ${s.lastSeen}</div></div>
          <div class="pres-dot on"></div>
        </div>`).join('')}
        ${on.length===0?'<div style="padding:20px;color:var(--text3);font-size:13px">No staff currently logged in</div>':''}
      </div>
    </div>
    <div class="card">
      <div class="card-head"><div class="card-title">Offline</div><div class="card-sub">${off.length} not logged in</div></div>
      <div class="presence-grid">
        ${off.map(s=>`<div class="pres-card inactive">
          <div class="pres-avatar" style="background:#9CA3AF">${s.abbr}</div>
          <div class="pres-info"><div class="pres-name">${s.name}</div><div class="pres-meta">${s.role.charAt(0).toUpperCase()+s.role.slice(1)} · ${s.office}</div><div class="pres-meta">Last seen: ${s.lastSeen}</div></div>
          <div class="pres-dot off"></div>
        </div>`).join('')}
      </div>
    </div>`;
}

/* ─── Activity log ─── */
const LOG_COLORS={admit:'#2563EB',assign:'#D97706',consult:'#7C3AED',exam:'#0891B2',validate:'#059669',upload:'#10B981',status:'#6B7280',auth:'#9CA3AF',shift:'#6B7280'};
function logTypeColor(t){return LOG_COLORS[t]||'#9CA3AF';}

function renderLog(main){
  const filters=['All','Admit','Consult','Exam','Validate','Auth','Shift'];
  main.innerHTML=`
    <div class="page-title">Activity log</div>
    <div class="page-sub">Full audit trail · ${FULL_LOG.length} entries today</div>
    <div class="card">
      <div class="filter-bar">
        <div class="filter-wrap">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="filter-input" placeholder="Search by staff, patient, or action…" oninput="filterLog(this.value)" style="width:100%;height:32px;padding-left:32px">
        </div>
        <div class="filter-group">
          ${filters.map(f=>`<button class="ftag ${logFilter===f.toLowerCase()||(!logFilter&&f==='All')?'on':''}" onclick="setLogFilter('${f.toLowerCase()}',this)">${f}</button>`).join('')}
        </div>
      </div>
      <div id="log-entries">
        ${renderLogEntries(FULL_LOG)}
      </div>
    </div>`;
}

function renderLogEntries(entries){
  if(!entries.length)return'<div style="padding:20px 18px;color:var(--text3);font-size:13px">No entries match your filter.</div>';
  return entries.map(e=>`<div class="log-entry">
    <div class="log-type-dot" style="background:${logTypeColor(e.type)}"></div>
    <div class="log-ts">${e.time}</div>
    <div class="log-who-wrap"><div class="log-who-name">${e.who}</div><div class="log-who-role">${e.role}</div></div>
    <div class="log-action">${e.action}<br><span style="font-size:11px;color:var(--text3);font-family:'JetBrains Mono',monospace">IP: ${e.ip}</span></div>
    <div class="log-patient">${e.patient}</div>
  </div>`).join('');
}

function setLogFilter(f,btn){
  document.querySelectorAll('.ftag').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  logFilter=f==='all'?'':f;
  applyLogFilter();
}

function filterLog(q){logSearch=q;applyLogFilter();}

function applyLogFilter(){
  let entries=FULL_LOG;
  if(logFilter)entries=entries.filter(e=>e.type===logFilter);
  if(logSearch){const q=logSearch.toLowerCase();entries=entries.filter(e=>e.who.toLowerCase().includes(q)||e.action.toLowerCase().includes(q)||e.patient.toLowerCase().includes(q));}
  const el=document.getElementById('log-entries');if(el)el.innerHTML=renderLogEntries(entries);
}

/* ─── Messages ─── */
let msgMode='group';
function renderMessages(main){
  const groupOpts=['All staff','Doctors only','Secretaries only','Specialists only','Admin only'];
  const indivOpts=STAFF.map(s=>s.name);
  main.innerHTML=`
    <div class="page-title">Messages & Alerts</div>
    <div class="page-sub">Send to a group or a specific staff member</div>
    <div class="card">
      <div class="card-head"><div class="card-title">Compose message</div></div>
      <div style="padding:16px 18px">
        <div class="msg-compose">
          <div class="msg-mode-row">
            <button class="msg-mode-btn ${msgMode==='group'?'on':''}" id="mmb-group" onclick="setMsgMode('group')">👥 By group</button>
            <button class="msg-mode-btn ${msgMode==='individual'?'on':''}" id="mmb-indiv" onclick="setMsgMode('individual')">👤 Individual</button>
          </div>
          <div class="msg-row">
            <div class="field-wrap" style="margin:0">
              <label class="field-label">Send to</label>
              <select class="field-select" id="msg-to">
                ${msgMode==='group'?groupOpts.map(o=>`<option>${o}</option>`).join(''):indivOpts.map(o=>`<option>${o}</option>`).join('')}
              </select>
            </div>
            <div class="field-wrap" style="margin:0">
              <label class="field-label">Message type</label>
              <div class="msg-type-row">
                <button class="msg-type-btn on alert" id="msg-type-alert" onclick="setMsgType('alert')">⚠ Alert</button>
                <button class="msg-type-btn info" id="msg-type-info" onclick="setMsgType('info')">ℹ Info</button>
              </div>
            </div>
          </div>
          <div class="msg-row full" style="margin:0">
            <div class="field-wrap" style="margin:0">
              <label class="field-label">Message</label>
              <textarea class="msg-textarea" id="msg-text" placeholder="Type your message here…"></textarea>
            </div>
          </div>
          <div class="msg-actions">
            <span style="font-size:11.5px;color:var(--text3)" id="msg-chars">0 / 240</span>
            <button class="btn-ghost" onclick="clearCompose()">Clear</button>
            <button class="btn-primary" onclick="sendMessage()">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Send message
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-head"><div class="card-title">Sent messages</div><div class="card-sub">${SENT_MESSAGES.length} messages</div></div>
      <div id="sent-list">${renderSentMessages()}</div>
    </div>`;
  document.getElementById('msg-text').addEventListener('input',function(){document.getElementById('msg-chars').textContent=this.value.length+' / 240';});
}

function setMsgMode(mode){
  msgMode=mode;
  renderMessages(document.getElementById('main-content'));
}

/* ─── Admin notifications ─── */
let ADMIN_NOTIFS=[
  {id:'an1',from:'ER System',msg:'Patient A-003 escalated — family requesting update on consultation.',time:'10:02',type:'alert',read:false},
  {id:'an2',from:'System',msg:'Ambulance incoming — Code Black ETA 8 min. Déchocage notified.',time:'09:48',type:'info',read:false},
];

function renderNotif(){
  const dot=document.getElementById('notif-dot');
  const unread=ADMIN_NOTIFS.filter(m=>!m.read);
  if(unread.length){dot.style.minWidth='16px';dot.style.height='16px';dot.style.padding='0 4px';dot.textContent=unread.length;}
  else{dot.style.minWidth='8px';dot.style.height='8px';dot.style.padding='0';dot.textContent='';}
  const list=document.getElementById('notif-dlist');if(!list)return;
  list.innerHTML='';
  if(!ADMIN_NOTIFS.length){list.innerHTML='<div style="padding:20px 14px;text-align:center;font-size:12px;color:var(--text3)">No alerts</div>';return;}
  ADMIN_NOTIFS.forEach(m=>{
    const item=document.createElement('div');
    item.style.cssText=`padding:10px 14px;border-bottom:1px solid var(--border);display:flex;gap:8px;cursor:pointer;background:${m.read?'':'#FFFBEB'}`;
    item.innerHTML=`<div style="width:22px;height:22px;border-radius:50%;background:${m.type==='alert'?'var(--crit-bg)':'var(--blue-bg)'};display:flex;align-items:center;justify-content:center;flex-shrink:0"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${m.type==='alert'?'#DC2626':'#2563EB'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${m.type==='alert'?'<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>':'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}</svg></div>
    <div style="flex:1;min-width:0"><div style="font-size:11px;font-weight:600;color:var(--text2)">${m.from}</div><div style="font-size:12px;color:var(--text);line-height:1.4;margin-top:1px">${m.msg}</div><div style="font-size:10px;color:var(--text3);margin-top:2px">${m.time}</div></div>`;
    item.onclick=()=>{m.read=true;renderNotif();};
    list.appendChild(item);
  });
}
function toggleNotif(){
  const dd=document.getElementById('notif-dropdown');
  dd.style.display=dd.style.display==='block'?'none':'block';
}
function clearNotifs(e){e.stopPropagation();ADMIN_NOTIFS=[];renderNotif();}
document.addEventListener('click',e=>{
  const wrap=document.getElementById('notif-wrap');
  const dd=document.getElementById('notif-dropdown');
  if(wrap&&dd&&!wrap.parentElement.contains(e.target))dd.style.display='none';
});

let msgType='alert';
function setMsgType(t){
  msgType=t;
  const a=document.getElementById('msg-type-alert');const i=document.getElementById('msg-type-info');
  if(!a||!i)return;
  a.classList.toggle('on',t==='alert');a.classList.toggle('alert',t==='alert');
  i.classList.toggle('on',t==='info');i.classList.toggle('info',t==='info');
}

function renderSentMessages(){
  if(!SENT_MESSAGES.length)return'<div style="padding:20px 18px;color:var(--text3);font-size:13px">No messages sent yet</div>';
  return SENT_MESSAGES.map(m=>`<div class="sent-msg">
    <div class="sent-msg-icon ${m.type}">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="${m.type==='alert'?'#DC2626':'#2563EB'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${m.type==='alert'?'<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>':'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}</svg>
    </div>
    <div class="sent-msg-body">
      <div class="sent-msg-meta">To: <strong>${m.to}</strong> · ${m.time}</div>
      <div class="sent-msg-text">${m.text}</div>
      <div class="sent-msg-reads">Read by ${m.reads} of ${m.total} recipients</div>
    </div>
  </div>`).join('');
}

function clearCompose(){const t=document.getElementById('msg-text');if(t){t.value='';document.getElementById('msg-chars').textContent='0 / 240';}}

function sendMessage(){
  const text=document.getElementById('msg-text').value.trim();
  const to=document.getElementById('msg-to').value;
  if(!text){document.getElementById('msg-text').style.borderColor='var(--crit)';return;}
  const now=new Date();
  const time=now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
  const total=msgMode==='individual'?1:to==='All staff'?STAFF.length:STAFF.filter(s=>s.role===to.split(' ')[0].toLowerCase()).length||STAFF.length;
  SENT_MESSAGES.unshift({id:'m'+Date.now(),to,type:msgType,text,time,reads:0,total});
  clearCompose();
  const list=document.getElementById('sent-list');
  if(list)list.innerHTML=renderSentMessages();
  const badge=document.querySelector('[data-page=messages] .sb-badge');
  if(badge)badge.textContent=SENT_MESSAGES.length;
}

/* ─── Clock ─── */
function tick(){
  const now=new Date();
  const d=document.getElementById('sb-date');const t=document.getElementById('sb-time');
  if(d)d.textContent=now.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});
  if(t)t.textContent=now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
}
setInterval(tick,1000);tick();

/* ─── Init ─── */
renderPage();
renderNotif();
function statusLabel(s){
  const map={'waiting':'<span style="font-size:12px;color:var(--blue);font-weight:500">Waiting</span>','in-consult':'<span style="font-size:12px;color:var(--urg);font-weight:500">In consult</span>','pending-specialist':'<span style="font-size:12px;color:var(--purple);font-weight:500">Pending exam</span>','passed':'<span style="font-size:12px;color:var(--crit);font-weight:500">Did not attend</span>','completed':'<span style="font-size:12px;color:var(--stab);font-weight:500">Completed</span>'};
  return map[s]||s;
}