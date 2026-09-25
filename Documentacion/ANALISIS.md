# Analisis de DIALI IA

> Actualización 2026-09: la lógica de estados se desacopló en un motor declarativo único. Cada transición valida estado origen, rol y campos requeridos, actualiza el historial de la entidad y crea un registro de auditoría. La UI consume esas reglas y LocalStorage conserva el estado demo.

## Problema

La operacion corporativa recibe informacion fragmentada en correos, contratos, facturas, reportes, audios y tickets. La ausencia de contexto unico genera respuestas lentas, reprocesos, errores de captura y baja visibilidad ejecutiva.

## Solucion propuesta

DIALI IA centraliza documentos, soporte, conocimiento, automatizaciones e indicadores en una experiencia operacional. El prototipo simula tres capacidades: RAG con evidencia para reducir alucinaciones, OCR/NLP para clasificar y extraer datos multimodales, y analitica predictiva para detectar riesgo, anomalias y acciones recomendadas.

## Arquitectura funcional

```text
Usuario -> SPA HTML/Tailwind/JavaScript -> Estado local persistente
                                      -> RBAC y validaciones
                                      -> Modulos: RAG, documentos, tickets, RPA, analitica
                                      -> Auditoria de cada transicion
```

La implementacion actual es un frontend demostrable sin backend. `data/seed.js` representa el contrato de datos y `assets/js/app.js` concentra el estado, las reglas de permisos, las transiciones y los adaptadores de renderizado. En produccion, esas responsabilidades deben separarse en API, servicio de identidad, bus de eventos, almacenamiento documental, motor RAG/vectorial y observabilidad.

## Decisiones de ingenieria

- RBAC declarativo: cada rol posee permisos y la interfaz oculta acciones no autorizadas.
- Maquina de estados: los cambios validan el estado actual contra una tabla de transiciones.
- Persistencia demo: `localStorage` permite probar flujos entre recargas sin inventar un backend.
- Seguridad de interfaz: salida HTML escapada, validacion de archivos, campos obligatorios y auditoria.
- Escalabilidad: colecciones de datos y vistas se procesan mediante funciones reutilizables, no por pantallas aisladas.

## Riesgos y evolucion

El prototipo no reemplaza controles server-side. Para una version real se requieren autenticacion OIDC/MFA, autorizacion en API, cifrado de objetos, antivirus, DLP, retencion legal, consentimiento de audio, aislamiento por tenant, evaluacion RAG, trazabilidad de prompts y colas idempotentes para RPA.
