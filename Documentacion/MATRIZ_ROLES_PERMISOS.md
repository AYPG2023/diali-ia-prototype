# Matriz de roles y permisos

Las restricciones se validan nuevamente dentro de `DialiStateMachine.transition`; ocultar un botón no se considera un control de seguridad. Auditor permanece en solo lectura. Administrador posee control total; Supervisor aprueba, asigna, ejecuta y supervisa; Analista procesa/corrige/indexa; Soporte opera tickets; Empleado y Cliente actúan únicamente sobre funciones y solicitudes autorizadas.

| Capacidad | Admin | Supervisor | Analista | Soporte | Empleado | Auditor | Cliente |
|---|---|---|---|---|---|---|---|
| Dashboard | CRUD | R | R | R | R | R | R |
| Asistente IA | CRUD | R | R | R | R | R | R |
| Documentos | CRUD | Revisar/integrar | Crear/corregir | Ver | Crear/ver | Ver | - |
| Automatizaciones | CRUD | Ver | - | - | - | Ver | - |
| Tickets | CRUD | CRUD | Crear/ver | CRUD | Crear/ver | Ver | Crear/ver propios |
| Analitica | CRUD | R | R | - | - | R | - |
| Conocimiento RAG | CRUD | Ver | Ver | - | Ver | Ver | - |
| Integraciones | CRUD | Ver | - | - | - | Ver | - |
| Administracion | CRUD | - | - | - | - | - | - |
| Auditoria | CRUD | Ver | - | - | - | Ver | - |

`R` significa consulta. La autorizacion definitiva debe ejecutarse en servidor con permisos por recurso, departamento, confidencialidad y tenant.

## Reglas de seguridad

- Un usuario inactivo no puede iniciar sesion.
- Las acciones restringidas no se renderizan y las transiciones invalidas se rechazan.
- Documentos financieros o confidenciales se limitan por rol y fuente RAG.
- Toda alta, cambio de estado, correccion, aprobacion, exportacion y cambio de usuario deja auditoria.
