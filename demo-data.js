// Shared fictional baseline for both portals. No persistence or backend.
window.VIK_DEMO = {
  patients: [
    {
      id:"P001",
      rut:"00.000.001-0",
      name:"Ana Pérez",
      firstName:"Ana",
      lastName:"Pérez",
      initials:"AP",
      birthDate:"1980-05-14",
      sex:"Femenino",
      nationality:"Chilena",
      phone:"+56 9 0000 0001",
      email:"ana.perez@example.com",
      occupation:"Administrativa",
      healthSystem:"FONASA",
      blood:"O+",
      religion:"Testigo de Jehová",
      ethnicity:"No informada",
      emergencyContact:"María Pérez · +56 9 0000 0002",
      chronic:true,
      alert:true,
      allergies:[
        {name:"Penicilina",detail:"Reacción cutánea severa",critical:true}
      ],
      conditions:[
        {name:"Diabetes mellitus tipo 2",status:"Activa",since:"2021"},
        {name:"Hipertensión arterial",status:"Activa",since:"2023"}
      ],
      medications:[
        {name:"Metformina",dose:"850 mg",frequency:"2 veces al día",status:"Activo"},
        {name:"Losartán",dose:"50 mg",frequency:"1 vez al día",status:"Activo"}
      ],
      personalHistory:[
        {name:"Cirugía",detail:"Apendicectomía, 2010"},
        {name:"Tabaquismo",detail:"Niega consumo actual"}
      ],
      familyHistory:[
        {name:"Madre",detail:"Diabetes mellitus tipo 2"},
        {name:"Padre",detail:"Hipertensión arterial"}
      ],
      observations:[
        {title:"Control metabólico",detail:"Requiere controles periódicos de HbA1c."}
      ],
      decisions:{
        transfusion:"Rechaza transfusiones de sangre",
        resuscitation:"Sin directriz anticipada registrada",
        organDonation:"No informado"
      },
      preferences:[
        {title:"Convicción religiosa",detail:"Solicita considerar alternativas a transfusión cuando clínicamente corresponda."}
      ],
      consents:[
        {date:"2026-08-15",type:"Consentimiento informado",detail:"Procedimiento diagnóstico invasivo",place:"Clínica Central"}
      ],
      attentions:[
        {
          id:"A005",date:"2026-09-30T09:00",place:"CESFAM Norte",professional:"Dra. I. Fernández",
          reason:"Control de diabetes y revisión de tratamiento",
          anamnesis:"Paciente refiere adherencia parcial a indicaciones dietarias. Sin episodios recientes de hipoglicemia.",
          assessment:"Diabetes mellitus tipo 2 en control. Presión arterial dentro de rango esperado para control ambulatorio.",
          plan:"Mantener Metformina. Solicitar HbA1c. Reforzar medidas generales y control en 3 meses."
        },
        {
          id:"A003",date:"2026-08-15T11:30",place:"Clínica Central",professional:"Dr. Matías Soto",
          reason:"Evaluación por dolor abdominal",
          anamnesis:"Dolor abdominal de 24 horas de evolución, sin vómitos.",
          assessment:"Cuadro abdominal inespecífico. Se indican exámenes de laboratorio e imagen.",
          plan:"Solicitar hemograma y ecografía abdominal. Control según resultados."
        },
        {
          id:"A001",date:"2026-02-12T10:00",place:"CESFAM Sur",professional:"Dra. Paula Reyes",
          reason:"Control cardiovascular",
          anamnesis:"Sin dolor torácico. Refiere buena tolerancia a tratamiento antihipertensivo.",
          assessment:"Hipertensión arterial en seguimiento.",
          plan:"Mantener Losartán 50 mg y control periódico."
        }
      ]
    },
    {
      id:"P002",
      rut:"00.000.002-0",
      name:"Carlos Soto",
      firstName:"Carlos",
      lastName:"Soto",
      initials:"CS",
      birthDate:"1973-10-21",
      sex:"Masculino",
      nationality:"Chilena",
      phone:"+56 9 0000 0003",
      email:"carlos.soto@example.com",
      occupation:"Conductor",
      healthSystem:"FONASA",
      blood:"A+",
      religion:"No informada",
      ethnicity:"No informada",
      emergencyContact:"Paula Soto · +56 9 0000 0004",
      chronic:true,
      alert:false,
      allergies:[],
      conditions:[{name:"Hipertensión arterial",status:"Activa",since:"2019"}],
      medications:[{name:"Losartán",dose:"50 mg",frequency:"1 vez al día",status:"Activo"}],
      personalHistory:[{name:"Cirugía",detail:"Sin cirugías relevantes registradas"}],
      familyHistory:[{name:"Padre",detail:"Antecedente cardiovascular"}],
      observations:[],
      decisions:{transfusion:"Sin rechazo registrado",resuscitation:"Sin directriz anticipada registrada",organDonation:"No informado"},
      preferences:[],
      consents:[],
      attentions:[
        {
          id:"A006",date:"2026-09-30T10:30",place:"Clínica Central",professional:"Dr. Matías Soto",
          reason:"Seguimiento de hipertensión",
          anamnesis:"Sin síntomas cardiovasculares de alarma.",
          assessment:"Hipertensión arterial en seguimiento.",
          plan:"Continuar tratamiento y control de presión."
        },
        {
          id:"A002",date:"2026-07-02T09:15",place:"CESFAM Norte",professional:"Dra. I. Fernández",
          reason:"Control de presión arterial",
          anamnesis:"Refiere adherencia a tratamiento.",
          assessment:"Control ambulatorio.",
          plan:"Mantener Losartán."
        }
      ]
    },
    {
      id:"P003",
      rut:"00.000.003-0",
      name:"Camila Muñoz",
      firstName:"Camila",
      lastName:"Muñoz",
      initials:"CM",
      birthDate:"1994-03-08",
      sex:"Femenino",
      nationality:"Chilena",
      phone:"+56 9 0000 0005",
      email:"camila.munoz@example.com",
      occupation:"Estudiante",
      healthSystem:"ISAPRE",
      blood:"B-",
      religion:"No informada",
      ethnicity:"No informada",
      emergencyContact:"José Muñoz · +56 9 0000 0006",
      chronic:false,
      alert:false,
      allergies:[{name:"Ibuprofeno",detail:"Urticaria",critical:true}],
      conditions:[],
      medications:[],
      personalHistory:[],
      familyHistory:[],
      observations:[],
      decisions:{transfusion:"Sin rechazo registrado",resuscitation:"Sin directriz anticipada registrada",organDonation:"No informado"},
      preferences:[],
      consents:[],
      attentions:[
        {
          id:"A007",date:"2026-09-30T12:00",place:"Hospital Regional",professional:"Dra. Laura Mena",
          reason:"Consulta médica general",
          anamnesis:"Cefalea autolimitada, sin signos de alarma consignados.",
          assessment:"Cefalea inespecífica.",
          plan:"Manejo sintomático e indicaciones de consulta si aparecen signos de alarma."
        }
      ]
    },
    {
      id:"P004",
      rut:"00.000.004-0",
      name:"Diego Rojas",
      firstName:"Diego",
      lastName:"Rojas",
      initials:"DR",
      birthDate:"1988-12-01",
      sex:"Masculino",
      nationality:"Chilena",
      phone:"+56 9 0000 0007",
      email:"diego.rojas@example.com",
      occupation:"Docente",
      healthSystem:"FONASA",
      blood:"AB+",
      religion:"No informada",
      ethnicity:"No informada",
      emergencyContact:"Marcela Rojas · +56 9 0000 0008",
      chronic:true,
      alert:true,
      allergies:[{name:"Látex",detail:"Reacción cutánea",critical:true}],
      conditions:[{name:"Asma",status:"Activa",since:"2012"}],
      medications:[{name:"Salbutamol",dose:"100 mcg",frequency:"Según indicación",status:"Activo"}],
      personalHistory:[],
      familyHistory:[],
      observations:[{title:"Asma",detail:"Registrar exacerbaciones y respuesta a tratamiento."}],
      decisions:{transfusion:"Sin rechazo registrado",resuscitation:"Sin directriz anticipada registrada",organDonation:"No informado"},
      preferences:[],
      consents:[],
      attentions:[
        {
          id:"A008",date:"2026-10-01T08:30",place:"CESFAM Norte",professional:"Dra. I. Fernández",
          reason:"Control respiratorio",
          anamnesis:"Atención futura programada.",
          assessment:"Pendiente",
          plan:"Pendiente"
        }
      ]
    }
  ],
  appointments:[
    {patientId:"P001",date:"2026-09-30",time:"09:00",place:"CESFAM Norte",status:"pendiente",specialty:"general",reason:"Control de diabetes"},
    {patientId:"P002",date:"2026-09-30",time:"10:30",place:"Clínica Central",status:"pendiente",specialty:"cardiology",reason:"Seguimiento de hipertensión"},
    {patientId:"P003",date:"2026-09-30",time:"12:00",place:"Hospital Regional",status:"finalizada",specialty:"general",reason:"Consulta médica general"},
    {patientId:"P004",date:"2026-10-01",time:"08:30",place:"CESFAM Norte",status:"pendiente",specialty:"general",reason:"Control respiratorio"},
    {patientId:"P001",date:"2026-10-14",time:"09:20",place:"CESFAM Norte",status:"pendiente",specialty:"general",reason:"Control metabólico"},
    {patientId:"P002",date:"2026-10-22",time:"11:00",place:"Clínica Central",status:"pendiente",specialty:"cardiology",reason:"Control cardiovascular"}
  ],
  documents:[
    {id:"D001",patientId:"P001",name:"Hemograma completo",type:"Examen",date:"2026-09-29",place:"CESFAM Norte",attentionId:"A005"},
    {id:"D002",patientId:"P001",name:"Receta médica",type:"Receta",date:"2026-09-30",place:"CESFAM Norte",attentionId:"A005"},
    {id:"D003",patientId:"P001",name:"Ecografía abdominal",type:"Imagen",date:"2026-08-16",place:"Clínica Central",attentionId:"A003"},
    {id:"D004",patientId:"P001",name:"Informe de atención",type:"Informe",date:"2026-08-15",place:"Clínica Central",attentionId:"A003"},
    {id:"D005",patientId:"P002",name:"Electrocardiograma",type:"Examen",date:"2026-09-28",place:"Clínica Central",attentionId:"A006"},
    {id:"D006",patientId:"P002",name:"Receta antihipertensiva",type:"Receta",date:"2026-07-02",place:"CESFAM Norte",attentionId:"A002"},
    {id:"D007",patientId:"P003",name:"Informe médico",type:"Informe",date:"2026-09-25",place:"Hospital Regional",attentionId:"A007"},
    {id:"D008",patientId:"P004",name:"Espirometría previa",type:"Examen",date:"2026-06-10",place:"CESFAM Sur",attentionId:null}
  ]
};

// Relative dates keep the appointment demo useful when opened on another day.
(() => {
  const dateAt = days => { const d = new Date(); d.setDate(d.getDate() + days); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  VIK_DEMO.professionals = ['Dra. I. Fernández', 'Dr. Matías Soto', 'Dra. Paula Reyes', 'Dra. Laura Mena'];
  VIK_DEMO.appointments.forEach((a,i) => {
    a.id = `C${String(i+1).padStart(3,'0')}`;
    a.duration = 30;
    a.professional = a.patientId === 'P002' ? 'Dr. Matías Soto' : a.patientId === 'P003' ? 'Dra. Laura Mena' : 'Dra. I. Fernández';
    a.date = dateAt(i < 3 ? 0 : i === 3 ? 1 : i === 4 ? 4 : 12);
  });
  VIK_DEMO.appointments.push({id:'C007',patientId:'P001',date:dateAt(-10),time:'11:30',duration:30,place:'CESFAM Sur',professional:'Dra. Paula Reyes',status:'finalizada',specialty:'cardiology',reason:'Control cardiovascular'});
  VIK_DEMO.documents.push({id:'D009',patientId:'P001',name:'Consentimiento informado',type:'Otro',date:'2026-08-15',place:'Clínica Central',attentionId:'A003'});
  VIK_DEMO.documents.forEach(d => {
    const p = VIK_DEMO.patients.find(p => p.id === d.patientId);
    const attention = p.attentions.find(a => a.id === d.attentionId);
    d.issuer = attention?.professional || 'Equipo clínico · ' + d.place;
    d.summary = d.type === 'Receta' ? 'Tratamiento registrado en la atención asociada.' : d.type === 'Imagen' ? 'Referencia de estudio de imagen. El archivo original no está conectado.' : d.type === 'Examen' ? 'Referencia de examen. No se incluyen resultados de laboratorio en esta demo.' : 'Documento vinculado a la continuidad de atención.';
    if(d.type === 'Receta') d.prescription = p.medications.map(m => ({name:m.name,dose:m.dose,frequency:m.frequency,duration:'No consignada en esta demo'}));
  });
  VIK_DEMO.permissions = [
    {id:'G1',patientId:'P001',recipient:'R1',name:'Dra. I. Fernández',place:'CESFAM Norte',granted:'2026-09-30T09:00:00',mode:'presencial',expires:null,revoked:false,scope:'Ficha clínica y documentos'},
    {id:'G2',patientId:'P001',recipient:'R2',name:'Dr. Matías Soto',place:'Clínica Central',granted:'2026-08-15T11:30:00',mode:'presencial',expires:null,revoked:true,scope:'Ficha clínica y documentos'}
  ];
})();
