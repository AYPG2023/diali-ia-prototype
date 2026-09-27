# DIALI IA

Prototipo de una plataforma corporativa que centraliza documentos, conocimiento, asistencia con IA, tickets, automatizaciones, analítica y auditoría. Su objetivo es mostrar cómo una empresa puede procesar información de distintas fuentes, aplicar controles por rol y usar inteligencia artificial con evidencia autorizada.

> **Importante:** es un prototipo académico ejecutado completamente en el navegador. La IA, OCR, RAG, predicciones e integraciones empresariales están simuladas; no existe backend ni conexión real con sistemas externos.

## 1. Idea general del sistema

```text
Usuario autenticado
        |
        v
Documentos / Tickets / Consultas
        |
        v
Validación de rol, datos y estado
        |
        +--------------------+
        |                    |
        v                    v
Procesamiento IA       Conocimiento RAG
(OCR/NLP simulado)     (fuentes indexadas)
        |                    |
        v                    v
Revisión y aprobación  Asistente con evidencia
        |                    |
        +----------+---------+
                   v
       Automatizaciones e integraciones
                   |
                   v
          Auditoría y analítica
```

Cada acción importante valida el rol y el estado actual del registro. Si es válida, actualiza los datos guardados en el navegador y genera una entrada de auditoría. Si no es válida, se rechaza y también queda registrada.

## 2. Módulos y dependencias funcionales

| Módulo | ¿Qué hace? | Funciones principales | ¿De qué depende? | ¿A qué módulos alimenta? |
|---|---|---|---|---|
| **Acceso** | Simula la autenticación y selecciona el perfil de trabajo. | Login demo, consentimiento, bloqueo por intentos fallidos, cambio de rol y cierre/expiración de sesión. | Usuarios precargados, contraseña demo y permisos RBAC. | Todos los módulos, porque define lo que el usuario puede ver y ejecutar. |
| **Resumen / Dashboard** | Presenta el estado general de la operación. | KPIs, gráficas, pendientes y actividad reciente. | Documentos, tickets, automatizaciones, alertas y auditoría. | Apoya la toma de decisiones y dirige al usuario a otros módulos. |
| **Asistente IA** | Simula consultas corporativas fundamentadas en fuentes internas. | Chat, fuente, confianza, evidencia, adjuntos/audio simulados y escalamiento humano. | Acceso, fuentes RAG indexadas, permisos de fuente y palabras clave. | Auditoría y soporte humano cuando no existe evidencia suficiente. |
| **Documentos** | Recibe y controla información empresarial multimodal. | Carga, validación, filtros, extracción simulada, corrección, aprobación, rechazo, integración, archivo y CSV. | Permisos, máquina de estados, archivo válido y metadatos. | RAG, ERP/CRM, automatizaciones, analítica y auditoría. |
| **Automatizaciones** | Representa reglas de negocio o flujos RPA. | Activar, pausar, ejecutar, reintentar, completar y consultar historial. | Eventos o condiciones de documentos, tickets, alertas y fuentes; rol autorizado. | Integraciones, auditoría y actualización de procesos. |
| **Tickets** | Funciona como mesa de ayuda para empleados y clientes. | Crear, clasificar, asignar, atender, esperar, escalar, resolver, cerrar y reabrir. | Solicitante, prioridad, responsable, SLA simulado y máquina de estados. | Asistente, analítica, automatizaciones y auditoría. |
| **Analítica** | Simula detección de riesgos, anomalías y oportunidades. | KPIs, gráfica, análisis, confirmación, descarte, recomendación, ejecución y CSV. | Datos operativos simulados, rol y máquina de estados. | Automatizaciones, supervisión y auditoría. |
| **Conocimiento RAG** | Administra las fuentes que puede consultar el asistente. | Fragmentos, confidencialidad, permisos, estado, indexación y reindexación. | Documentos aprobados o fuentes corporativas, permisos e indexación. | Asistente IA y automatización de indexación. |
| **Integraciones** | Muestra la salud de conexiones externas. | Estado, última sincronización, cifrado y prueba simulada. | ERP, CRM, correo, repositorio, proveedor LLM y webhooks simulados. | Documentos, automatizaciones y auditoría. |
| **Administración** | Gestiona usuarios y accesos. | Crear usuario, asignar rol y activar/desactivar. | Rol Administrador y catálogo de roles. | Acceso y permisos de toda la aplicación. |
| **Auditoría** | Da trazabilidad a la operación. | Actor, rol, acción, módulo, transición, motivo, fecha, IP, resultado y CSV. | Todas las mutaciones realizadas en los demás módulos. | Supervisión, cumplimiento y análisis de incidentes. |
| **Mi perfil** | Presenta la cuenta activa y sus preferencias. | Datos, zona horaria, contraseña y notificaciones simuladas. | Usuario autenticado. | Configuración personal de la experiencia. |

## 3. Cómo se relacionan los módulos

### De un documento a una respuesta de IA

```text
1. El usuario carga un PDF, DOCX, XLSX, imagen, audio o correo.
2. Documentos valida extensión, tamaño máximo de 8 MB y metadatos.
3. Se simulan OCR, transcripción, clasificación y extracción de datos.
4. Si la confianza es baja, pasa a revisión humana.
5. Un Supervisor o Administrador aprueba o rechaza el resultado.
6. La información aprobada puede integrarse con ERP/CRM.
7. Al indexarse como fuente RAG, queda disponible para el Asistente IA.
8. El asistente solo usa la fuente si está indexada y el rol tiene permiso.
9. Cada cambio se registra en Auditoría.
```

**Diferencia clave:** Documentos controla el ingreso, procesamiento y aprobación de archivos. Conocimiento RAG prepara fuentes consultables. El Asistente IA usa esas fuentes para responder; no debería leer cualquier archivo sin control previo.

### Flujo de soporte

```text
Solicitud -> Ticket nuevo -> Clasificación -> Asignación -> Atención
                                                    |
                            +-----------------------+------------------+
                            v                       v                  v
                    Espera del cliente         Escalamiento       Resolución
                                                                       |
                                                                       v
                                                                 Cierre/Reapertura
```

El asistente puede buscar una respuesta en el conocimiento corporativo. Si no existe una fuente autorizada o la confianza es baja, la consulta se escala a una persona.

### Automatización y analítica

Las alertas detectan señales como riesgo de fuga, anomalías financieras o problemas de SLA. Un responsable analiza y confirma la señal antes de ejecutar una recomendación. Las automatizaciones representan la acción posterior: enviar una factura aprobada al ERP, escalar un ticket crítico o reindexar fuentes RAG.

## 4. Estados y reglas principales

Las transiciones se controlan desde `assets/js/state-machine.js`; la interfaz no cambia estados libremente.

### Documentos

```text
Borrador -> Cargado -> En cola -> Procesando -> Procesado -> Aprobado
                                      |              |           |
                                      |              v           v
                                      |          Rechazado    Integrado al ERP/CRM -> Archivado
                                      +-> Requiere revisión -> Aprobado/Rechazado
                                      +-> Error -> En cola (reintento)
```

- Rechazar exige un motivo y solo un documento aprobado se puede integrar.
- Administrador y Supervisor aprueban o rechazan.
- Administrador, Supervisor y Analista procesan o reintentan.

### Tickets

```text
Nuevo -> Clasificado -> Asignado -> En atención -> Resuelto -> Cerrado
                                      |    |            |
                                      |    |            +-> Reabierto -> En atención
                                      |    +-> Escalado -> En atención
                                      +-> En espera del cliente -> En atención
```

Asignar exige responsable, escalar exige motivo y resolver exige documentar la solución. Administrador, Supervisor y Soporte gestionan la atención.

### Automatizaciones

```text
Borrador -> Activa <-> Pausada
              |
              v
        En ejecución -> Completada
              |
              +-> Fallida -> Activa (reintento)
              +-> Cancelada
```

### Alertas analíticas

```text
Detectada -> En análisis -> Confirmada -> Acción recomendada
                 |                              |
                 v                              v
             Descartada                  Acción ejecutada -> Cerrada
```

Confirmar requiere responsable, descartar requiere justificación y ejecutar requiere confirmación explícita.

### Fuentes RAG

```text
Pendiente -> Indexando -> Indexada
                |            |
                v            +-> Indexando (reindexación)
       Error de indexación    +-> Desactivada -> Pendiente
                |
                +-> Indexando (reintento)
```

## 5. Roles y acceso

| Rol | Responsabilidad principal | Acceso destacado |
|---|---|---|
| **Administrador** | Control total. | Todos los módulos, usuarios y transiciones. |
| **Supervisor** | Revisión y control operativo. | Aprueba documentos, gestiona tickets, alertas y automatizaciones; consulta auditoría. |
| **Analista** | Procesamiento y análisis. | Carga/corrige documentos, analiza alertas e indexa conocimiento. |
| **Soporte** | Atención de solicitudes. | Gestiona tickets y consulta documentos/asistente. |
| **Empleado** | Operación interna. | Carga documentos, crea tickets y consulta fuentes permitidas. |
| **Auditor** | Supervisión en lectura. | Consulta documentos, analítica, integraciones y auditoría. |
| **Cliente** | Autoservicio externo limitado. | Asistente, perfil y tickets propios. |

Los permisos ocultan opciones y vuelven a validarse en el motor de estados. En producción, la autorización definitiva debe ejecutarse en el servidor.

## 6. Arquitectura técnica

```text
index.html
  ├── Tailwind CSS (CDN) .......... utilidades visuales
  ├── Chart.js (CDN) .............. gráficas
  ├── Lucide (CDN) ................ iconos
  ├── data/seed.js ................ datos iniciales
  ├── assets/js/state-machine.js .. reglas, roles y transiciones
  └── assets/js/app.js ............ vistas, eventos y persistencia
           |
           v
      localStorage del navegador
```

| Archivo o carpeta | Responsabilidad |
|---|---|
| `index.html` | Estructura del login y la aplicación; carga dependencias en el orden requerido. |
| `assets/js/state-machine.js` | Reglas para documentos, tickets, automatizaciones, alertas, conocimiento y conversaciones. |
| `assets/js/app.js` | Vistas, eventos, filtros, formularios, simulaciones, permisos y persistencia. |
| `data/seed.js` | Usuarios y casos de demostración de todos los módulos. |
| `assets/css/styles.css` | Diseño responsive, tablas, estados, formularios, paneles y líneas de tiempo. |
| `assets/login.jpg` | Imagen de la pantalla de acceso. |
| `Documentacion/` | Análisis, requisitos, permisos, flujos y diagrama de clases. |

### Dependencias externas

- **Tailwind CSS:** estilos utilitarios desde CDN.
- **Chart.js:** gráficas del Dashboard y Analítica.
- **Lucide:** iconografía.
- **Navegador moderno:** JavaScript, `localStorage`, Blob y descarga CSV.

No utiliza Node.js, framework frontend, base de datos ni API para ejecutarse.

## 7. Persistencia y seguridad del prototipo

- La clave demo es `Diali2026!` para todos los usuarios.
- Los datos iniciales se clonan desde `window.DIALI_SEED`.
- Los cambios se guardan en `localStorage` con la clave `diali-ia-demo-v1`.
- La salida dinámica se escapa para reducir inyección de HTML en la interfaz.
- Se validan archivos, campos obligatorios, roles y transiciones.
- IP, cifrado, bloqueo, expiración y autenticación son representaciones visuales, no controles productivos.

Para restaurar los datos originales, elimina `diali-ia-demo-v1` del almacenamiento local del navegador y recarga la página.

## 8. Ejecución

No requiere compilación. Desde la raíz ejecuta:

```powershell
python -m http.server 8000
```

Abre `http://localhost:8000`, selecciona cualquier usuario demo y usa:

```text
Diali2026!
```

Se recomienda usar un servidor HTTP local; abrir `index.html` directamente puede producir diferencias entre navegadores.

## 9. Guion sugerido para la presentación

Una demostración de 8 a 10 minutos puede seguir este orden:

1. **Problema:** información dispersa entre documentos, correos, ERP, CRM y tickets.
2. **Solución:** DIALI IA centraliza la información y controla cómo la IA la utiliza.
3. **Roles:** inicia como Administrador y muestra que el menú cambia según el perfil.
4. **Dashboard:** explica indicadores, riesgos y pendientes.
5. **Documentos:** carga un archivo y explica OCR/NLP, confianza y revisión humana.
6. **RAG:** enseña que solo fuentes indexadas y autorizadas alimentan al asistente.
7. **Asistente:** pregunta por una factura o política y muestra fuente/confianza; luego consulta algo sin evidencia para demostrar el escalamiento.
8. **Tickets:** crea una solicitud y explica clasificación, asignación, SLA y resolución.
9. **Analítica y automatizaciones:** muestra cómo una alerta confirmada puede generar una acción controlada.
10. **Auditoría:** cierra mostrando que cada transición conserva actor, fecha y resultado.

> **Mensaje central:** DIALI IA no es un chat aislado. Es una plataforma operativa donde los documentos se validan, el conocimiento se autoriza, la IA responde con evidencia, los procesos siguen estados controlados y las decisiones quedan auditadas.

## 10. Implementado frente a simulado

### Implementado en el navegador

- Login y navegación por rol.
- Vistas responsive, formularios, filtros, modales y gráficas.
- Máquina de estados y validación de transiciones.
- Carga y validación local de archivos.
- Permisos visuales y validación funcional por rol.
- Historial, auditoría, exportación CSV y `localStorage`.
- Respuestas, confianza y procesamiento temporizado de demostración.

### Simulado o pendiente para producción

- Autenticación corporativa, MFA, backend, API y base de datos.
- Almacenamiento, antivirus, DLP, cifrado real y retención legal.
- OCR, transcripción, NLP y extracción reales.
- Embeddings, base vectorial, recuperación RAG y proveedor LLM.
- ERP, CRM, correo, webhooks, RPA, colas y monitoreo reales.
- Modelos predictivos, evaluación de calidad y trazabilidad de prompts.

## 11. Documentación complementaria

- `Documentacion/EXPLICACION_FUNCIONAL.md`: propósito y módulos en detalle.
- `Documentacion/FLUJOS_Y_ESTADOS.md`: diagramas y transiciones críticas.
- `Documentacion/MATRIZ_ROLES_PERMISOS.md`: capacidades por perfil.
- `Documentacion/REQUERIMIENTOS.md`: criterios funcionales y no funcionales.
- `Documentacion/ANALISIS.md`: arquitectura, decisiones y riesgos.
- `Documentacion/Diagrama_clases/DIAGRAMA_CLASES.drawio.xml`: diagrama editable en draw.io.

---

**Conclusión:** el prototipo demuestra el ciclo completo de la información corporativa: ingreso, procesamiento, revisión, consulta con IA, acción operativa e historial auditable. Para convertirlo en producto, la interfaz debe conectarse a servicios seguros de identidad, datos, IA e integración empresarial.
