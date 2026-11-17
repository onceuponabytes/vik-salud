# Arquitectura de la demo web

## Alcance de este repositorio

Esta versión representa únicamente la capa web demostrativa de VIK Salud. Contiene dos portales estáticos y un conjunto compartido de datos ficticios que se carga en el navegador.

## Flujo de la demo

```text
Navegador
   |
   v
index.html (selector de experiencia)
   |-------------------------------|
   v                               v
demo-paciente.html              doctor/index.html
   |                               |
   v                               v
paciente/index.html              Portal profesional
   |                               |
   +---------- demo-data.js ------+
                 |
                 v
       Estado local del navegador
```

## Persistencia y autenticación

- Los datos de ejemplo se cargan desde `demo-data.js`.
- Las operaciones demostrativas se realizan en memoria del navegador.
- La identidad del portal de paciente se establece en `sessionStorage` únicamente para facilitar la navegación de la demo.
- No existe autenticación real, autorización de usuarios ni persistencia en servidor en esta publicación.

## Componentes no incluidos

El ZIP web no contiene las funciones AWS Lambda, la infraestructura cloud ni los scripts de PostgreSQL. Por lo tanto, esta documentación no afirma una arquitectura AWS de producción. Esa sección debe completarse cuando se incorpore y revise el backend original.
