# Revisión de seguridad antes de publicar

## Medidas aplicadas a esta versión

- Se centralizaron los recursos compartidos en la raíz del proyecto para corregir rutas relativas.
- Se reemplazaron identificadores y datos de contacto de ejemplo por valores claramente sintéticos.
- Se retiró la URL del endpoint de autenticación de la copia pública.
- El formulario de login quedó deshabilitado: no envía credenciales.
- La demo se identifica como ficticia y no apta para uso clínico.

## Límites importantes

- Todo el conjunto de datos de demostración es descargable desde el navegador.
- `sessionStorage` no es un mecanismo de autenticación ni una barrera de seguridad.
- No se deben cargar datos reales de pacientes, incluso si se eliminan sus nombres.
- No se deben ingresar credenciales reales en la pantalla de login.

## Checklist del equipo antes de hacer público el repositorio

- [ ] Confirmar autorización de todos los integrantes y de quien corresponda por la institución o instancia del proyecto.
- [ ] Revisar cada archivo y el historial de Git por secretos, tokens, claves privadas, `.env`, ARN, nombres de buckets, IDs y endpoints internos.
- [ ] Confirmar que todos los registros de demostración son sintéticos y no se derivan de pacientes reales.
- [ ] Revisar imágenes, documentos, comentarios y capturas para eliminar datos personales o institucionales no autorizados.
- [ ] Confirmar qué partes del backend y de la arquitectura AWS se pueden divulgar.
- [ ] Elegir una licencia solo con autorización de quienes poseen los derechos del código.
