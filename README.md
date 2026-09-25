# DIALI IA

Prototipo frontend corporativo con flujos controlados para documentos, RAG, tickets, automatizaciones, alertas y conversaciones.

## Ejecución

No requiere compilación. Ejecuta `python -m http.server 8000` desde la raíz y abre `http://localhost:8000`. La clave demo es `Diali2026!`; el selector incluye un usuario por rol. Para restaurar los datos, elimina `diali-ia-demo-v1` de LocalStorage.

## Arquitectura

- `assets/js/state-machine.js`: fuente única de transiciones, roles y precondiciones.
- `assets/js/app.js`: presentación, eventos, persistencia y simulaciones.
- `data/seed.js`: casos de demostración normales, de revisión y error.
- `assets/css/styles.css`: diseño responsive, estados, progreso y líneas de tiempo.
- `Documentacion/`: análisis, requisitos, permisos, diagramas y flujos.

Toda mutación de estado pasa por el motor central, vuelve a validar el rol y genera auditoría. LocalStorage solo corresponde al prototipo; producción requiere API, identidad y autorización en servidor.

## Simulaciones

OCR, NLP, embeddings, almacenamiento vectorial, LLM, audio, ERP/CRM, RPA, IP, SLA y predicción son simulados en el navegador.
