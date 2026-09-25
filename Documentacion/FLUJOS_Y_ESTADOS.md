# Flujos y estados

Las reglas ejecutables viven en `assets/js/state-machine.js`. La interfaz presenta transiciones autorizadas y el motor vuelve a validar rol, estado y requisitos antes de persistir.

## Documento

```mermaid
stateDiagram-v2
  Borrador --> Cargado
  Cargado --> EnCola
  EnCola --> Procesando
  Procesando --> Procesado: confianza >= 85
  Procesando --> RequiereRevision: confianza < 85
  Procesando --> Error
  Procesado --> Aprobado
  Procesado --> Rechazado
  RequiereRevision --> Aprobado
  RequiereRevision --> Rechazado
  Aprobado --> Integrado
  Integrado --> Archivado
  Error --> EnCola: reintento
```

## Ticket

```mermaid
stateDiagram-v2
  Nuevo --> Clasificado
  Clasificado --> Asignado
  Asignado --> EnAtencion
  EnAtencion --> EnEspera
  EnAtencion --> Escalado
  EnAtencion --> Resuelto
  EnEspera --> EnAtencion
  Escalado --> EnAtencion
  Resuelto --> Cerrado
  Resuelto --> Reabierto
  Reabierto --> EnAtencion
```

## Automatización, alerta y RAG

```mermaid
stateDiagram-v2
  Borrador --> Activa
  Activa --> Pausada
  Pausada --> Activa
  Activa --> EnEjecucion
  EnEjecucion --> Completada
  EnEjecucion --> Fallida
  Fallida --> Activa: reintento
  EnEjecucion --> Cancelada
```

```mermaid
stateDiagram-v2
  Detectada --> EnAnalisis
  EnAnalisis --> Confirmada
  EnAnalisis --> Descartada
  Confirmada --> AccionRecomendada
  AccionRecomendada --> AccionEjecutada
  AccionEjecutada --> Cerrada
```

```mermaid
stateDiagram-v2
  Pendiente --> Indexando
  Indexando --> Indexada
  Indexando --> ErrorIndexacion
  ErrorIndexacion --> Indexando: reintento
  Indexada --> Indexando: reindexar
  Indexada --> Desactivada
  Desactivada --> Pendiente
```

## Transiciones críticas

| Transición | Rol | Condición | Resultado |
|---|---|---|---|
| Documento → Aprobado/Rechazado | Supervisor, Administrador | Procesado/revisión; rechazo con motivo | Historial y auditoría |
| Documento → Integrado | Supervisor, Administrador | Aprobado | Integración simulada |
| Ticket → Asignado | Soporte, Supervisor, Administrador | Responsable obligatorio | Responsable persistido |
| Ticket → Escalado/Resuelto | Soporte, Supervisor, Administrador | Motivo/solución | Historial actualizado |
| Automatización → En ejecución | Supervisor, Administrador | Activa | Ejecución e indicador |
| Alerta → Confirmada/Descartada | Supervisor, Administrador | Responsable/justificación | Evidencia trazable |
| Fuente → Indexando | Analista, Supervisor, Administrador | Pendiente, indexada o error | Progreso y fragmentos |

## Diagrama de clases

```mermaid
classDiagram
  Usuario "*" --> "1" Rol
  Rol "*" --> "*" Permiso
  Documento "1" --> "*" HistorialDocumento
  Usuario --> Documento
  Usuario --> Ticket
  Automatizacion "1" --> "*" EjecucionAutomatizacion
  FuenteConocimiento --> Conversacion
  Usuario --> Conversacion
  Usuario --> Alerta
  Usuario --> RegistroAuditoria
  Documento --> RegistroAuditoria
  Ticket --> RegistroAuditoria
  class Usuario { id; nombre; rol }
  class Rol { clave; nombre }
  class Permiso { recurso; accion }
  class Documento { estado; confianza; confidencialidad }
  class HistorialDocumento { anterior; nuevo; fecha }
  class Ticket { estado; prioridad; sla; responsable }
  class Automatizacion { estado; ejecuciones; exito }
  class EjecucionAutomatizacion { resultado; error; fecha }
  class FuenteConocimiento { estado; fragmentos; permisos }
  class Conversacion { estado; confianza; fuente }
  class Alerta { estado; riesgo; evidencia }
  class RegistroAuditoria { usuario; rol; accion; anterior; nuevo; resultado; ip }
```
