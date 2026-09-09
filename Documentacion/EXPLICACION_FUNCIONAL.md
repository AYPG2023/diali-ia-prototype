# Explicacion funcional de DIALI IA

## 1. Que es DIALI IA

DIALI IA es un prototipo de una plataforma corporativa con asistente de inteligencia artificial para apoyar operaciones internas. La idea principal es centralizar documentos, tickets, conocimiento, automatizaciones, analitica, integraciones y auditoria en una sola aplicacion.

El sistema no es solo un chat. El asistente IA es una parte del sistema, pero necesita informacion organizada para responder bien. Por eso existen modulos como Documentos, Conocimiento RAG, Tickets, Automatizaciones e Integraciones.

En el prototipo actual todo corre en frontend:

- `index.html` contiene la estructura principal.
- `assets/js/app.js` contiene las pantallas, reglas, permisos, validaciones y acciones simuladas.
- `data/seed.js` contiene los datos de ejemplo.
- `localStorage` guarda temporalmente los cambios realizados en el navegador.

Esto significa que OCR, RAG, IA, ERP, CRM, colas y automatizaciones reales todavia no existen como backend. Estan simulados para mostrar como funcionaria la solucion.

## 2. Problema que resuelve

En una empresa normalmente la informacion esta separada:

- Facturas en correos.
- Contratos en carpetas o gestores documentales.
- Reportes en Excel o ERP.
- Reclamos en CRM.
- Audios de reuniones.
- Tickets de soporte.
- Politicas internas en documentos sueltos.

Cuando el usuario pregunta algo, la IA no deberia inventar respuestas. Necesita consultar fuentes autorizadas, encontrar evidencia y responder con confianza. DIALI IA propone ordenar esa informacion para que el asistente pueda usarla de forma controlada.

## 3. Solucion propuesta

La solucion consiste en separar el sistema en modulos con responsabilidades claras:

```text
Usuarios
  -> cargan documentos, crean tickets o consultan al asistente

Documentos
  -> recibe archivos, los valida, los clasifica y extrae datos

Conocimiento RAG
  -> convierte fuentes aprobadas en fragmentos consultables por IA

Asistente IA
  -> busca evidencia en las fuentes RAG y responde con nivel de confianza

Automatizaciones
  -> ejecutan acciones cuando se cumplen condiciones

Integraciones
  -> conectan con ERP, CRM, correo, almacenamiento documental y proveedor IA

Auditoria
  -> registra cambios, aprobaciones, correcciones y transiciones de estado
```

La clave es que el asistente no deberia consultar cualquier archivo directamente. Primero la informacion debe pasar por validacion, permisos, clasificacion, indexacion y control de confidencialidad.

## 4. Que hace el modulo de Documentos

El modulo de Documentos es el punto de entrada para archivos empresariales.

Sirve para cargar y controlar archivos como:

- PDF.
- DOCX.
- XLSX.
- Imagenes escaneadas.
- Audios.
- Correos `.eml`.

En el prototipo, el modulo permite:

- Registrar un documento nuevo.
- Validar extension y tamano.
- Asignar tipo de documento.
- Asignar confidencialidad.
- Guardar departamento, fecha, propietario y fuente.
- Ver el estado del documento.
- Ver datos extraidos simulados.
- Corregir extracciones.
- Aprobar documentos.
- Reintentar documentos con error.
- Exportar documentos a CSV.

Ejemplo de documento en `data/seed.js`:

```js
{
  name: "Factura F-8831.pdf",
  type: "Factura",
  status: "Requiere revision",
  confidence: 72,
  confidentiality: "Restringida",
  source: "Correo",
  extracted: {
    proveedor: "CloudOps",
    total: "$12,940",
    impuestos: "$1,553"
  }
}
```

Ese ejemplo representa una factura que fue procesada por IA/OCR, pero la confianza fue baja o media, por eso queda en revision humana.

## 5. Documentos no es exactamente el RAG

Esta es una confusion importante:

El modulo Documentos no es el RAG completo.

Documentos se encarga de recibir, clasificar, validar, procesar y aprobar archivos.

RAG se encarga de convertir conocimiento aprobado en fragmentos consultables para que el asistente pueda responder con evidencia.

La relacion seria asi:

```text
Archivo cargado
  -> modulo Documentos
  -> validacion de formato, tamano y metadatos
  -> OCR / extraccion / clasificacion IA
  -> revision humana si la confianza es baja
  -> aprobacion
  -> indexacion en Conocimiento RAG
  -> consulta desde Asistente IA
  -> respuesta con evidencia y confianza
```

Entonces, Documentos es la puerta de entrada y control. RAG es la capa que permite buscar dentro del conocimiento aprobado.

## 6. Que hace el Asistente IA

El Asistente IA simula un chat corporativo.

Su objetivo no es responder solo con conocimiento general, sino responder usando fuentes internas. En el prototipo, cuando el usuario pregunta por factura, contrato, ticket, SLA o politica, el sistema selecciona una fuente simulada:

- Facturas o finanzas -> `Reportes financieros`.
- Contratos -> `Contratos activos`.
- Tickets o SLA -> `Base soporte CRM`.
- Politicas -> `Politicas corporativas`.

Si encuentra una fuente relacionada, devuelve una respuesta con confianza alta simulada. Si no encuentra evidencia, responde que no tiene suficiente informacion y propone escalar a un humano.

Flujo simplificado:

```text
Usuario pregunta
  -> el asistente interpreta palabras clave
  -> selecciona una fuente de conocimiento
  -> calcula confianza simulada
  -> responde con evidencia
  -> si la confianza es baja, recomienda escalar
```

En una version real, este flujo deberia usar:

- Embeddings.
- Base vectorial.
- Busqueda semantica.
- Recuperacion de fragmentos.
- Control de permisos por usuario.
- Filtro por confidencialidad.
- Generacion de respuesta con citas.
- Evaluacion de confianza.
- Registro de prompts y respuestas.

## 7. Que es Conocimiento RAG

El modulo Conocimiento RAG representa las fuentes que ya estan listas para ser consultadas por el asistente.

En `data/seed.js` aparecen fuentes como:

- Politicas corporativas.
- Contratos activos.
- Base soporte CRM.
- Reportes financieros.
- FAQ clientes.

Cada fuente tiene:

- Cantidad de fragmentos indexados.
- Fecha de actualizacion.
- Estado de indexacion.
- Nivel de confidencialidad.
- Permisos.

Ejemplo:

```js
{
  name: "Contratos activos",
  indexed: 941,
  status: "Indexada",
  confidentiality: "Confidencial",
  permissions: "Admin, Supervisor, Analista"
}
```

Esto significa que esa fuente ya fue procesada para busqueda RAG, pero no todos los roles deberian poder consultarla.

## 8. Clasificacion automatica y categorias

Cuando mencionas que el sistema "divide las categorias automaticamente", eso corresponde a una funcion esperada de IA/OCR/NLP.

En una implementacion real, al cargar un documento, el sistema deberia detectar automaticamente cosas como:

- Si es factura, contrato, reporte, audio, correo o documento escaneado.
- Que departamento corresponde.
- Nivel de confidencialidad probable.
- Cliente o proveedor relacionado.
- Fechas importantes.
- Montos.
- Riesgo.
- Urgencia.
- Si requiere revision humana.

En el prototipo esa clasificacion esta simulada. El usuario todavia selecciona el tipo de documento en el formulario, y los datos extraidos vienen precargados en `data/seed.js`.

La solucion real seria:

```text
Documento subido
  -> servicio de almacenamiento
  -> antivirus / validacion
  -> OCR si es imagen o PDF escaneado
  -> transcripcion si es audio
  -> extraccion de entidades
  -> clasificacion automatica
  -> score de confianza
  -> revision humana si hace falta
  -> aprobacion
  -> indexacion RAG
```

## 9. Estados del modulo Documentos

Los documentos pasan por una maquina de estados. Esto evita que un documento salte pasos importantes.

Estados principales:

```text
Borrador
  -> Cargado
  -> En cola
  -> Procesando
  -> Procesado
  -> Aprobado
  -> Integrado al ERP/CRM
  -> Archivado
```

Tambien existen estados alternos:

```text
Procesando
  -> Requiere revision
  -> Error

Procesado
  -> Rechazado
  -> Requiere revision
```

Interpretacion:

- `Borrador`: todavia no esta listo.
- `Cargado`: el archivo entro al sistema.
- `En cola`: espera procesamiento.
- `Procesando`: IA/OCR/NLP estan trabajando.
- `Procesado`: ya se extrajeron datos.
- `Requiere revision`: un humano debe validar o corregir.
- `Error`: fallo el procesamiento.
- `Aprobado`: ya fue validado.
- `Integrado al ERP/CRM`: se envio a un sistema externo.
- `Archivado`: queda cerrado historicamente.

## 10. Que hacen las Automatizaciones

Las automatizaciones representan reglas tipo RPA o workflows.

Ejemplos del prototipo:

- Si una factura esta aprobada y tiene confianza mayor o igual a 85, crear cuenta por pagar en ERP.
- Si un ticket es critico, escalarlo a supervisor.
- Reindexar fuentes RAG de forma programada.
- Crear alerta cuando un contrato esta por vencer.
- Notificar auditoria si hay una anomalia financiera.

Relacion con documentos:

```text
Documento aprobado
  -> automatizacion detecta condicion
  -> envia datos al ERP/CRM
  -> registra auditoria
```

Relacion con RAG:

```text
Fuente activa
  -> automatizacion de indexacion nocturna
  -> reindexa fragmentos
  -> asistente consulta informacion actualizada
```

## 11. Que hacen los Tickets

El modulo Tickets funciona como mesa de ayuda.

Permite:

- Crear solicitudes.
- Clasificarlas.
- Asignarlas.
- Atenderlas.
- Escalarlas.
- Resolverlas.
- Cerrarlas.
- Reabrirlas.

La IA puede apoyar clasificando tickets o recomendando respuestas usando RAG.

Ejemplo:

```text
Cliente pregunta por una factura
  -> se crea ticket
  -> IA lo clasifica como facturacion
  -> soporte atiende
  -> asistente busca informacion en FAQ o reportes financieros
  -> se responde al cliente
```

## 12. Que hace Analitica

Analitica agrupa alertas, riesgos, anomalias y recomendaciones.

Ejemplos:

- Riesgo de fuga de cliente.
- Anomalia financiera.
- Incremento de tickets de facturacion.
- Automatizacion con baja tasa de exito.
- Documento financiero con baja confianza.

La idea es que la IA no solo responda preguntas, sino que tambien ayude a detectar problemas.

## 13. Que hacen Integraciones

Integraciones representa las conexiones con sistemas externos:

- ERP financiero.
- CRM corporativo.
- Correo Microsoft 365.
- Repositorio documental.
- Proveedor LLM.
- Webhook de auditoria.

En el prototipo solo se muestran estados simulados. En produccion, estas integraciones serian servicios reales con credenciales, cifrado, logs, reintentos y monitoreo.

## 14. Que hace Auditoria

Auditoria registra acciones importantes:

- Carga de documento.
- Correccion de extraccion.
- Aprobacion.
- Cambio de estado.
- Clasificacion de ticket.
- Escalamiento.
- Cambios de usuario.
- Reindexacion.

Esto es importante porque una solucion con IA debe ser trazable. Si la IA clasifica algo mal o un usuario aprueba una factura, debe quedar registro.

## 15. Roles y permisos

El sistema tiene roles:

- Admin.
- Supervisor.
- Analista.
- Soporte.
- Empleado.
- Auditor.
- Cliente.

Cada rol ve modulos y acciones diferentes.

Ejemplo:

- Admin puede ver y administrar todo.
- Supervisor puede revisar documentos e integrar.
- Analista puede crear y corregir documentos.
- Soporte trabaja principalmente tickets.
- Auditor revisa trazabilidad.
- Cliente solo ve funciones limitadas.

Esto es clave para RAG: el asistente debe responder solo con fuentes que el usuario tiene permiso de consultar.

## 16. Relacion completa entre modulos

```text
Usuarios
  -> usan la aplicacion segun su rol

Documentos
  -> recibe archivos y extrae datos
  -> puede generar revision, aprobacion o error
  -> alimenta fuentes internas despues de aprobarse

Conocimiento RAG
  -> contiene fuentes indexadas y permisos
  -> es consultado por el asistente

Asistente IA
  -> responde preguntas con evidencia
  -> puede escalar si no hay confianza
  -> puede apoyar tickets y operaciones

Tickets
  -> reciben solicitudes de usuarios o clientes
  -> pueden ser clasificados por IA
  -> pueden usar respuestas RAG

Automatizaciones
  -> reaccionan a eventos de documentos, tickets, alertas o fuentes RAG
  -> integran con ERP, CRM o webhooks

Analitica
  -> detecta riesgos y anomalias
  -> genera recomendaciones

Integraciones
  -> conectan con sistemas reales

Auditoria
  -> registra todo cambio importante
```

## 17. Que esta implementado y que esta simulado

Implementado en el prototipo:

- Login demo por rol.
- Navegacion por modulos.
- Permisos visuales por rol.
- Carga simulada de documentos.
- Validacion de archivos.
- Estados y transiciones.
- Correccion y aprobacion simulada.
- Chat IA simulado.
- Fuentes RAG simuladas.
- Tickets.
- Automatizaciones simuladas.
- Analitica simulada.
- Integraciones simuladas.
- Auditoria.
- Exportacion CSV.

Simulado o pendiente para produccion:

- Backend real.
- Base de datos.
- Autenticacion corporativa.
- OCR real.
- Transcripcion de audio real.
- NLP real.
- RAG real con embeddings.
- Base vectorial.
- Proveedor LLM real.
- Integracion real con ERP/CRM/correo.
- Almacenamiento documental.
- Colas de procesamiento.
- Antivirus y DLP.
- Cifrado y retencion legal.
- Observabilidad.

## 18. Respuesta corta a la duda principal

El modulo Documentos sirve para ingresar y controlar archivos empresariales. Ahi se cargan facturas, contratos, reportes, audios, correos o imagenes. El sistema deberia extraer datos, clasificarlos y calcular confianza.

El asistente IA no deberia leer cualquier archivo sin control. Primero los documentos deben procesarse, aprobarse e indexarse como conocimiento RAG. Luego el asistente consulta esas fuentes indexadas para responder con evidencia.

Las categorias automaticas pertenecen a la fase de procesamiento inteligente del documento: OCR, NLP, clasificacion y extraccion de datos. En este prototipo esa parte esta representada con datos de ejemplo y acciones simuladas.

La solucion completa es conectar estos modulos con backend real: almacenamiento, OCR, RAG, base vectorial, LLM, permisos, auditoria e integraciones empresariales.
