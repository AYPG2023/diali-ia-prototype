# Flujos y estados

## Documento

`Borrador -> Cargado -> En cola -> Procesando -> Procesado`.

Desde `Procesando` puede ocurrir `Requiere revision` o `Error`. Un documento revisado puede volver a procesarse, aprobarse o rechazarse. Solo un documento aprobado puede pasar a `Integrado al ERP/CRM`; despues puede archivarse.

## Ticket

`Nuevo -> Clasificado -> Asignado -> En atencion -> Resuelto -> Cerrado`.

Desde asignado o atendido se puede escalar o esperar al cliente. Un ticket resuelto o cerrado puede reabrirse si la respuesta es incompleta.

## Automatizacion

`Borrador -> Activa <-> Pausada`. Una activa pasa a `En ejecucion` y termina en `Completada` o `Fallida`. Una fallida puede reactivarse despues de corregir la integracion.

## Alerta

`Detectada -> En analisis -> Confirmada -> Accion recomendada -> Accion ejecutada -> Cerrada`.

Una alerta detectada o en analisis puede descartarse. La interfaz obliga a confirmar la senal antes de simular la ejecucion de una recomendacion.

## Eventos transversales

Cada transicion registra usuario, modulo, registro, estado anterior, estado nuevo, fecha, IP demo y resultado en auditoria. En produccion, los eventos deben ser idempotentes y procesarse con una cola durable.
