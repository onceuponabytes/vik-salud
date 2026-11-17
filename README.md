# VIK Salud

**Prototipo web colaborativo para explorar una experiencia digital de salud desde los portales de paciente y profesional.**

> Esta publicación contiene una demostración estática con datos ficticios. No es un sistema clínico, no autentica usuarios y no debe utilizarse para atención ni decisiones médicas.

## Demo

- **Inicio de la demostración:** abre `index.html` o visita el sitio publicado con GitHub Pages.
- **Portal del paciente:** acceso desde el botón correspondiente en la página de inicio.
- **Portal profesional:** acceso desde el botón correspondiente en la página de inicio.

La demostración funciona en el navegador con un conjunto de datos de ejemplo. Los cambios son locales y se pierden al recargar. No se requiere AWS para recorrer estos dos portales.

## Funcionalidades visibles

### Portal del paciente

- Vista de ficha y resumen de salud.
- Consulta de documentos y citas de demostración.
- Gestión visual de autorizaciones y accesos.
- Vistas de QR de emergencia y SafeMed.

### Portal profesional

- Panel de jornada clínica.
- Búsqueda y consulta de fichas de demostración.
- Agenda y gestión visual de citas.
- Consulta y previsualización de documentos.

## Tecnologías presentes en esta versión

- HTML5
- CSS3
- JavaScript (vanilla)
- `sessionStorage` para mantener la identidad ficticia de la demo del paciente

## Estructura

```text
vik-salud/
├── index.html              # Inicio de la demo
├── demo-paciente.html      # Entrada al portal paciente con identidad ficticia
├── demo.css
├── demo-data.js            # Datos sintéticos compartidos
├── document-ui.js          # Componentes de previsualización documental
├── vik-theme.css           # Tema compartido
├── vik-theme.js
├── paciente/               # Portal del paciente
├── doctor/                 # Portal profesional
├── login/                  # Pantalla de acceso (autenticación deshabilitada en esta demo)
└── docs/
    ├── architecture.md
    └── security.md
```

## Ejecutar localmente

Desde la carpeta raíz del proyecto:

```bash
python -m http.server 8000
```

Luego abre `http://localhost:8000`.

También puedes abrir `index.html` directamente, pero se recomienda usar un servidor local para evitar restricciones del navegador con algunos recursos.

## Publicar la demo con GitHub Pages

1. Sube esta carpeta a un repositorio GitHub después de contar con la autorización del equipo.
2. En el repositorio, abre **Settings → Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch**.
4. Selecciona la rama principal y la carpeta `/ (root)`.
5. Guarda y espera a que GitHub Pages entregue la URL.

## Alcance y backend

Este ZIP contiene los portales web y su modo de demostración. **No incluye el código del backend, funciones AWS Lambda, infraestructura ni scripts de base de datos.** La pantalla de login se conserva como referencia visual, pero el envío de credenciales está deshabilitado en esta versión pública para evitar enviar datos a un servicio externo. No ingreses contraseñas reales.

Antes de documentar o publicar la arquitectura AWS completa, se debe integrar y revisar el repositorio del backend y confirmar qué servicios y configuraciones están autorizados para divulgarse.

## Créditos y colaboración

VIK Salud fue desarrollado como proyecto colaborativo. La descripción de contribuciones individuales debe completarse de acuerdo con el trabajo realizado por cada integrante y con la autorización del equipo.

## Seguridad y privacidad

Consulta [`docs/security.md`](docs/security.md) antes de publicar. No agregues datos reales de pacientes, credenciales, archivos `.env`, claves, tokens ni configuraciones privadas.
