"use strict";

const $ = id => document.getElementById(id);

// =====================================================
// CONFIGURACIÓN API
// =====================================================

// La autenticación real no está habilitada en esta versión pública de demostración.


// =====================================================
// CONFIGURACIÓN DE ROLES
// =====================================================

let role = "doctor";

const config = {

  doctor: {
    label: "RUT",
    type: "text",
    placeholder: "00.000.000-0",
    help: "Ingresa tu RUT con dígito verificador.",
    context: "Acceso para profesionales autorizados de VIK Salud.",
    button: "Ingresar como doctor",
    destination: "../doctor/index.html"
  },

  paciente: {
    label: "RUT",
    type: "text",
    placeholder: "00.000.000-0",
    help: "Ingresa tu RUT con dígito verificador.",
    context: "Accede a tu ficha, documentos, citas y autorizaciones.",
    button: "Ingresar como paciente",
    destination: "../paciente/index.html"
  }

};


// =====================================================
// SELECCIONAR ROL
// =====================================================

function selectRole(nextRole) {

  role = nextRole;

  const c = config[role];

  document
    .querySelectorAll(".role-button")
    .forEach(button => {

      const active =
        button.dataset.role === role;

      button.classList.toggle(
        "active",
        active
      );

      button.setAttribute(
        "aria-selected",
        String(active)
      );

    });

  $("identifierLabel").textContent =
    c.label;

  $("identifier").type =
    c.type;

  $("identifier").placeholder =
    c.placeholder;

  $("identifier").value = "";

  $("identifierHelp").textContent =
    c.help;

  $("roleContext").lastElementChild.textContent =
    c.context;

  $("submitButton").textContent =
    c.button;

  $("loginError").textContent =
    "";

  $("identifier").focus();
}


// =====================================================
// VALIDAR RUT
// =====================================================

function validRut(value) {

  const rut = value
    .replace(/[.\-\s]/g, "")
    .toUpperCase();

  if (!/^\d{7,8}[0-9K]$/.test(rut)) {
    return false;
  }

  let sum = 0;
  let factor = 2;

  for (
    const digit of rut
      .slice(0, -1)
      .split("")
      .reverse()
  ) {

    sum += Number(digit) * factor;

    factor =
      factor === 7
        ? 2
        : factor + 1;
  }

  const dv =
    11 - (sum % 11);

  const expected =
    dv === 11
      ? "0"
      : dv === 10
        ? "K"
        : String(dv);

  return (
    rut.at(-1) === expected
  );
}


// =====================================================
// TOAST
// =====================================================

function toast(message) {

  $("toast").textContent =
    message;

  $("toast").hidden =
    false;

  clearTimeout(toast.timer);

  toast.timer =
    setTimeout(() => {

      $("toast").hidden =
        true;

    }, 3200);
}


// =====================================================
// CAMBIO DE ROL
// =====================================================

document
  .querySelectorAll(".role-button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        selectRole(
          button.dataset.role
        );

      }
    );

  });


// =====================================================
// MOSTRAR / OCULTAR CONTRASEÑA
// =====================================================

$("togglePassword").addEventListener(
  "click",
  () => {

    const input =
      $("password");

    const showing =
      input.type === "text";

    input.type =
      showing
        ? "password"
        : "text";

    $("togglePassword").textContent =
      showing
        ? "Ver"
        : "Ocultar";

    $("togglePassword").setAttribute(
      "aria-label",
      showing
        ? "Mostrar contraseña"
        : "Ocultar contraseña"
    );

  }
);


// =====================================================
// RECUPERAR CONTRASEÑA
// =====================================================

$("forgotPassword").addEventListener(
  "click",
  () => {

    toast(
      "La recuperación de contraseña se conectará al backend de VIK."
    );

  }
);


// =====================================================
// LOGIN
// =====================================================

$("loginForm").addEventListener("submit", event => {
  event.preventDefault();
  $("loginError").textContent =
    "El inicio de sesión real no está habilitado en esta demo. No ingreses credenciales reales; vuelve al inicio y usa los accesos de demostración.";
});


// =====================================================
// INICIAR LOGIN
// =====================================================

selectRole("doctor");