# Requerimientos

## Funcionales

1. Permitir acceso demo por rol con consentimiento y bloqueo temporal por intentos fallidos.
2. Mostrar dashboard con KPIs, actividad, alertas y graficas.
3. Consultar al asistente con respuesta fundamentada, confianza, fuente y escalamiento humano.
4. Cargar PDF, DOCX, XLSX, imagen, audio y correo, validando extension y tamano.
5. Gestionar documentos con filtros, detalle, correccion, reproceso, aprobacion e integracion.
6. Gestionar tickets con prioridad, SLA, clasificacion, asignacion, escalamiento, resolucion y reapertura.
7. Consultar automatizaciones, cambiar estados y simular ejecuciones.
8. Consultar analitica, confirmar o descartar alertas y ejecutar recomendaciones.
9. Administrar fuentes RAG, integraciones, usuarios y auditoria.
10. Persistir el estado demo en `localStorage` y permitir exportacion CSV.

## No funcionales

- HTML5 semantico, CSS utilitario Tailwind y JavaScript puro.
- Componentes pequenos, datos separados del renderizado y reglas declarativas.
- Interfaz responsive, iconos Lucide, mensajes de error y estados vacios.
- Salida escapada y validaciones de cliente como defensa de usabilidad, no como sustituto de backend.
- El objetivo de respuestas RAG es priorizar precision y evidencia; una baja confianza debe escalarse.
