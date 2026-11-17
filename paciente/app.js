"use strict";

// Standalone patient demo.
// Clinical data remains DEMO for now.
// Authentication identity comes from sessionStorage.

const $ = id => document.getElementById(id);

const esc = value =>
    String(value ?? "").replace(
        /[&<>"']/g,
        c => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[c])
    );

const iso = date =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const date = value =>
    new Intl.DateTimeFormat("es-CL", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(new Date(value.slice(0, 10) + "T12:00:00"));

const dateTime = value =>
    new Intl.DateTimeFormat("es-CL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(value));

const normalize = value =>
    String(value)
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();

const shifted = days => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return iso(d);
};

const PATIENT_ID = "P001";

const seed = {
    patient: {
        id: PATIENT_ID,
        name: "Ana Pérez",
        rut: "00.000.001-0",
        birth: "1980-05-14",
        sex: "Femenino",
        nationality: "Chilena",
        healthSystem: "FONASA",
        phone: "+56 9 0000 0001",
        email: "ana.perez@example.com",
        blood: "O+",
        emergency: "María Pérez · +56 9 0000 0002",
        religion: "Testigo de Jehová",
        ethnicity: "No informada",
        decision: "Rechazo de transfusiones de sangre registrado.",
        allergies: [
            {
                name: "Penicilina",
                detail: "Reacción cutánea severa",
                emergency: true
            }
        ],
        medications: [
            {
                name: "Metformina",
                detail: "850 mg · 2 veces al día",
                emergency: true
            },
            {
                name: "Losartán",
                detail: "50 mg · 1 vez al día",
                emergency: true
            }
        ],
        conditions: [
            {
                name: "Diabetes mellitus tipo 2",
                detail: "Activa · desde 2021",
                emergency: true
            },
            {
                name: "Hipertensión arterial",
                detail: "Activa · desde 2023",
                emergency: false
            }
        ],
        history: [
            {
                name: "Cirugía",
                detail: "Apendicectomía, 2010"
            },
            {
                name: "Antecedentes familiares",
                detail:
                    "Madre con diabetes mellitus tipo 2; padre con hipertensión arterial."
            }
        ]
    },

    encounters: [
        {
            id: "A005",
            patientId: PATIENT_ID,
            date: "2026-09-30",
            place: "CESFAM Norte",
            professional: "Dra. I. Fernández",
            reason: "Control de diabetes",
            summary: "Control metabólico y revisión de tratamiento.",
            plan:
                "Mantener tratamiento registrado y solicitar HbA1c. Control en 3 meses."
        },
        {
            id: "A003",
            patientId: PATIENT_ID,
            date: "2026-08-15",
            place: "Clínica Central",
            professional: "Dr. Matías Soto",
            reason: "Evaluación por dolor abdominal",
            summary: "Evaluación clínica y solicitud de exámenes.",
            plan:
                "Hemograma y ecografía abdominal. Control según resultados."
        },
        {
            id: "A001",
            patientId: PATIENT_ID,
            date: "2026-02-12",
            place: "CESFAM Sur",
            professional: "Dra. Paula Reyes",
            reason: "Control cardiovascular",
            summary: "Seguimiento de hipertensión arterial.",
            plan:
                "Mantener tratamiento registrado y control periódico."
        }
    ],

    documents: [
        {
            id: "D001",
            patientId: PATIENT_ID,
            title: "Hemograma completo",
            type: "Examen",
            date: "2026-09-29",
            place: "CESFAM Norte",
            encounter: "A005"
        },
        {
            id: "D002",
            patientId: PATIENT_ID,
            title: "Receta médica",
            type: "Receta",
            date: "2026-09-30",
            place: "CESFAM Norte",
            encounter: "A005"
        },
        {
            id: "D003",
            patientId: PATIENT_ID,
            title: "Ecografía abdominal",
            type: "Imagen",
            date: "2026-08-16",
            place: "Clínica Central",
            encounter: "A003"
        },
        {
            id: "D004",
            patientId: PATIENT_ID,
            title: "Informe de atención",
            type: "Informe",
            date: "2026-08-15",
            place: "Clínica Central",
            encounter: "A003"
        },
        {
            id: "D005",
            patientId: PATIENT_ID,
            title: "Consentimiento informado",
            type: "Otro",
            date: "2026-08-15",
            place: "Clínica Central",
            encounter: "A003"
        },
        {
            id: "D006",
            patientId: PATIENT_ID,
            title: "Informe cardiovascular",
            type: "Informe",
            date: "2026-02-12",
            place: "CESFAM Sur",
            encounter: "A001"
        }
    ],

    appointments: [
        {
            id: "C001",
            patientId: PATIENT_ID,
            date: shifted(4),
            time: "09:20",
            specialty: "🩺 Medicina general",
            reason: "Control metabólico",
            place: "CESFAM Norte",
            professional: "Dra. I. Fernández",
            status: "Confirmada",
            reminder: false
        },
        {
            id: "C002",
            patientId: PATIENT_ID,
            date: shifted(12),
            time: "08:00",
            specialty: "🔬 Laboratorio",
            reason: "Toma de exámenes",
            place: "Clínica Central",
            professional: null,
            status: "Pendiente de confirmación",
            reminder: false
        },
        {
            id: "C003",
            patientId: PATIENT_ID,
            date: shifted(-10),
            time: "11:30",
            specialty: "❤️ Cardiología",
            reason: "Control cardiovascular",
            place: "CESFAM Sur",
            professional: "Dra. Paula Reyes",
            status: "Finalizada",
            reminder: false
        },
        {
            id: "C004",
            patientId: PATIENT_ID,
            date: shifted(-25),
            time: "10:00",
            specialty: "🩺 Medicina general",
            reason: "Consulta de seguimiento",
            place: "CESFAM Norte",
            professional: "Dra. I. Fernández",
            status: "Cancelada",
            reminder: false
        }
    ],

    recipients: [
        {
            id: "R1",
            name: "Dra. I. Fernández",
            place: "CESFAM Norte"
        },
        {
            id: "R2",
            name: "Dr. Matías Soto",
            place: "Clínica Central"
        },
        {
            id: "R3",
            name: "Dra. Paula Reyes",
            place: "CESFAM Sur"
        },
        {
            id: "R4",
            name: "Equipo de atención",
            place: "Hospital Regional"
        }
    ],

    accesses: [
        {
            id: "G1",
            recipient: "R1",
            granted: "2026-09-30T09:00:00",
            mode: "presencial",
            expires: null,
            revoked: false
        },
        {
            id: "G2",
            recipient: "R2",
            granted: "2026-08-15T11:30:00",
            mode: "presencial",
            expires: null,
            revoked: true
        }
    ],

    accessLog: [
        {
            at: "2026-09-30T09:00:00",
            text:
                "Acceso otorgado a Dra. I. Fernández · CESFAM Norte."
        },
        {
            at: "2026-08-16T18:00:00",
            text:
                "Acceso revocado a Dr. Matías Soto · Clínica Central."
        }
    ],

    qr: {
        active: true,
        version: 1
    },

    safeMed: {
        reviewed: false
    }
};


// ======================================================
// USUARIO AUTENTICADO
// ======================================================
//
// El login guarda el usuario devuelto por Lambda en:
// sessionStorage → vikUser
//
// Por ahora SOLO utilizamos esta información para
// identificar al usuario en pantalla.
//
// Los datos clínicos continúan siendo DEMO.
// ======================================================

const loggedUser = (() => {
    try {
        return JSON.parse(
            sessionStorage.getItem("vikUser") || "null"
        );
    } catch (error) {
        console.error(
            "No fue posible leer el usuario autenticado:",
            error
        );

        return null;
    }
})();


// Both portals start from one fictional dataset.
// Session changes remain local.

const sharedPatient = window.VIK_DEMO.patients.find(
    p => p.id === PATIENT_ID
);

seed.patient = {
    ...seed.patient,
    name: sharedPatient.name,
    rut: sharedPatient.rut,
    birth: sharedPatient.birthDate,
    sex: sharedPatient.sex,
    nationality: sharedPatient.nationality,
    healthSystem: sharedPatient.healthSystem,
    phone: sharedPatient.phone,
    email: sharedPatient.email,
    blood: sharedPatient.blood,
    emergency: sharedPatient.emergencyContact,
    religion: sharedPatient.religion,
    ethnicity: sharedPatient.ethnicity,
    decision: sharedPatient.decisions.transfusion,
    allergies: sharedPatient.allergies.map(a => ({
        ...a,
        emergency: a.critical
    })),
    medications: sharedPatient.medications.map(m => ({
        name: m.name,
        detail: `${m.dose} · ${m.frequency}`,
        emergency: true
    })),
    conditions: sharedPatient.conditions.map(c => ({
        name: c.name,
        detail: `${c.status} · desde ${c.since}`,
        emergency: c.name === "Diabetes mellitus tipo 2"
    }))
};

seed.encounters = sharedPatient.attentions.map(a => ({
    ...a,
    patientId: PATIENT_ID,
    date: a.date.slice(0, 10),
    summary: a.assessment
}));

seed.documents = window.VIK_DEMO.documents
    .filter(d => d.patientId === PATIENT_ID)
    .map(d => ({
        ...d,
        title: d.name,
        encounter: d.attentionId
    }));

const specialtyLabels = {
    general: "🩺 Medicina general",
    cardiology: "❤️ Cardiología",
    pediatrics: "👶 Pediatría",
    neurology: "🧠 Neurología",
    orthopedics: "🦴 Traumatología",
    dentistry: "🦷 Odontología",
    laboratory: "🔬 Laboratorio",
    pharmacy: "💊 Farmacia"
};

seed.appointments = window.VIK_DEMO.appointments
    .filter(a => a.patientId === PATIENT_ID)
    .map(a => ({
        ...a,
        specialty:
            specialtyLabels[a.specialty] || "Consulta",
        status:
            a.status === "finalizada"
                ? "Finalizada"
                : "Confirmada",
        reminder: false
    }));

seed.accesses = window.VIK_DEMO.permissions
    .filter(g => g.patientId === PATIENT_ID)
    .map(g => ({
        ...g
    }));


// API boundary: replace these async methods with fetch(API Gateway) later.
//
// Authentication, authorization, expiration enforcement and
// S3 signed URLs belong on the backend.
// Client-side demo state is not a security boundary.

const repository = (() => {

    const db = structuredClone(seed);

    const copy = value => structuredClone(value);

    return {

        async load() {
            return copy({
                ...db,
                documents: db.documents.filter(
                    d => d.patientId === PATIENT_ID
                ),
                encounters: db.encounters.filter(
                    a => a.patientId === PATIENT_ID
                ),
                appointments: db.appointments.filter(
                    a => a.patientId === PATIENT_ID
                )
            });
        },

        async reminder(id) {

            const a = db.appointments.find(
                a =>
                    a.id === id &&
                    a.patientId === PATIENT_ID
            );

            if (!a || !isUpcoming(a)) {
                throw Error(
                    "Esta cita no admite recordatorios."
                );
            }

            a.reminder = !a.reminder;
        },

        async grant(recipient, mode, hours) {

            if (
                !db.recipients.some(
                    r => r.id === recipient
                )
            ) {
                throw Error(
                    "Selecciona un destinatario."
                );
            }

            if (
                db.accesses.some(
                    a =>
                        a.recipient === recipient &&
                        accessStatus(a) === "Activo"
                )
            ) {
                throw Error(
                    "Este destinatario ya tiene acceso activo. Revócalo antes de cambiarlo."
                );
            }

            if (
                mode === "telemedicina" &&
                ![1, 24, 72].includes(hours)
            ) {
                throw Error(
                    "Selecciona una duración válida."
                );
            }

            const now = new Date();

            db.accesses.push({
                id: crypto.randomUUID(),
                recipient,
                mode,
                granted: now.toISOString(),
                expires:
                    mode === "telemedicina"
                        ? new Date(
                              now.getTime() +
                                  hours * 3600000
                          ).toISOString()
                        : null,
                revoked: false
            });

            db.accessLog.unshift({
                at: now.toISOString(),
                text:
                    `Acceso ${
                        mode === "telemedicina"
                            ? "temporal"
                            : "presencial"
                    } autorizado a ${
                        db.recipients.find(
                            r => r.id === recipient
                        ).name
                    }.`
            });
        },

        async revoke(id) {

            const a = db.accesses.find(
                a => a.id === id
            );

            if (!a) {
                throw Error(
                    "Acceso no encontrado."
                );
            }

            a.revoked = true;

            db.accessLog.unshift({
                at: new Date().toISOString(),
                text:
                    `Acceso revocado a ${
                        db.recipients.find(
                            r => r.id === a.recipient
                        ).name
                    }.`
            });
        },

        async updateQR(action) {

            if (action === "regenerate") {
                db.qr.version++;
            } else {
                db.qr.active = !db.qr.active;
            }
        },

        async reviewed() {
            db.safeMed.reviewed = true;
        },

        async document(id) {

            const d = db.documents.find(
                d =>
                    d.id === id &&
                    d.patientId === PATIENT_ID
            );

            if (!d) {
                throw Error(
                    "Documento no disponible."
                );
            }

            return copy(d);
        }
    };
})();


const views = {
    inicio: [
        "Mi salud, en un lugar",
        "Tu información y tu cuidado, conectados."
    ],
    ficha: [
        "Mi ficha",
        "Una historia de salud, en todos tus establecimientos."
    ],
    documentos: [
        "Mis documentos",
        "Exámenes, recetas e informes a tu alcance."
    ],
    citas: [
        "Mis citas",
        "Tus próximas visitas y el registro de citas anteriores."
    ],
    accesos: [
        "Accesos a mi ficha",
        "Revisa y administra tus autorizaciones."
    ],
    qr: [
        "QR de emergencia",
        "Solo lo esencial para una atención de emergencia."
    ],
    safemed: [
        "SafeMed",
        "Información para revisar con tu equipo de salud."
    ]
};


const navLabels = {
    inicio: "Inicio",
    ficha: "Mi ficha",
    documentos: "Documentos",
    citas: "Mis citas",
    accesos: "Accesos",
    qr: "QR de emergencia",
    safemed: "SafeMed"
};


const icons = {
    inicio:
        '<path d="m3 10 9-7 9 7v11H3zM9 21v-8h6v8"/>',

    ficha:
        '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 8h6m-3-3v6M8 15h8m-8 3h5"/>',

    documentos:
        '<path d="M14 3H5v18h14V8zM14 3v5h5M8 12h8m-8 4h6"/>',

    citas:
        '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18"/>',

    accesos:
        '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6zM8 12l3 3 5-6"/>',

    qr:
        '<path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h3v3h3v3h-6z"/>',

    safemed:
        '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>'
};


let data,
    currentView = "inicio",
    period = "upcoming",
    cursor = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
    ),
    selectedDate = iso(new Date());


const isUpcoming = a =>
    new Date(`${a.date}T${a.time}`) >= new Date() &&
    !["Finalizada", "Cancelada"].includes(a.status);


function accessStatus(a) {
    return a.revoked
        ? "Revocado"
        : a.expires &&
          new Date(a.expires) <= new Date()
        ? "Vencido"
        : "Activo";
}


function toast(message) {

    $("toast").textContent = message;
    $("toast").hidden = false;

    clearTimeout(toast.timer);

    toast.timer = setTimeout(
        () => ($("toast").hidden = true),
        3500
    );
}


let modalOpener = null;


function modal(title, content) {

    modalOpener = document.activeElement;

    $("modalTitle").textContent = title;
    $("modalContent").innerHTML = content;

    if (!$("modal").open) {
        $("modal").showModal();
    }
}


function empty(text) {
    return `<div class="empty">${esc(text)}</div>`;
}


function items(list) {

    return list
        .map(
            x =>
                `<div class="row">
                    <div>
                        <strong>${esc(x.name)}</strong>
                        <p>${esc(x.detail)}</p>
                    </div>
                </div>`
        )
        .join("");
}


function fields(list) {

    return `
        <dl>
            ${list
                .map(
                    ([k, v]) =>
                        `<div>
                            <dt>${esc(k)}</dt>
                            <dd>${esc(v)}</dd>
                        </div>`
                )
                .join("")}
        </dl>
    `;
}


function docRow(d) {
    return VIKDocuments.card(d, "data-document");
}


function compactDocRow(d) {

    return `
        <div class="row compact-doc">
            <div>
                <strong>${esc(d.title)}</strong>
                <p>
                    ${esc(d.type)} · ${date(d.date)} · ${esc(d.place)}
                </p>
            </div>

            <button
                class="secondary"
                data-document="${d.id}"
            >
                Ver
            </button>
        </div>
    `;
}


function appointmentCard(a, panel = true) {

    return `
        <article class="appointment-card ${panel ? "panel" : ""}">

            <span class="pill ${
                a.status === "Finalizada"
                    ? "mint"
                    : a.status === "Cancelada"
                    ? "neutral"
                    : ""
            }">
                ${esc(a.status)}
            </span>

            <h3>${esc(a.specialty)}</h3>

            <p>
                <strong>
                    ${date(a.date)} · ${esc(a.time)}
                </strong>
            </p>

            <p>${esc(a.reason)}</p>

            <p>
                ${esc(a.place)} ·
                ${esc(a.professional || "Profesional por asignar")}
            </p>

            ${
                isUpcoming(a)
                    ? `
                        <button
                            class="secondary"
                            data-reminder="${a.id}"
                            aria-pressed="${a.reminder}"
                            style="margin-top:12px"
                        >
                            ${
                                a.reminder
                                    ? "✓ Recordatorio activado"
                                    : "Activar recordatorio"
                            }
                        </button>
                    `
                    : ""
            }

        </article>
    `;
}


function renderHome() {

    const p = data.patient;

    const next = [...data.appointments]
        .filter(isUpcoming)
        .sort(
            (a, b) =>
                (a.date + a.time).localeCompare(
                    b.date + b.time
                )
        )[0];

    /*
     * IMPORTANTE:
     * El nombre mostrado viene del usuario autenticado.
     * Si no existe sesión, se utiliza el nombre DEMO.
     */

    const displayName =
        loggedUser?.name || p.name;

    $("view-inicio").innerHTML = `

        <div class="hero simple-hero">

            <div>

                <p class="eyebrow">Inicio</p>

                <h2>
                    Hola, ${esc(displayName)}
                </h2>

                <p>
                    Estos son los temas más importantes para hoy.
                    Puedes abrir cada sección cuando necesites más detalle.
                </p>

                <div class="actions">

                    <button
                        class="primary"
                        data-view="citas"
                    >
                        Ver mi próxima cita
                    </button>

                    <button
                        class="secondary"
                        data-view="qr"
                    >
                        QR de emergencia
                    </button>

                </div>

            </div>

        </div>


        <div class="priority-grid">

            <article class="panel priority-card">

                <p class="eyebrow">
                    Próxima cita
                </p>

                ${
                    next
                        ? appointmentCard(next, false)
                        : empty(
                              "No tienes próximas citas registradas."
                          )
                }

                <button
                    class="text-button"
                    data-view="citas"
                >
                    Ver todas mis citas
                </button>

            </article>


            <article class="panel priority-card">

                <p class="eyebrow">
                    Medicamentos
                </p>

                <h2>
                    ${p.medications.length}
                    medicamentos actuales
                </h2>

                <p class="muted">
                    Revisa la lista completa solo cuando lo necesites.
                </p>

                <details>

                    <summary>
                        Ver medicamentos
                    </summary>

                    ${items(p.medications)}

                </details>

            </article>


            <article class="panel priority-card">

                <p class="eyebrow">
                    Emergencia
                </p>

                <h2>
                    QR ${data.qr.active ? "activo" : "inactivo"}
                </h2>

                <p class="muted">
                    Muestra solo información crítica.
                </p>

                <button
                    class="secondary"
                    data-view="qr"
                >
                    Abrir QR
                </button>

            </article>

        </div>


        <details class="panel progressive-section">

            <summary>
                Documentos recientes
            </summary>

            ${
                [...data.documents]
                    .sort(
                        (a, b) =>
                            b.date.localeCompare(a.date)
                    )
                    .slice(0, 3)
                    .map(compactDocRow)
                    .join("")
            }

            <button
                class="text-button"
                data-view="documentos"
            >
                Ver todos los documentos
            </button>

        </details>


        <details class="panel progressive-section">

            <summary>
                Últimos movimientos de mi ficha
            </summary>

            <div class="timeline compact-timeline">

                ${
                    [...data.encounters]
                        .sort(
                            (a, b) =>
                                b.date.localeCompare(a.date)
                        )
                        .slice(0, 2)
                        .map(
                            a =>
                                `
                                    <article>

                                        <span class="caption">
                                            ${date(a.date)}
                                        </span>

                                        <h3>
                                            ${esc(a.reason)}
                                        </h3>

                                        <p>
                                            ${esc(a.place)}
                                        </p>

                                    </article>
                                `
                        )
                        .join("")
                }

            </div>

            <button
                class="text-button"
                data-view="ficha"
            >
                Consultar historial completo
            </button>

        </details>


        <article class="notice calm-alert">

            <p class="eyebrow">
                SafeMed
            </p>

            <h3>
                Información para revisar
            </h3>

            <p>
                Hay antecedentes que deberían ser revisados
                por un profesional de salud.
            </p>

            <button
                class="text-button"
                data-view="safemed"
            >
                Ver SafeMed
            </button>

        </article>
    `;
}


function renderRecord() {

    const p = data.patient;

    $("view-ficha").innerHTML = `

        <div class="panel record-summary">

            <div class="identity">

                <span class="avatar">
                    AP
                </span>

                <div>

                    <h2>
                        ${esc(p.name)}
                    </h2>

                    <p>
                        ${esc(p.rut)}
                        · Grupo ${esc(p.blood)}
                        · ID VIK ${p.id}
                    </p>

                </div>

            </div>

            <p class="caption">
                Ficha de consulta. Los detalles clínicos
                aparecen en secciones desplegables.
            </p>

        </div>


        <div class="priority-grid clinical-priority-grid">

            <article class="panel clinical-card allergy">

                <p class="eyebrow">
                    Alergias
                </p>

                <h2>
                    ${
                        p.allergies.length
                            ? p.allergies.length +
                              " registrada(s)"
                            : "Sin alergias registradas"
                    }
                </h2>

                <details>

                    <summary>
                        Ver detalle
                    </summary>

                    ${items(p.allergies)}

                </details>

            </article>


            <article class="panel clinical-card condition">

                <p class="eyebrow">
                    Condiciones
                </p>

                <h2>
                    ${p.conditions.length}
                    en seguimiento
                </h2>

                <details>

                    <summary>
                        Ver condiciones
                    </summary>

                    ${items(p.conditions)}

                </details>

            </article>


            <article class="panel clinical-card">

                <p class="eyebrow">
                    Medicamentos
                </p>

                <h2>
                    ${p.medications.length}
                    actuales
                </h2>

                <details>

                    <summary>
                        Ver lista
                    </summary>

                    ${items(p.medications)}

                </details>

            </article>


            <article class="panel clinical-card blood">

                <p class="eyebrow">
                    Grupo sanguíneo
                </p>

                <h2>
                    ${esc(p.blood || "No informado")}
                </h2>

                <p class="caption">
                    Dato visible para atención rápida.
                </p>

            </article>

        </div>


        <details class="panel progressive-section">

            <summary>
                Datos personales
            </summary>

            ${fields([
                ["Fecha de nacimiento", date(p.birth)],
                ["Sexo", p.sex],
                ["Nacionalidad", p.nationality],
                ["Sistema de salud", p.healthSystem],
                ["Teléfono", p.phone],
                ["Correo", p.email],
                ["Contacto de emergencia", p.emergency]
            ])}

        </details>


        <details class="panel progressive-section">

            <summary>
                Antecedentes relevantes
            </summary>

            ${items(p.history)}

            <div
                class="notice"
                style="margin-top:16px"
            >

                <strong>
                    Decisión clínica registrada
                </strong>

                <p>
                    ${esc(p.decision)}
                </p>

            </div>

        </details>


        <details
            class="panel progressive-section"
            open
        >

            <summary>
                Historial de atenciones
            </summary>

            <p class="caption">
                Una ficha VIK, aunque existan atenciones
                en distintos establecimientos.
            </p>

            <div class="timeline">

                ${
                    [...data.encounters]
                        .sort(
                            (a, b) =>
                                b.date.localeCompare(a.date)
                        )
                        .map(
                            a =>
                                `
                                    <article>

                                        <span class="eyebrow">
                                            ${date(a.date)}
                                        </span>

                                        <h3>
                                            ${esc(a.reason)}
                                        </h3>

                                        <p>
                                            ${esc(a.place)}
                                            ·
                                            ${esc(a.professional)}
                                        </p>

                                        <details>

                                            <summary>
                                                Ver atención
                                            </summary>

                                            <p>
                                                ${esc(a.summary)}
                                            </p>

                                            <p>
                                                <strong>
                                                    Plan registrado:
                                                </strong>
                                                ${esc(a.plan)}
                                            </p>

                                        </details>

                                    </article>
                                `
                        )
                        .join("")
                }

            </div>

        </details>


        <details class="panel preferences">

            <summary>
                Preferencias personales y culturales
            </summary>

            <p class="caption">
                Datos opcionales de contexto.
                No se incluyen en el QR de emergencia.
            </p>

            ${fields([
                ["Religión / convicción", p.religion],
                [
                    "Pertenencia étnica o cultural",
                    p.ethnicity
                ]
            ])}

        </details>
    `;
}


function renderDocuments() {

    $("documentCategories").innerHTML =
        VIKDocuments.categories(
            data.documents,
            $("docType").value
        );

    const q = normalize(
        $("docSearch").value.trim()
    );

    const from = $("docFrom").value;
    const to = $("docTo").value;

    if (from && to && from > to) {

        $("documentCount").textContent =
            "La fecha Desde debe ser anterior o igual a Hasta.";

        $("documentList").innerHTML =
            empty("Ajusta el rango de fechas.");

        return;
    }

    const docs = data.documents
        .filter(
            d =>
                normalize(
                    d.title + " " + d.place
                ).includes(q) &&
                (
                    $("docType").value === "all" ||
                    d.type === $("docType").value
                ) &&
                (
                    $("docPlace").value === "all" ||
                    d.place === $("docPlace").value
                ) &&
                (!from || d.date >= from) &&
                (!to || d.date <= to)
        )
        .sort(
            (a, b) =>
                b.date.localeCompare(a.date)
        );

    $("documentCount").textContent =
        `${docs.length} documento(s) encontrados`;

    $("documentList").innerHTML =
        docs.map(docRow).join("") ||
        empty(
            "No hay documentos para estos filtros. Prueba limpiar la búsqueda."
        );
}


function renderCalendar() {

    const y = cursor.getFullYear();
    const m = cursor.getMonth();

    const first = new Date(y, m, 1);

    const start = new Date(
        y,
        m,
        1 - ((first.getDay() + 6) % 7)
    );

    $("calendarTitle").textContent =
        new Intl.DateTimeFormat("es-CL", {
            month: "long",
            year: "numeric"
        }).format(cursor);

    $("calendar").innerHTML =
        Array.from({ length: 42 }, (_, i) => {

            const d = new Date(start);

            d.setDate(start.getDate() + i);

            const key = iso(d);

            const apps =
                data.appointments.filter(
                    a => a.date === key
                );

            return `
                <button
                    class="${
                        d.getMonth() !== m
                            ? "muted-day "
                            : ""
                    }${
                        key === selectedDate
                            ? "selected "
                            : ""
                    }${
                        key === iso(new Date())
                            ? "today"
                            : ""
                    }"
                    data-day="${key}"
                    aria-pressed="${key === selectedDate}"
                    aria-label="${date(key)}: ${apps.length} citas"
                >

                    <span class="day-number">
                        ${d.getDate()}
                    </span>

                    ${apps
                        .map(
                            a =>
                                `
                                    <span
                                        class="calendar-icon"
                                        aria-hidden="true"
                                    >
                                        ${a.specialty.split(" ")[0]}
                                    </span>
                                `
                        )
                        .join("")}

                </button>
            `;
        }).join("");

    $("selectedDay").textContent =
        date(selectedDate);

    $("dayAppointments").innerHTML =
        data.appointments
            .filter(
                a => a.date === selectedDate
            )
            .sort(
                (a, b) =>
                    a.time.localeCompare(b.time)
            )
            .map(
                a =>
                    appointmentCard(a, false)
            )
            .join("") ||
        empty(
            "No hay citas para este día."
        );

    const list = data.appointments
        .filter(
            a =>
                period === "upcoming"
                    ? isUpcoming(a)
                    : !isUpcoming(a)
        )
        .sort(
            (a, b) =>
                period === "upcoming"
                    ? (a.date + a.time).localeCompare(
                          b.date + b.time
                      )
                    : (b.date + b.time).localeCompare(
                          a.date + a.time
                      )
        );

    $("appointmentList").innerHTML =
        list.map(
            a => appointmentCard(a)
        ).join("") ||
        empty(
            "No hay citas en esta categoría."
        );

    document
        .querySelectorAll("[data-period]")
        .forEach(b =>
            b.setAttribute(
                "aria-pressed",
                String(
                    b.dataset.period === period
                )
            )
        );
}


function renderAccess() {

    const active =
        data.accesses.filter(
            a => accessStatus(a) === "Activo"
        ).length;

    $("view-accesos").innerHTML = `

        <div class="hero">

            <div>

                <p class="eyebrow">
                    Tú administras tus autorizaciones
                </p>

                <h2>
                    Tu ficha, con acceso consciente
                </h2>

                <p>
                    Consulta a quién autorizaste y hasta cuándo.
                    Esta demostración no concede acceso a sistemas reales.
                </p>

            </div>

            <button
                class="primary"
                data-action="grant"
            >
                + Autorizar acceso
            </button>

        </div>


        <div class="grid dashboard">

            <article class="panel">

                <div class="panel-heading">

                    <h2>
                        Profesionales y establecimientos
                    </h2>

                    <span class="pill mint">
                        ${active} activos
                    </span>

                </div>

                ${data.accesses
                    .map(a => {

                        const r =
                            data.recipients.find(
                                r =>
                                    r.id ===
                                    a.recipient
                            );

                        const status =
                            accessStatus(a);

                        return `
                            <article class="access-card">

                                <div>

                                    <h3>
                                        ${esc(r.name)}
                                    </h3>

                                    <p>
                                        ${esc(r.place)}
                                    </p>

                                    <p>
                                        Otorgado:
                                        ${dateTime(a.granted)}
                                    </p>

                                    <p>
                                        <strong>
                                            Alcance:
                                        </strong>
                                        Ficha clínica y documentos
                                        · solo consulta
                                    </p>

                                    <p>
                                        ${
                                            a.mode ===
                                            "telemedicina"
                                                ? "Telemedicina · vence " +
                                                  dateTime(
                                                      a.expires
                                                  )
                                                : "Atención presencial · hasta revocación"
                                        }
                                    </p>

                                    <span
                                        class="pill ${
                                            status ===
                                            "Activo"
                                                ? "mint"
                                                : "neutral"
                                        }"
                                    >
                                        ${status}
                                    </span>

                                </div>

                                ${
                                    status === "Activo"
                                        ? `
                                            <button
                                                class="secondary"
                                                data-revoke="${a.id}"
                                            >
                                                Revocar acceso
                                            </button>
                                        `
                                        : ""
                                }

                            </article>
                        `;
                    })
                    .join("")}

            </article>


            <article class="panel">

                <p class="eyebrow">
                    Trazabilidad
                </p>

                <h2>
                    Historial de autorizaciones
                </h2>

                <p class="caption">
                    Registra permisos simulados;
                    no representa lecturas reales de tu ficha.
                </p>

                <div class="access-log">

                    ${[...data.accessLog]
                        .sort(
                            (a, b) =>
                                new Date(b.at) -
                                new Date(a.at)
                        )
                        .map(
                            l =>
                                `
                                    <div class="row">

                                        <div>

                                            <strong>
                                                ${esc(l.text)}
                                            </strong>

                                            <p>
                                                ${dateTime(l.at)}
                                            </p>

                                        </div>

                                    </div>
                                `
                        )
                        .join("")}

                </div>

            </article>

        </div>
    `;
}


// Explicit allowlist.
// Never pass the complete patient object to the emergency view.

function emergencyData() {

    const p = data.patient;

    return [
        ["Nombre", p.name],

        ["Grupo sanguíneo", p.blood],

        [
            "Alergias relevantes",
            p.allergies
                .filter(a => a.emergency)
                .map(
                    a =>
                        a.name +
                        " · " +
                        a.detail
                )
                .join("; ") ||
                "No registradas"
        ],

        [
            "Medicamentos relevantes",
            p.medications
                .filter(m => m.emergency)
                .map(
                    m =>
                        m.name +
                        " · " +
                        m.detail
                )
                .join("; ") ||
                "No registrados"
        ],

        [
            "Condiciones críticas",
            p.conditions
                .filter(c => c.emergency)
                .map(c => c.name)
                .join("; ") ||
                "No registradas"
        ],

        [
            "Contacto de emergencia",
            p.emergency
        ],

        [
            "Decisión clínica relevante",
            p.decision
        ]
    ];
}


function renderQR() {

    $("view-qr").innerHTML = `

        <div
            class="notice"
            style="margin-bottom:20px"
        >

            <strong>
                Tu QR no entrega la ficha completa.
            </strong>

            <p>
                Representa únicamente la información
                crítica definida para esta demostración.
            </p>

        </div>


        <div class="qr-layout">

            <article class="panel qr-card">

                <p class="eyebrow">
                    Identificación de emergencia
                </p>

                <h2>
                    Mi QR VIK
                </h2>

                <span
                    class="pill ${
                        data.qr.active
                            ? "mint"
                            : "neutral"
                    }"
                >
                    QR ${
                        data.qr.active
                            ? "activo"
                            : "inactivo"
                    }
                </span>

                <div
                    class="qr-visual ${
                        data.qr.active
                            ? ""
                            : "disabled"
                    }"
                    role="img"
                    aria-label="Representación de QR simulado, no escaneable"
                >

                    <strong>
                        QR
                    </strong>

                    <small>
                        DEMO · NO ESCANEABLE
                    </small>

                    <small>
                        Versión ${data.qr.version}
                    </small>

                </div>

                <p class="caption">
                    No contiene una URL pública ni datos codificados.
                </p>

                <div class="actions">

                    <button
                        class="primary"
                        data-action="qr-preview"
                        ${data.qr.active ? "" : "disabled"}
                    >
                        Vista de emergencia
                    </button>

                    <button
                        class="secondary"
                        data-action="qr-toggle"
                    >
                        ${
                            data.qr.active
                                ? "Desactivar QR"
                                : "Activar QR"
                        }
                    </button>

                    <button
                        class="secondary"
                        data-action="qr-regenerate"
                    >
                        Regenerar QR
                    </button>

                </div>

            </article>


            <article class="panel critical">

                <p class="eyebrow">
                    Contenido limitado
                </p>

                <h2>
                    Información que representa
                </h2>

                ${fields(emergencyData())}

                <p class="caption">
                    Correo, documentos, historial y
                    preferencias culturales quedan fuera
                    de este acceso.
                </p>

            </article>

        </div>
    `;
}


function renderSafeMed() {

    $("view-safemed").innerHTML = `

        <div class="grid two">

            <article class="panel">

                <div
                    class="safe-icon"
                    aria-hidden="true"
                >
                    ♡
                </div>

                <p class="eyebrow">
                    SafeMed · alerta ilustrativa
                </p>

                <h2>
                    Revisión por un profesional
                </h2>

                <div class="notice">

                    <p>
                        SafeMed detectó información
                        que debería ser revisada por
                        un profesional de salud.
                    </p>

                </div>

                <p style="margin-top:18px">

                    Esta alerta simulada se relaciona con
                    los medicamentos y antecedentes registrados
                    en tu ficha. No confirma una interacción
                    ni un diagnóstico.

                </p>

                <span class="pill peach">

                    ${
                        data.safeMed.reviewed
                            ? "Leída por ti · revisión clínica pendiente"
                            : "Pendiente de revisión clínica"
                    }

                </span>

                <div class="actions">

                    <button
                        class="primary"
                        data-view="ficha"
                    >
                        Consultar mi ficha
                    </button>

                    <button
                        class="secondary"
                        data-action="read-alert"
                        ${
                            data.safeMed.reviewed
                                ? "disabled"
                                : ""
                        }
                    >
                        ${
                            data.safeMed.reviewed
                                ? "Marcada como leída"
                                : "Marcar como leída"
                        }
                    </button>

                </div>

            </article>


            <article class="panel">

                <h2>
                    Qué hace SafeMed en esta demo
                </h2>

                <div class="row">

                    <div>

                        <strong>
                            Presenta información para revisar
                        </strong>

                        <p>
                            La evaluación corresponde
                            a un profesional de salud.
                        </p>

                    </div>

                </div>

                <div class="row">

                    <div>

                        <strong>
                            No diagnostica ni prescribe
                        </strong>

                        <p>
                            No genera recomendaciones
                            ni cambios automáticos de tratamiento.
                        </p>

                    </div>

                </div>

                <div class="row">

                    <div>

                        <strong>
                            Leer no resuelve la alerta
                        </strong>

                        <p>
                            Marcar como leída solo actualiza
                            tu estado de lectura.
                        </p>

                    </div>

                </div>

            </article>

        </div>
    `;
}


function renderAll() {

    renderHome();
    renderRecord();
    linkEncounterDocuments();
    renderDocuments();
    renderCalendar();
    renderAccess();
    renderQR();
    renderSafeMed();
}


function linkEncounterDocuments() {

    document
        .querySelectorAll(
            "#view-ficha .timeline article"
        )
        .forEach((article, i) => {

            const encounter = [...data.encounters]
                .sort(
                    (a, b) =>
                        b.date.localeCompare(a.date)
                )[i];

            const docs = data.documents.filter(
                d =>
                    d.encounter ===
                    encounter.id
            );

            article.insertAdjacentHTML(
                "beforeend",
                `
                    <div class="record-linked-docs">

                        ${docs
                            .map(
                                d =>
                                    `
                                        <button
                                            data-document="${d.id}"
                                        >
                                            ${esc(d.type)}
                                            ·
                                            ${esc(d.title)}
                                        </button>
                                    `
                            )
                            .join("")}

                    </div>
                `
            );
        });
}


function navigate(view) {

    if (!views[view]) return;

    currentView = view;

    if (view === "accesos") {
        renderAccess();
    }

    document
        .querySelectorAll(".view")
        .forEach(
            v =>
                (v.hidden =
                    v.id !== `view-${view}`)
        );

    document
        .querySelectorAll(".nav-item")
        .forEach(b => {

            b.classList.toggle(
                "active",
                b.dataset.view === view
            );

            if (b.dataset.view === view) {
                b.setAttribute(
                    "aria-current",
                    "page"
                );
            } else {
                b.removeAttribute(
                    "aria-current"
                );
            }
        });

    $("pageTitle").textContent =
        views[view][0];

    $("pageSubtitle").textContent =
        views[view][1];

    $("pageTitle").focus({
        preventScroll: true
    });

    window.scrollTo({
        top: 0
    });
}


async function refresh() {

    data = await repository.load();

    renderAll();
}


function grantDialog() {

    modal(
        "Autorizar acceso",
        `
            <p class="muted">
                Selecciona quién podrá consultar
                tu ficha en esta simulación.
            </p>

            <form id="grantForm">

                <div class="form-grid">

                    <label class="span-two">

                        Profesional o establecimiento

                        <select
                            name="recipient"
                            required
                        >

                            ${data.recipients
                                .map(
                                    r =>
                                        `
                                            <option value="${r.id}">
                                                ${esc(r.name)}
                                                ·
                                                ${esc(r.place)}
                                            </option>
                                        `
                                )
                                .join("")}

                        </select>

                    </label>


                    <label>

                        Tipo de acceso

                        <select
                            name="mode"
                            id="grantMode"
                        >

                            <option value="presencial">
                                Atención presencial
                            </option>

                            <option value="telemedicina">
                                Telemedicina temporal
                            </option>

                        </select>

                    </label>


                    <label>

                        Duración temporal

                        <select
                            name="hours"
                            id="grantHours"
                            disabled
                        >

                            <option value="1">
                                1 hora
                            </option>

                            <option value="24">
                                24 horas
                            </option>

                            <option value="72">
                                72 horas
                            </option>

                        </select>

                    </label>

                </div>


                <p class="caption">

                    Presencial: hasta revocación.
                    Telemedicina: vence al finalizar
                    la duración seleccionada.

                </p>


                <div
                    id="permissionReview"
                    class="permission-summary"
                >
                </div>


                <label class="check-label">

                    <input
                        type="checkbox"
                        required
                    >

                    Autorizo la consulta de mi ficha
                    por el destinatario seleccionado
                    en esta demo.

                </label>


                <p
                    id="grantError"
                    class="form-error"
                    role="alert"
                >
                </p>


                <button
                    class="primary"
                    type="submit"
                >
                    Confirmar autorización
                </button>

            </form>
        `
    );
}


document.addEventListener(
    "click",
    async e => {

        const button =
            e.target.closest("button");

        if (!button || button.disabled) return;

        try {

            if (button.dataset.view) {
                navigate(button.dataset.view);
                return;
            }


            if (button.dataset.period) {
                period = button.dataset.period;
                renderCalendar();
                return;
            }


            if (button.dataset.day) {

                selectedDate =
                    button.dataset.day;

                renderCalendar();

                document
                    .querySelector(
                        `[data-day="${selectedDate}"]`
                    )
                    ?.focus({
                        preventScroll: true
                    });

                return;
            }


            if (button.dataset.reminder) {

                const id =
                    button.dataset.reminder;

                await repository.reminder(id);

                await refresh();

                document
                    .querySelector(
                        `#view-${currentView} [data-reminder="${id}"]`
                    )
                    ?.focus({
                        preventScroll: true
                    });

                toast(
                    "Recordatorio visual actualizado."
                );

                return;
            }


            if (button.dataset.document) {

                const d =
                    await repository.document(
                        button.dataset.document
                    );

                modal(
                    d.type === "Receta"
                        ? "Mi receta registrada"
                        : d.title,
                    VIKDocuments.preview(
                        d,
                        data.patient.name
                    )
                );

                return;
            }


            if (button.dataset.docCategory) {

                $("docType").value =
                    button.dataset.docCategory;

                renderDocuments();

                return;
            }


            if (button.dataset.revoke) {

                const id =
                    button.dataset.revoke;

                modal(
                    "Revocar acceso",
                    `
                        <p>
                            El permiso seleccionado
                            quedará revocado en esta demostración.
                            Se conservará en el historial.
                        </p>

                        <button
                            class="primary"
                            data-confirm-revoke="${id}"
                        >
                            Confirmar revocación
                        </button>
                    `
                );

                return;
            }


            if (button.dataset.confirmRevoke) {

                await repository.revoke(
                    button.dataset.confirmRevoke
                );

                $("modal").close();

                await refresh();

                $("pageTitle").focus();

                toast(
                    "Acceso revocado en la demo."
                );

                return;
            }


            const action =
                button.dataset.action;


            if (action === "grant") {

                grantDialog();
                updatePermissionReview();

            }


            if (
                action === "qr-preview" &&
                data.qr.active
            ) {

                modal(
                    "Información de emergencia",
                    `
                        <p class="eyebrow">
                            Vista limitada · simulación
                        </p>

                        <div class="critical">
                            ${fields(emergencyData())}
                        </div>
                    `
                );

            }


            if (
                action === "qr-toggle" ||
                action === "qr-regenerate"
            ) {

                modal(
                    action === "qr-toggle"
                        ? data.qr.active
                            ? "Desactivar QR"
                            : "Activar QR"
                        : "Regenerar QR",

                    `
                        <p>
                            ${
                                action ===
                                "qr-regenerate"
                                    ? "Se creará una nueva versión simulada. La versión anterior quedará reemplazada y se conservará el estado activo o inactivo."
                                    : "Se cambiará la disponibilidad de la vista de emergencia en esta demo."
                            }
                        </p>

                        <button
                            class="primary"
                            data-confirm-qr="${
                                action ===
                                "qr-regenerate"
                                    ? "regenerate"
                                    : "toggle"
                            }"
                        >
                            Confirmar
                        </button>
                    `
                );
            }


            if (button.dataset.confirmQr) {

                await repository.updateQR(
                    button.dataset.confirmQr
                );

                $("modal").close();

                await refresh();

                $("pageTitle").focus();

                toast(
                    "QR actualizado en la demo."
                );
            }


            if (action === "read-alert") {

                await repository.reviewed();

                await refresh();

                toast(
                    "Marcada como leída. La revisión clínica sigue pendiente."
                );
            }

        } catch (error) {

            toast(error.message);

        }
    }
);


document.addEventListener(
    "change",
    e => {

        if (e.target.id === "grantMode") {

            $("grantHours").disabled =
                e.target.value !==
                "telemedicina";

        }

        if (
            e.target.closest("#grantForm")
        ) {
            updatePermissionReview();
        }
    }
);


document.addEventListener(
    "submit",
    async e => {

        if (
            e.target.id !== "grantForm"
        ) {
            return;
        }

        e.preventDefault();

        const form = e.target;

        const submit =
            form.querySelector(
                "[type=submit]"
            );

        submit.disabled = true;

        try {

            const values =
                new FormData(form);

            await repository.grant(
                values.get("recipient"),
                values.get("mode"),
                Number(
                    values.get("hours")
                )
            );

            $("modal").close();

            await refresh();

            $("pageTitle").focus();

            toast(
                "Autorización registrada en la demo."
            );

        } catch (error) {

            $("grantError").textContent =
                error.message;

        } finally {

            submit.disabled = false;

        }
    }
);


$("closeModal").addEventListener(
    "click",
    () => $("modal").close()
);


$("modal").addEventListener(
    "close",
    () => {

        if (
            modalOpener?.isConnected
        ) {

            modalOpener.focus({
                preventScroll: true
            });

        } else {

            $("pageTitle").focus({
                preventScroll: true
            });

        }
    }
);


$("documentFilters").addEventListener(
    "submit",
    e => e.preventDefault()
);


$("documentFilters").addEventListener(
    "input",
    renderDocuments
);


$("documentFilters").addEventListener(
    "change",
    renderDocuments
);


$("documentFilters").addEventListener(
    "reset",
    () =>
        setTimeout(
            renderDocuments,
            0
        )
);


$("prevMonth").addEventListener(
    "click",
    () => {

        cursor = new Date(
            cursor.getFullYear(),
            cursor.getMonth() - 1,
            1
        );

        renderCalendar();
    }
);


$("nextMonth").addEventListener(
    "click",
    () => {

        cursor = new Date(
            cursor.getFullYear(),
            cursor.getMonth() + 1,
            1
        );

        renderCalendar();
    }
);


$("todayButton").addEventListener(
    "click",
    () => {

        const now = new Date();

        cursor = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        selectedDate = iso(now);

        renderCalendar();
    }
);


async function init() {

    try {

        data =
            await repository.load();

        $("navigation").innerHTML =
            Object.keys(views)
                .map(
                    key =>
                        `
                            <button
                                class="nav-item"
                                data-view="${key}"
                            >

                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    aria-hidden="true"
                                >
                                    ${icons[key]}
                                </svg>

                                <span>
                                    ${navLabels[key]}
                                </span>

                            </button>
                        `
                )
                .join("");


        $("docPlace").insertAdjacentHTML(
            "beforeend",

            [
                ...new Set(
                    data.documents.map(
                        d => d.place
                    )
                )
            ]
                .map(
                    p =>
                        `<option>${esc(p)}</option>`
                )
                .join("")
        );


        renderAll();

        navigate("inicio");

        setInterval(
            refreshAccessExpiry,
            30000
        );

    } catch (error) {

        $("loadError").hidden = false;

        $("loadError").textContent =
            "No se pudo cargar la demostración. Recarga la página.";
    }
}


async function refreshAccessExpiry() {

    // Re-evaluate expiration without resetting
    // forms or calendar focus.

    if (!data) return;

    const now = Date.now();

    const signature =
        data.accesses
            .map(
                a =>
                    a.revoked
                        ? "revoked"
                        : a.expires &&
                          new Date(
                              a.expires
                          ).getTime() <= now
                        ? "expired"
                        : "active"
            )
            .join();

    if (
        signature !==
        refreshAccessExpiry.signature
    ) {

        refreshAccessExpiry.signature =
            signature;

        if (
            currentView === "accesos" &&
            !$("modal").open
        ) {

            renderAccess();
        }
    }
}


function updatePermissionReview() {

    const form =
        $("grantForm");

    if (!form) return;

    const values =
        new FormData(form);

    const r =
        data.recipients.find(
            r =>
                r.id ===
                values.get("recipient")
        );

    const temporal =
        values.get("mode") ===
        "telemedicina";

    const hours =
        Number(
            values.get("hours") || 1
        );

    $("permissionReview").innerHTML = `

        <strong>
            ${esc(r.name)}
            ·
            ${esc(r.place)}
        </strong>

        <p>
            Podrá consultar tu ficha clínica
            y documentos. No podrá editar
            tus autorizaciones.
        </p>

        <span>

            ${
                temporal
                    ? "Acceso temporal durante " +
                      hours +
                      " hora(s). Vencimiento previsto: " +
                      dateTime(
                          new Date(
                              Date.now() +
                                  hours *
                                      3600000
                          ).toISOString()
                      )
                    : "Vigente hasta que revoques el permiso."
            }

        </span>
    `;
}


init();