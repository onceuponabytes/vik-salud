const CURRENT_ESTABLISHMENT = "CESFAM Norte";

const DATA = structuredClone(window.VIK_DEMO);

const TITLES = {
  inicio:["Mi jornada clínica","Resumen del día y acceso rápido a pacientes."],
  pacientes:["Pacientes","Consulta fichas longitudinales y registra nuevas atenciones."],
  agenda:["Agenda","Calendario de atenciones programadas."],
  documentos:["Documentos","Filtra documentos por paciente, tipo o búsqueda."]
};

let selectedPatient = null;
let agendaMode='month',editingAppointmentId=null,activeAppointmentId=null,reviewedAttention=null;
const attentionDrafts=new Map();
const TODAY=calendarIso(new Date());
let calendarCursor = new Date(new Date().getFullYear(),new Date().getMonth(),1);
let selectedCalendarDate = TODAY;

const $ = id => document.getElementById(id);
const esc = value => String(value ?? "").replace(/[&<>"']/g, s => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[s]));

function patientById(id){ return DATA.patients.find(p=>p.id===id); }
const SPECIALTIES={
  general:{label:"Medicina general / familiar",icon:"🩺"},
  cardiology:{label:"Cardiología",icon:"❤️"},
  pediatrics:{label:"Pediatría",icon:"👶"},
  neurology:{label:"Neurología / salud mental",icon:"🧠"},
  orthopedics:{label:"Traumatología / ortopedia",icon:"🦴"},
  dentistry:{label:"Odontología",icon:"🦷"},
  laboratory:{label:"Laboratorio / analíticas",icon:"🔬"},
  pharmacy:{label:"Farmacia / tratamientos",icon:"💊"}
};
function appointmentSpecialty(appointment){
  return SPECIALTIES[appointment.specialty]||{label:"Especialidad no informada",icon:"—"};
}
function specialtyBadge(appointment,compact=false){
  const specialty=appointmentSpecialty(appointment);
  return `<span class="specialty-badge" title="${esc(specialty.label)}"><span class="specialty-symbol" aria-hidden="true">${specialty.icon}</span>${compact?"":`<span>${esc(specialty.label)}</span>`}</span>`;
}
function formatDate(iso){
  if(!iso) return "No informado";
  const [y,m,d] = iso.slice(0,10).split("-").map(Number);
  return new Intl.DateTimeFormat("es-CL",{day:"2-digit",month:"short",year:"numeric"}).format(new Date(y,m-1,d));
}
function formatDateTime(iso){
  const dt=new Date(iso);
  return new Intl.DateTimeFormat("es-CL",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}).format(dt);
}
function normalize(v){return String(v??"").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu,"");}

function showToast(message){
  const toast=$("toast");
  toast.textContent=message;
  toast.classList.remove("hidden");
  clearTimeout(showToast.timer);
  showToast.timer=setTimeout(()=>toast.classList.add("hidden"),2600);
}

function switchView(view){
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n=>n.classList.remove("active"));
  $(`view-${view}`).classList.add("active");
  document.querySelector(`.nav-item[data-view="${view}"]`).classList.add("active");
  $("pageTitle").textContent=TITLES[view][0];
  $("pageSubtitle").textContent=TITLES[view][1];
  $("pageTitle").focus({preventScroll:true});
  document.querySelectorAll(".nav-item").forEach(n=>{
    if(n.dataset.view===view)n.setAttribute("aria-current","page");
    else n.removeAttribute("aria-current");
  });
}

function renderHome(){
  const today=DATA.appointments.filter(a=>a.date===TODAY).sort((a,b)=>a.time.localeCompare(b.time));
  $("todayCount").textContent=today.length;
  $("patientCount").textContent=DATA.patients.length;
  $("alertCount").textContent=DATA.patients.filter(p=>p.alert).length;
  const next=DATA.appointments.filter(a=>a.status==='pendiente'&&new Date(`${a.date}T${a.time}`)>=new Date()).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time))[0];
  $("nextPatient").innerHTML=next?`<div><p class="eyebrow">Próxima atención programada</p><h2>${esc(patientById(next.patientId).name)}</h2><p>${formatDate(next.date)} · ${esc(next.time)} · ${esc(next.reason)}</p><small>${esc(next.professional)} · ${esc(next.place)}</small></div><button class="primary-button open-record" data-id="${next.patientId}">Preparar atención →</button>`:'<div><p class="eyebrow">Tu jornada</p><h2>No hay próximas citas pendientes</h2><p>Consulta la agenda para organizar las siguientes atenciones.</p></div><button class="secondary-button" data-jump="agenda">Abrir agenda</button>';

  $("todayAppointments").innerHTML=today.map(a=>{
    const p=patientById(a.patientId);
    return `<div class="appointment-row">
      <div class="time">${esc(a.time)}</div>
      <div class="patient-badge">${esc(p.initials)}</div>
      <div class="row-info"><strong>${esc(p.name)}</strong>${specialtyBadge(a)}<span>${esc(a.reason||"Motivo no informado")}</span><span>${esc(a.place)} · ${esc(a.status)}</span></div>
      <button class="ghost-button open-record" data-id="${p.id}">Ver ficha</button>
    </div>`;
  }).join("")||'<div class="empty">No hay citas para hoy. Puedes programar una desde Agenda.</div>';

  $("safeMedAlerts").innerHTML=DATA.patients.filter(p=>p.alert).map(p=>`
    <div class="safemed-alert">
      <strong>${esc(p.name)}</strong>
      <p>Hay antecedentes que requieren revisión clínica antes de confirmar cambios de tratamiento.</p>
      <button class="open-record" data-id="${p.id}">Revisar ficha</button>
    </div>`).join("");
}

function renderPatients(){
  const q=normalize($("patientSearchInput").value);
  const filter=$("patientFilter").value;
  const list=DATA.patients.filter(p=>{
    const match=[p.name,p.rut,p.id].some(v=>normalize(v).includes(q));
    const f=filter==="all" || (filter==="cronico"&&p.chronic) || (filter==="alerta"&&p.alert);
    return match&&f;
  });
  $("patientCards").innerHTML=list.length?list.map(p=>`
    <article class="patient-card">
      <div class="patient-card-top">
        <div class="avatar">${esc(p.initials)}</div>
        <div><h3>${esc(p.name)}</h3><p>${esc(p.rut)} · ${esc(p.id)}</p></div>
      </div>
      <div class="tag-row">
        <span class="tag">${esc(p.blood||"Grupo no informado")}</span>
        ${p.chronic?'<span class="tag chronic">Crónico</span>':""}
        ${p.alert?'<span class="tag alert">Alerta SafeMed</span>':""}
      </div>
      <div class="patient-clinical-meta"><span>Condiciones registradas</span><strong>${esc(p.conditions.map(c=>c.name).join(" · ")||"Sin condiciones registradas")}</strong><span>Continuidad de atención</span><strong>${new Set(p.attentions.map(a=>a.place)).size} establecimiento(s) · ${p.attentions.length} atención(es)</strong></div>
      <div class="card-actions"><button class="ghost-button open-record" data-id="${p.id}">Abrir ficha</button></div>
    </article>`).join(""):'<div class="empty">No hay pacientes que coincidan con la búsqueda.</div>';
}

function populateDocumentPatients(){
  $("documentPatientFilter").innerHTML='<option value="all">Todos los pacientes</option>'+
    DATA.patients.map(p=>`<option value="${p.id}">${esc(p.name)} · ${esc(p.rut)}</option>`).join("");
}

function renderDocuments(){
  const q=normalize($("documentSearch").value);
  const pid=$("documentPatientFilter").value;
  const type=$("documentTypeFilter").value;
  const place=$("documentPlaceFilter").value,from=$("documentFrom").value,to=$("documentTo").value;
  $("documentCategories").innerHTML=VIKDocuments.categories(DATA.documents.filter(d=>pid==='all'||d.patientId===pid),type);
  if(from&&to&&from>to){$("documentsSummary").textContent='Desde debe ser anterior o igual a Hasta.';$("documentsTable").innerHTML='<div class="empty">Revisa el rango de fechas.</div>';return;}
  const docs=DATA.documents.filter(d=>{
    const p=patientById(d.patientId);
    return (pid==="all"||d.patientId===pid) &&
      (type==="all"||d.type===type) && (place==='all'||d.place===place)&&(!from||d.date>=from)&&(!to||d.date<=to)&&
      [d.name,d.type,d.place,p.name,p.rut].some(v=>normalize(v).includes(q));
  });
  $("documentsSummary").textContent=`${docs.length} documento(s) encontrados`;
  $("documentsTable").innerHTML=docs.sort((a,b)=>b.date.localeCompare(a.date)).map(d=>VIKDocuments.card(d,'data-document',patientById(d.patientId).name)).join('')||'<div class="empty">No hay documentos para estos filtros. Puedes limpiar la búsqueda.</div>';
}

function calendarIso(date){
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
function filteredAppointments(){
  return DATA.appointments.filter(a=>($("agendaSpecialty").value==="all"||a.specialty===$("agendaSpecialty").value)&&($("agendaStatus").value==="all"||a.status===$("agendaStatus").value)&&($("agendaProfessional").value==='all'||a.professional===$("agendaProfessional").value));
}
function renderCalendar(){
  const year=calendarCursor.getFullYear(), month=calendarCursor.getMonth();
  const filtered=filteredAppointments();
  const monthly=filtered.filter(a=>a.date.startsWith(`${year}-${String(month+1).padStart(2,"0")}`));
  $("agendaMetrics").innerHTML=[["Citas del mes",monthly.length],["Pendientes",monthly.filter(a=>a.status==="pendiente").length],["Finalizadas",monthly.filter(a=>a.status==="finalizada").length]].map(([label,value])=>`<div><span>${label}</span><strong>${value}</strong></div>`).join("");
  $("calendarTitle").textContent=new Intl.DateTimeFormat("es-CL",{month:"long",year:"numeric"}).format(new Date(year,month,1));
  const first=new Date(year,month,1);
  const mondayOffset=(first.getDay()+6)%7;
  const start=new Date(year,month,1-mondayOffset);
  const cells=[];
  for(let i=0;i<42;i++){
    const d=new Date(start); d.setDate(start.getDate()+i);
    const iso=calendarIso(d);
    const apps=filtered.filter(a=>a.date===iso).sort((a,b)=>a.time.localeCompare(b.time));
    const muted=d.getMonth()!==month;
    cells.push(`<button class="calendar-day ${muted?"muted":""} ${iso===selectedCalendarDate?"selected":""} ${iso===TODAY?"today":""}" data-date="${iso}" aria-pressed="${iso===selectedCalendarDate}" aria-label="${esc(formatDate(iso))}: ${apps.length} citas${apps.length?", "+esc(apps.map(a=>`${a.time} ${appointmentSpecialty(a).label}`).join(", ")):""}">
      <span class="day-number">${d.getDate()}</span>
      <span class="calendar-appointments">${apps.map(a=>`<span class="calendar-appointment" title="${esc(a.time+" · "+appointmentSpecialty(a).label+" · "+a.reason)}">${specialtyBadge(a,true)}<span class="calendar-time">${esc(a.time)}</span></span>`).join("")}</span>
    </button>`);
  }
  $("calendarGrid").innerHTML=cells.join("");
  renderSelectedDay();
  renderSchedule();
}
function renderSelectedDay(){
  const [y,m,d]=selectedCalendarDate.split("-").map(Number);
  $("selectedDateTitle").textContent=new Intl.DateTimeFormat("es-CL",{day:"numeric",month:"long"}).format(new Date(y,m-1,d));
  const apps=filteredAppointments().filter(a=>a.date===selectedCalendarDate).sort((a,b)=>a.time.localeCompare(b.time));
  $("selectedDayAppointments").innerHTML=apps.length?apps.map(a=>{
    const p=patientById(a.patientId);
    return `<div class="day-appointment">
      <strong>${esc(a.time)} · ${esc(p.name)}</strong>
      ${specialtyBadge(a)}
      <p class="appointment-reason">${esc(a.reason||"Motivo no informado")}</p>
      <span>${esc(a.place)} · ${esc(a.status)}</span>
      <span>${esc(a.professional||'Por asignar')} · ${a.duration||30} min</span>
      <span class="appointment-state ${a.status==="finalizada"?"complete":""}">${a.status==="finalizada"?"Finalizada":"Pendiente de atención"}</span>
      <button class="ghost-button open-record" data-id="${p.id}" style="margin-top:9px">Abrir ficha</button>
      ${a.status==='pendiente'?`<div class="schedule-actions"><button class="primary-button" data-start-appointment="${a.id}">Iniciar atención</button><button class="secondary-button" data-edit-appointment="${a.id}">Reprogramar</button></div>`:''}
    </div>`;
  }).join(""):'<div class="empty"><strong>Jornada despejada</strong><p>No hay citas que coincidan con este día y los filtros seleccionados.</p></div>';
}

function clinicalItems(items, cls=""){
  return items.length?items.map(x=>`<div class="clinical-item ${cls}"><strong>${esc(x.name)}</strong>${x.detail?`<div>${esc(x.detail)}</div>`:""}</div>`).join(""):'<div class="subtle">Sin registros activos.</div>';
}
function simpleRows(items){
  return items.length?`<div class="simple-list">${items.map(x=>`<div class="simple-row"><strong>${esc(x.name||x.title)}</strong><span>${esc(x.detail)}</span></div>`).join("")}</div>`:'<div class="subtle">Sin antecedentes registrados.</div>';
}

function openRecord(patient){
  if(activeAppointmentId&&DATA.appointments.find(a=>a.id===activeAppointmentId)?.patientId!==patient.id)activeAppointmentId=null;
  selectedPatient=patient;
  $("recordInitials").textContent=patient.initials;
  $("recordName").textContent=patient.name;
  $("recordMeta").textContent=`${patient.rut} · ${patient.id} · ${patient.healthSystem}`;
  $("clinicalStrip").innerHTML=`<div class="critical-strip-item blood"><span>Grupo</span><strong>${esc(patient.blood||'No informado')}</strong></div><div class="critical-strip-item alert"><span>Alergias</span><strong>${esc(patient.allergies.map(a=>a.name).join(', ')||'Sin registros')}</strong></div><div class="critical-strip-item"><span>Condiciones activas</span><strong>${esc(patient.conditions.map(c=>c.name).join(' · ')||'Sin registros')}</strong></div><div class="critical-strip-item"><span>Medicamentos</span><strong>${esc(patient.medications.map(m=>m.name).join(' · ')||'Sin registros')}</strong></div>`;
  const permissions=(DATA.permissions||[]).filter(g=>g.patientId===patient.id&&g.name==='Dra. I. Fernández'&&!g.revoked&&(!g.expires||new Date(g.expires)>new Date()));
  $("recordAlerts").dataset.permission=permissions.length?'active':'unrecorded';
  $("recordAlerts").innerHTML=patient.alert?'<div class="record-warning safemed-focus"><strong>SafeMed:</strong> revisar antecedentes antes de cambiar tratamiento.</div>':"";
  $("recordAlerts").innerHTML+=`<details class="permission-summary"><summary>Permisos de acceso</summary><p>${permissions.length?`Permiso simulado: ${esc(permissions[0].scope)} · ${permissions[0].expires?'hasta '+formatDateTime(permissions[0].expires):'hasta revocación'}`:'No hay una autorización registrada para este profesional en los datos de demostración.'}</p><small>La demo no aplica control de acceso real.</small></details>`;
  $("addAttentionBtn").textContent=attentionDrafts.has(patient.id)?'Continuar borrador':'+ Nueva atención';

  const identity=[
    ["RUT",patient.rut],["Fecha de nacimiento",formatDate(patient.birthDate)],["Sexo",patient.sex],
    ["Nacionalidad",patient.nationality],["Sistema de salud",patient.healthSystem],["Ocupación",patient.occupation],
    ["Teléfono",patient.phone],["Correo",patient.email]
  ];
  $("recordIdentity").innerHTML=identity.map(([k,v])=>`<div class="detail-item"><span>${esc(k)}</span><strong>${esc(v||"No informado")}</strong></div>`).join("");

  const critical=[
    ["Grupo sanguíneo",patient.blood||"No informado"],
    ["Alergias",patient.allergies.length?patient.allergies.map(a=>a.name).join(", "):"Sin alergias registradas"],
    ["Medicamentos",patient.medications.length?patient.medications.map(m=>m.name).join(", "):"Sin medicamentos activos"],
    ["Condiciones",patient.conditions.length?patient.conditions.map(c=>c.name).join(", "):"Sin condiciones activas"]
  ];
  $("recordCritical").innerHTML=critical.map(([k,v])=>`<div class="critical-item"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join("");
  const criticalBox=$("recordCritical");
  const clinicalHeader=document.querySelector("#record-resumen .record-card:has(.clinical-columns) .card-title-row");
  const formerCriticalCard=criticalBox.closest(".record-card");
  if(clinicalHeader&&!clinicalHeader.contains(criticalBox)){
    clinicalHeader.appendChild(criticalBox);
    if(formerCriticalCard)formerCriticalCard.classList.add("absorbed-critical-card");
  }

  $("recordAllergies").innerHTML=patient.allergies.length?patient.allergies.map(a=>`<div class="clinical-item alert"><strong>${esc(a.name)}</strong><div>${esc(a.detail||"")}</div></div>`).join(""):'<div class="subtle">Sin alergias registradas.</div>';
  $("recordConditions").innerHTML=patient.conditions.length?patient.conditions.map(c=>`<div class="clinical-item mint"><strong>${esc(c.name)}</strong><div>${esc(c.status)} · desde ${esc(c.since)}</div></div>`).join(""):'<div class="subtle">Sin condiciones activas registradas.</div>';
  $("recordMedications").innerHTML=patient.medications.length?patient.medications.map(m=>`<div class="clinical-item"><strong>${esc(m.name)}</strong><div>${esc(m.dose)} · ${esc(m.frequency)}</div></div>`).join(""):'<div class="subtle">Sin medicamentos activos.</div>';

  const providers=[...new Set(patient.attentions.map(a=>a.place))];
  $("recordProviders").innerHTML=providers.map(place=>{
    const count=patient.attentions.filter(a=>a.place===place).length;
    return `<div class="provider-chip"><strong>${esc(place)}</strong><span>${count} atención(es)</span></div>`;
  }).join("");

  const placeSelect=$("attentionPlaceFilter");
  placeSelect.innerHTML='<option value="all">Todos los establecimientos</option>'+providers.map(p=>`<option>${esc(p)}</option>`).join("");
  placeSelect.value="all";

  $("recordPersonalHistory").innerHTML=simpleRows(patient.personalHistory);
  $("recordFamilyHistory").innerHTML=simpleRows(patient.familyHistory);
  $("recordObservations").innerHTML=simpleRows(patient.observations);

  $("recordDecisions").innerHTML=simpleRows([
    {title:"Transfusiones",detail:patient.decisions.transfusion},
    {title:"Reanimación",detail:patient.decisions.resuscitation},
    {title:"Donación de órganos",detail:patient.decisions.organDonation}
  ]);
  $("recordPreferences").innerHTML=simpleRows([
    {title:"Religión / convicción",detail:patient.religion||"No informada"},
    {title:"Pertenencia étnica o cultural",detail:patient.ethnicity||"No informada"},
    ...patient.preferences
  ]);
  $("recordConsents").innerHTML=patient.consents.length?patient.consents.map(c=>`<div class="simple-row"><strong>${esc(c.type)}</strong><span>${formatDate(c.date)} · ${esc(c.place)} · ${esc(c.detail)}</span></div>`).join(""):'<div class="subtle">Sin consentimientos o rechazos registrados en esta demo.</div>';

  renderRecordTimeline();
  renderRecordDocuments();

  document.querySelectorAll(".record-tab").forEach(t=>t.classList.remove("active"));
  document.querySelector('.record-tab[data-tab="resumen"]').classList.add("active");
  document.querySelectorAll(".record-tab-panel").forEach(p=>p.classList.remove("active"));
  $("record-resumen").classList.add("active");
  $("recordOverlay").classList.remove("hidden");
  $("recordOverlay").scrollTop=0;
}

function renderRecordTimeline(){
  if(!selectedPatient)return;
  const filter=$("attentionPlaceFilter").value;
  const list=[...selectedPatient.attentions]
    .filter(a=>filter==="all"||a.place===filter)
    .sort((a,b)=>new Date(b.date)-new Date(a.date));
  $("recordTimeline").innerHTML=list.length?list.map(a=>`
    <article class="timeline-item">
      <div class="timeline-date">${formatDateTime(a.date)}</div>
      <div class="timeline-head"><h4>${esc(a.reason)}</h4><span class="timeline-place">${esc(a.place)} · ${esc(a.professional)}</span></div>
      <div class="timeline-section"><strong>Anamnesis / evolución</strong><p>${esc(a.anamnesis)}</p></div>
      <div class="timeline-section"><strong>Evaluación / diagnóstico</strong><p>${esc(a.assessment)}</p></div>
      <div class="timeline-section"><strong>Indicaciones / plan</strong><p>${esc(a.plan)}</p></div>
      <div class="record-linked-docs">${DATA.documents.filter(d=>d.patientId===selectedPatient.id&&d.attentionId===a.id).map(d=>`<button data-document="${d.id}">${esc(d.type)} · ${esc(d.name)}</button>`).join('')}</div>
    </article>`).join(""):'<div class="empty">No hay atenciones para este establecimiento.</div>';
}
function renderRecordDocuments(){
  if(!selectedPatient)return;
  const docs=DATA.documents.filter(d=>d.patientId===selectedPatient.id).sort((a,b)=>b.date.localeCompare(a.date));
  $("recordDocuments").innerHTML=docs.map(d=>VIKDocuments.card(d,'data-document',selectedPatient.name)).join('')||'<div class="empty">Este paciente no tiene documentos registrados.</div>';
}

function checkRut(rut){
  const n=normalize(rut).replace(/[.\-\s]/g,"");
  return DATA.patients.find(p=>normalize(p.rut).replace(/[.\-\s]/g,"")===n);
}

function openRegistration(){
  $("newPatientForm").reset();
  $("lookupRut").value="";
  $("lookupResult").innerHTML="";
  $("newPatientForm").classList.add("hidden");
  $("registerModal").classList.remove("hidden");
}

document.addEventListener("click",e=>{
  const nav=e.target.closest(".nav-item");
  if(nav){switchView(nav.dataset.view);return}
  const jump=e.target.closest("[data-jump]");
  if(jump){switchView(jump.dataset.jump);return}
  const open=e.target.closest(".open-record");
  if(open){openRecord(patientById(open.dataset.id));return}
  const day=e.target.closest(".calendar-day");
  if(day){selectedCalendarDate=day.dataset.date;renderCalendar();return}
  const doc=e.target.closest(".fake-doc");
  if(doc){const d=DATA.documents.find(x=>x.id===doc.dataset.doc);showToast(`Demo frontend: aquí se solicitaría "${d.name}" al bucket S3.`);return}
});

document.querySelectorAll(".record-tab").forEach(tab=>{
  tab.addEventListener("click",()=>{
    document.querySelectorAll(".record-tab").forEach(t=>t.classList.remove("active"));
    document.querySelectorAll(".record-tab-panel").forEach(p=>p.classList.remove("active"));
    tab.classList.add("active");
    $(`record-${tab.dataset.tab}`).classList.add("active");
  });
});

$("homeSearchForm").addEventListener("submit",e=>{
  e.preventDefault();
  const q=normalize($("homeSearchInput").value.trim());
  if(!q){$("homeSearchInput").focus();return;}
  const matches=DATA.patients.filter(p=>[p.name,p.rut,p.id].some(v=>normalize(v).includes(q)));
  if(matches.length===1)openRecord(matches[0]);
  else{
    $("patientSearchInput").value=$("homeSearchInput").value.trim();
    $("patientFilter").value="all";
    renderPatients();
    switchView("pacientes");
  }
});
$("patientSearchInput").addEventListener("input",renderPatients);
$("patientFilter").addEventListener("change",renderPatients);
$("documentSearch").addEventListener("input",renderDocuments);
$("documentPatientFilter").addEventListener("change",renderDocuments);
$("documentTypeFilter").addEventListener("change",renderDocuments);
$("attentionPlaceFilter").addEventListener("change",renderRecordTimeline);

$("prevMonth").addEventListener("click",()=>{calendarCursor=new Date(calendarCursor.getFullYear(),calendarCursor.getMonth()-1,1);renderCalendar()});
$("nextMonth").addEventListener("click",()=>{calendarCursor=new Date(calendarCursor.getFullYear(),calendarCursor.getMonth()+1,1);renderCalendar()});
$("closeRecord").addEventListener("click",()=>$("recordOverlay").classList.add("hidden"));
$("recordDocumentsBtn").addEventListener("click",()=>{
  if(!selectedPatient)return;
  $("recordOverlay").classList.add("hidden");
  switchView("documentos");
  $("documentPatientFilter").value=selectedPatient.id;
  renderDocuments();
});
$("notificationBtn").addEventListener("click",()=>{
  switchView("inicio");
  $("reviewPanel").scrollIntoView({block:"nearest"});
  $("reviewPanel").focus({preventScroll:true});
});

$("registerPatientBtn").addEventListener("click",openRegistration);
$("closeRegister").addEventListener("click",()=>$("registerModal").classList.add("hidden"));
$("lookupPatientForm").addEventListener("submit",e=>{
  e.preventDefault();
  const rut=$("lookupRut").value.trim();
  const found=checkRut(rut);
  if(!found&&!validRut(rut)){showToast("Ingresa un RUT válido, incluido su dígito verificador.");$("newPatientForm").classList.add("hidden");return;}
  if(found){
    $("lookupResult").innerHTML=`<div class="lookup-success"><strong>Paciente ya existe en VIK</strong>${esc(found.name)} · ${esc(found.rut)}. Tiene registros en ${[...new Set(found.attentions.map(a=>a.place))].map(esc).join(", ")}.<br><button class="ghost-button open-existing-from-register" data-id="${found.id}" style="margin-top:10px">Abrir ficha existente</button></div>`;
    $("newPatientForm").classList.add("hidden");
  }else{
    $("lookupResult").innerHTML='<div class="lookup-new"><strong>No encontramos ese RUT</strong>En un backend real, aquí recién habilitaríamos la creación de una nueva ficha.</div>';
    $("newPatientForm").classList.remove("hidden");
  }
});
document.addEventListener("click",e=>{
  const btn=e.target.closest(".open-existing-from-register");
  if(btn){
    $("registerModal").classList.add("hidden");
    openRecord(patientById(btn.dataset.id));
  }
});
$("newPatientForm").addEventListener("submit",e=>{
  e.preventDefault();
  const first=$("newName").value.trim(), last=$("newLastName").value.trim();
  if(!first||!last){showToast("Completa nombre y apellido.");return}
  const rut=$("lookupRut").value.trim();
  if(checkRut(rut)){showToast("Este RUT ya tiene una ficha VIK.");return;}
  if(!validRut(rut)){showToast("Verifica el RUT antes de crear la ficha.");return;}
  if($("newBirthDate").value>TODAY){showToast("La fecha de nacimiento no puede estar en el futuro.");return;}
  const patient={id:`P${crypto.randomUUID()}`,rut,name:`${first} ${last}`,firstName:first,lastName:last,initials:(first[0]+last[0]).toUpperCase(),birthDate:$("newBirthDate").value,sex:$("newSex").value,nationality:$("newNationality").value,blood:$("newBlood").value,phone:$("newPhone").value,email:$("newEmail").value,religion:$("newReligion").value,ethnicity:$("newEthnicity").value,healthSystem:"No informado",chronic:false,alert:false,allergies:[],conditions:[],medications:[],personalHistory:[],familyHistory:[],observations:[],preferences:[],consents:[],attentions:[],decisions:{transfusion:"Sin información registrada",resuscitation:"Sin información registrada",organDonation:"Sin información registrada"}};
  DATA.patients.push(patient);
  renderHome();renderPatients();populateDocumentPatients();renderDocuments();
  showToast("Ficha creada en esta sesión de demostración.");
  $("registerModal").classList.add("hidden");
  openRecord(patient);
});

$("addAttentionBtn").addEventListener("click",()=>{
  if(!selectedPatient)return;
  $("attentionPatientName").textContent=selectedPatient.name;
  const now=new Date();
  $("attentionDate").value=`${calendarIso(now)}T${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  $("attentionReason").value="";
  $("attentionAnamnesis").value="";
  $("attentionDiagnosis").value="";
  $("attentionPlan").value="";
  $("attentionPlace").value=CURRENT_ESTABLISHMENT;
  const draft=attentionDrafts.get(selectedPatient.id);
  if(draft){fillAttention(draft);activeAppointmentId=draft.appointmentId||null;}
  else if(activeAppointmentId){const a=DATA.appointments.find(a=>a.id===activeAppointmentId);$("attentionPlace").value=a.place;$("attentionReason").value=a.reason;}
  $("attentionModal").classList.remove("hidden");
});
$("closeAttention").addEventListener("click",()=>$("attentionModal").classList.add("hidden"));
$("attentionForm").addEventListener("submit",e=>{
  e.preventDefault();
  if(!selectedPatient)return;
  const attention=readAttention();
  if(!attention.reason||!attention.assessment||!attention.plan){showToast('Completa motivo, evaluación e indicaciones antes de finalizar.');return;}
  if(new Date(attention.date)>new Date()){showToast('Una atención realizada no puede tener fecha futura.');return;}
  reviewedAttention={...attention,patientId:selectedPatient.id};
  $("reviewContent").innerHTML=[['Paciente',selectedPatient.name],['Establecimiento',attention.place],['Fecha',formatDateTime(attention.date)],['Motivo',attention.reason],['Evolución',attention.anamnesis||'Sin registro'],['Evaluación',attention.assessment],['Indicaciones',attention.plan]].map(([label,value])=>`<div class="review-row"><span>${esc(label)}</span><p>${esc(value)}</p></div>`).join('');
  $("reviewDialog").showModal();
});

function validRut(value){
  const rut=value.replace(/[.\-\s]/g,"").toUpperCase();
  if(!/^\d{7,8}[0-9K]$/.test(rut))return false;
  let sum=0,factor=2;
  for(const digit of rut.slice(0,-1).split("").reverse()){sum+=Number(digit)*factor;factor=factor===7?2:factor+1;}
  const dv=11-sum%11;
  return rut.at(-1)===(dv===11?"0":dv===10?"K":String(dv));
}
const specialtyOptions=Object.entries(SPECIALTIES).map(([key,s])=>`<option value="${key}">${s.icon} ${esc(s.label)}</option>`).join("");
$("agendaSpecialty").insertAdjacentHTML("beforeend",specialtyOptions);
$("appointmentSpecialty").innerHTML=specialtyOptions;
$("agendaSpecialty").addEventListener("change",renderCalendar);
$("agendaStatus").addEventListener("change",renderCalendar);
$("calendarToday").addEventListener("click",()=>{selectedCalendarDate=TODAY;calendarCursor=new Date(new Date().getFullYear(),new Date().getMonth(),1);renderCalendar();});
$("newAppointmentBtn").addEventListener("click",()=>{
  editingAppointmentId=null;
  $("appointmentForm").reset();
  $("appointmentPatient").innerHTML=DATA.patients.map(p=>`<option value="${p.id}">${esc(p.name)} · ${esc(p.rut)}</option>`).join("");
  $("appointmentDate").value=selectedCalendarDate;
  $("appointmentError").textContent="";
  $("appointmentDialog h2").textContent='Agendar una cita';
  $("appointmentForm button[type=submit]").textContent='Confirmar cita';
  $("appointmentDialog").showModal();
});
$("closeAppointment").addEventListener("click",()=>$("appointmentDialog").close());
$("appointmentForm").addEventListener("submit",e=>{
  e.preventDefault();
  const appointment={id:editingAppointmentId||crypto.randomUUID(),patientId:$("appointmentPatient").value,date:$("appointmentDate").value,time:$("appointmentTime").value,specialty:$("appointmentSpecialty").value,place:$("appointmentPlace").value,professional:$("appointmentProfessional").value,duration:Number($("appointmentDuration").value),reason:$("appointmentReason").value.trim(),status:"pendiente"};
  if(!appointment.reason){$("appointmentError").textContent="Indica el motivo de la cita.";return;}
  if(new Date(`${appointment.date}T${appointment.time}`)<new Date()){$("appointmentError").textContent='Selecciona una fecha y hora futura.';return;}
  const minutes=time=>{const [h,m]=time.split(':').map(Number);return h*60+m;};
  if(DATA.appointments.some(a=>a.id!==editingAppointmentId&&a.status!=='cancelada'&&a.date===appointment.date&&(a.patientId===appointment.patientId||a.professional===appointment.professional)&&minutes(a.time)<minutes(appointment.time)+appointment.duration&&minutes(appointment.time)<minutes(a.time)+(a.duration||30))){$("appointmentError").textContent="El paciente o el profesional ya tiene una cita que se superpone con este horario.";return;}
  if(editingAppointmentId)DATA.appointments[DATA.appointments.findIndex(a=>a.id===editingAppointmentId)]=appointment;else DATA.appointments.push(appointment);
  selectedCalendarDate=appointment.date;
  const [year,month]=appointment.date.split("-").map(Number);calendarCursor=new Date(year,month-1,1);
  $("agendaSpecialty").value="all";$("agendaStatus").value="all";
  $("agendaProfessional").value='all';
  renderCalendar();renderHome();$("appointmentDialog").close();showToast(editingAppointmentId?'Cita reprogramada en esta demo.':'Cita agendada en esta demo.');editingAppointmentId=null;
});
$("lookupRut").addEventListener("input",()=>{$("newPatientForm").classList.add("hidden");$("lookupResult").textContent="";});
function readAttention(){return {date:$("attentionDate").value,place:$("attentionPlace").value,professional:DATA.appointments.find(a=>a.id===activeAppointmentId)?.professional||'Dra. I. Fernández',reason:$("attentionReason").value.trim(),anamnesis:$("attentionAnamnesis").value.trim(),assessment:$("attentionDiagnosis").value.trim(),plan:$("attentionPlan").value.trim(),appointmentId:activeAppointmentId};}
function fillAttention(a){$("attentionDate").value=a.date;$("attentionPlace").value=a.place;$("attentionReason").value=a.reason;$("attentionAnamnesis").value=a.anamnesis;$("attentionDiagnosis").value=a.assessment;$("attentionPlan").value=a.plan;}
$("saveAttentionDraft").addEventListener('click',()=>{if(!selectedPatient)return;attentionDrafts.set(selectedPatient.id,readAttention());$("attentionModal").classList.add('hidden');openRecord(selectedPatient);showToast('Borrador guardado para esta sesión; aún no forma parte del historial.');});
$("finalizeAttention").addEventListener('click',()=>{if(!reviewedAttention)return;const attention=reviewedAttention;const p=patientById(attention.patientId);p.attentions.push({...attention,id:crypto.randomUUID(),status:'finalizada'});const appointment=DATA.appointments.find(a=>a.id===attention.appointmentId);if(appointment)appointment.status='finalizada';attentionDrafts.delete(p.id);reviewedAttention=null;activeAppointmentId=null;$("reviewDialog").close();$("attentionModal").classList.add('hidden');openRecord(p);renderHome();renderCalendar();renderPatients();showToast('Atención finalizada e incorporada a la ficha.');});

function scheduleRow(a){const p=patientById(a.patientId);return `<article class="schedule-row"><div class="schedule-time">${esc(a.time)}<small>${a.duration||30} min</small></div><div><strong>${esc(p.name)}</strong><p>${esc(a.reason)}</p><small>${esc(a.professional)} · ${esc(a.place)}</small></div><div class="schedule-actions"><span class="appointment-state ${a.status==='finalizada'?'complete':''}">${a.status==='finalizada'?'Finalizada':'Pendiente'}</span>${a.status==='pendiente'?`<button class="primary-button" data-start-appointment="${a.id}">Iniciar atención</button><button class="secondary-button" data-edit-appointment="${a.id}">Reprogramar</button>`:`<button class="secondary-button open-record" data-id="${p.id}">Ver ficha</button>`}</div></article>`;}
function renderSchedule(){
  const isMonth=agendaMode==='month';document.querySelector('#view-agenda .calendar-layout').hidden=!isMonth;$("scheduleView").hidden=isMonth;
  document.querySelectorAll('[data-agenda-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.agendaMode===agendaMode)));
  if(isMonth)return;
  const anchor=new Date(selectedCalendarDate+'T12:00');if(agendaMode==='week')anchor.setDate(anchor.getDate()-(anchor.getDay()+6)%7);
  const days=Array.from({length:agendaMode==='week'?7:1},(_,i)=>{const d=new Date(anchor);d.setDate(d.getDate()+i);return calendarIso(d);});
  $("scheduleView").innerHTML=`<div class="schedule-toolbar"><button class="icon-button" data-shift-schedule="-1" aria-label="Período anterior">‹</button><h2>${agendaMode==='week'?'Semana del ':''}${formatDate(days[0])}</h2><button class="icon-button" data-shift-schedule="1" aria-label="Período siguiente">›</button></div><div class="schedule-days">${days.map(day=>{const apps=filteredAppointments().filter(a=>a.date===day).sort((a,b)=>a.time.localeCompare(b.time));return `<section class="schedule-day"><h3>${formatDate(day)} <span>${apps.length} citas</span></h3>${apps.map(scheduleRow).join('')||'<p class="schedule-empty">Sin citas para este día y filtros.</p>'}</section>`;}).join('')}</div>`;
}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.closeDialog){$(b.dataset.closeDialog).close();return;}
  if(b.dataset.docCategory){$("documentTypeFilter").value=b.dataset.docCategory;renderDocuments();return;}
  if(b.dataset.document){const d=DATA.documents.find(d=>d.id===b.dataset.document);if(!d)return;$("documentDialogTitle").textContent=d.type==='Receta'?'Receta registrada':'Documento clínico';$("documentDialogContent").innerHTML=VIKDocuments.preview(d,patientById(d.patientId).name);$("documentDialog").showModal();return;}
  if(b.dataset.agendaMode){agendaMode=b.dataset.agendaMode;renderSchedule();return;}
  if(b.dataset.shiftSchedule){const d=new Date(selectedCalendarDate+'T12:00');d.setDate(d.getDate()+Number(b.dataset.shiftSchedule)*(agendaMode==='week'?7:1));selectedCalendarDate=calendarIso(d);calendarCursor=new Date(d.getFullYear(),d.getMonth(),1);renderCalendar();return;}
  if(b.dataset.startAppointment){activeAppointmentId=b.dataset.startAppointment;const a=DATA.appointments.find(a=>a.id===activeAppointmentId);openRecord(patientById(a.patientId));$("addAttentionBtn").click();return;}
  if(b.dataset.editAppointment){const a=DATA.appointments.find(a=>a.id===b.dataset.editAppointment);$("newAppointmentBtn").click();editingAppointmentId=a.id;$("appointmentDialog h2").textContent='Reprogramar cita';$("appointmentForm button[type=submit]").textContent='Guardar cambios';for(const [id,value] of Object.entries({appointmentPatient:a.patientId,appointmentDate:a.date,appointmentTime:a.time,appointmentPlace:a.place,appointmentSpecialty:a.specialty,appointmentReason:a.reason,appointmentProfessional:a.professional,appointmentDuration:a.duration||30}))$(id).value=value;}
});
$("documentPlaceFilter").insertAdjacentHTML('beforeend',[...new Set(DATA.documents.map(d=>d.place))].map(p=>`<option>${esc(p)}</option>`).join(''));
for(const id of ['documentPlaceFilter','documentFrom','documentTo'])$(id).addEventListener('change',renderDocuments);
$("clearDocuments").addEventListener('click',()=>{$('documentSearch').value='';for(const id of ['documentPatientFilter','documentTypeFilter','documentPlaceFilter'])$(id).value='all';$('documentFrom').value='';$('documentTo').value='';renderDocuments();});
const professionals=DATA.professionals.map(p=>`<option>${esc(p)}</option>`).join('');$("agendaProfessional").insertAdjacentHTML('beforeend',professionals);$("appointmentProfessional").innerHTML=professionals;$("agendaProfessional").addEventListener('change',renderCalendar);
document.querySelector(".clinical-context>span:last-child").textContent=`Datos de demostración · ${formatDate(TODAY)}`;
renderHome();
renderPatients();
populateDocumentPatients();
renderDocuments();
renderCalendar();

$("specialtyLegend").innerHTML=Object.keys(SPECIALTIES).map(specialty=>specialtyBadge({specialty})).join("");

// Keep sticky tabs aligned with the actual, responsive record header.
new ResizeObserver(entries=>{
  const height=entries[0].target.getBoundingClientRect().height;
  $("recordOverlay").style.setProperty("--record-header-height",`${height}px`);
}).observe(document.querySelector(".record-header"));
new ResizeObserver(entries=>{$('recordOverlay').style.setProperty('--clinical-strip-height',`${entries[0].target.getBoundingClientRect().height}px`);}).observe($('clinicalStrip'));

const controlLabels={patientSearchInput:"Buscar pacientes",patientFilter:"Filtrar pacientes",documentSearch:"Buscar documentos",documentPatientFilter:"Filtrar documentos por paciente",documentTypeFilter:"Filtrar por tipo de documento",attentionPlaceFilter:"Filtrar atenciones por establecimiento",lookupRut:"RUT del paciente",closeRegister:"Cerrar registro",closeAttention:"Cerrar nueva atención",notificationBtn:"Ir a revisión clínica"};
Object.entries(controlLabels).forEach(([id,label])=>$(id).setAttribute("aria-label",label));
const navIcons={inicio:'<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',pacientes:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',agenda:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h3m2 0h3"/>',documentos:'<path d="M14 3H5v18h14V8zM14 3v5h5M8 12h8m-8 4h6"/>'};
document.querySelectorAll(".nav-item").forEach(button=>{
  button.setAttribute("aria-label",button.querySelector("span:last-child").textContent);
  button.querySelector(".nav-icon").innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${navIcons[button.dataset.view]}</svg>`;
});
$("notificationBtn").innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 8H3c0-1 3-1 3-8m4 12h4"/></svg>';
document.querySelector('.nav-item.active').setAttribute("aria-current","page");
