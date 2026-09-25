(function (global) {
  "use strict";

  const RULES = Object.freeze({
    documents: {
      module: "Documentos",
      roles: {
        queue: ["admin", "analyst", "employee"], process: ["admin", "analyst"], approve: ["admin", "supervisor"],
        reject: ["admin", "supervisor"], integrate: ["admin", "supervisor"], archive: ["admin"], retry: ["admin", "analyst"]
      },
      transitions: {
        Borrador: { Cargado: "queue" }, Cargado: { "En cola": "queue" }, "En cola": { Procesando: "process" },
        Procesando: { Procesado: "process", "Requiere revision": "process", Error: "process" },
        Procesado: { Aprobado: "approve", Rechazado: "reject" },
        "Requiere revision": { Aprobado: "approve", Rechazado: "reject", Procesando: "process" },
        Aprobado: { "Integrado al ERP/CRM": "integrate" }, "Integrado al ERP/CRM": { Archivado: "archive" },
        Error: { "En cola": "retry" }
      },
      validate({ record, to, context }) {
        if (to === "Rechazado" && !context.reason) return "Indica el motivo del rechazo.";
        if (to === "Integrado al ERP/CRM" && record.status !== "Aprobado") return "Solo se integran documentos aprobados.";
        return "";
      }
    },
    tickets: {
      module: "Tickets",
      roles: { classify: ["admin", "supervisor", "support", "analyst", "employee", "client"], assign: ["admin", "supervisor", "support"], attend: ["admin", "supervisor", "support"], wait: ["admin", "supervisor", "support"], escalate: ["admin", "supervisor", "support"], resolve: ["admin", "supervisor", "support"], close: ["admin", "supervisor", "support"], reopen: ["admin", "supervisor", "support", "client"] },
      transitions: {
        Nuevo: { Clasificado: "classify" }, Clasificado: { Asignado: "assign" }, Asignado: { "En atencion": "attend" },
        "En atencion": { "En espera del cliente": "wait", Escalado: "escalate", Resuelto: "resolve" },
        "En espera del cliente": { "En atencion": "attend" }, Escalado: { "En atencion": "attend" },
        Resuelto: { Cerrado: "close", Reabierto: "reopen" }, Reabierto: { "En atencion": "attend" }
      },
      validate({ record, to, context }) {
        if (to === "Asignado" && !context.owner && (!record.owner || record.owner === "Sin asignar")) return "Selecciona un responsable.";
        if (to === "Escalado" && !context.reason) return "Indica el motivo del escalamiento.";
        if (to === "Resuelto" && !context.solution) return "Documenta la solucion aplicada.";
        return "";
      }
    },
    automations: {
      module: "Automatizaciones",
      roles: { activate: ["admin", "supervisor"], pause: ["admin", "supervisor"], run: ["admin", "supervisor"], finish: ["admin", "supervisor"], fail: ["admin", "supervisor"], retry: ["admin", "supervisor"], cancel: ["admin", "supervisor"] },
      transitions: {
        Borrador: { Activa: "activate", Cancelada: "cancel" }, Activa: { Pausada: "pause", "En ejecucion": "run", Cancelada: "cancel" },
        Pausada: { Activa: "activate", Cancelada: "cancel" }, "En ejecucion": { Completada: "finish", Fallida: "fail", Cancelada: "cancel" },
        Completada: { Activa: "activate" }, Fallida: { Activa: "retry", Cancelada: "cancel" }, Cancelada: {}
      }
    },
    alerts: {
      module: "Analitica",
      roles: { analyze: ["admin", "supervisor", "analyst"], confirm: ["admin", "supervisor"], discard: ["admin", "supervisor"], recommend: ["admin", "supervisor", "analyst"], execute: ["admin", "supervisor"], close: ["admin", "supervisor"] },
      transitions: {
        Detectada: { "En analisis": "analyze" }, "En analisis": { Confirmada: "confirm", Descartada: "discard" },
        Confirmada: { "Accion recomendada": "recommend" }, "Accion recomendada": { "Accion ejecutada": "execute" },
        "Accion ejecutada": { Cerrada: "close" }, Descartada: {}, Cerrada: {}
      },
      validate({ to, context }) {
        if (to === "Descartada" && !context.reason) return "Indica la justificacion del descarte.";
        if (to === "Confirmada" && !context.owner) return "Selecciona al responsable de la alerta.";
        if (to === "Accion ejecutada" && !context.confirmed) return "Confirma la ejecucion de la accion recomendada.";
        return "";
      }
    },
    knowledge: {
      module: "Conocimiento",
      roles: { index: ["admin", "supervisor", "analyst"], finish: ["admin", "supervisor", "analyst"], fail: ["admin", "supervisor", "analyst"], retry: ["admin", "supervisor", "analyst"], disable: ["admin", "supervisor"], enable: ["admin", "supervisor"] },
      transitions: {
        Pendiente: { Indexando: "index", Desactivada: "disable" }, Indexando: { Indexada: "finish", "Error de indexacion": "fail" },
        Indexada: { Indexando: "index", Desactivada: "disable" }, "Error de indexacion": { Indexando: "retry", Desactivada: "disable" },
        Desactivada: { Pendiente: "enable" }
      },
      validate({ to, context }) {
        if (to === "Desactivada" && !context.confirmed) return "Confirma que deseas desactivar la fuente.";
        return "";
      }
    },
    conversations: {
      module: "Asistente",
      roles: { escalate: ["admin", "supervisor", "analyst", "support", "employee", "client"], resolve: ["admin", "supervisor", "analyst", "support"], close: ["admin", "supervisor", "support"] },
      transitions: { Activa: { "Escalada a agente humano": "escalate", Resuelta: "resolve" }, "Escalada a agente humano": { Resuelta: "resolve" }, Resuelta: { Cerrada: "close" }, Cerrada: {} },
      validate({ to, context }) { return to === "Resuelta" && !context.solution ? "Documenta la respuesta o solucion." : ""; }
    }
  });

  function allowed(entity, record, role) {
    const rule = RULES[entity];
    if (!rule || !record) return [];
    return Object.entries(rule.transitions[record.status] || {}).filter(([, action]) => (rule.roles[action] || []).includes(role)).map(([status]) => status);
  }

  function transition({ entity, record, to, actor, context = {}, audit }) {
    const rule = RULES[entity];
    if (!rule || !record) return { ok: false, message: "Entidad o registro inexistente." };
    const action = rule.transitions[record.status]?.[to];
    if (!action) return { ok: false, message: `Transicion no permitida: ${record.status} → ${to}.` };
    if (!(rule.roles[action] || []).includes(actor?.role)) return { ok: false, message: "Tu rol no esta autorizado para esta accion." };
    const message = rule.validate?.({ record, to, context, actor }) || "";
    if (message) return { ok: false, message };
    const before = record.status;
    record.status = to;
    Object.assign(record, context.patch || {});
    record.history = record.history || [];
    const event = { date: new Date().toISOString(), user: actor.name, role: actor.role, action, from: before, to, comment: context.reason || context.solution || "" };
    record.history.unshift(event);
    audit?.({ action, module: rule.module, record: record.name || record.subject || record.title, before, after: to, reason: event.comment, result: "Exitoso" });
    return { ok: true, action, before, after: to, event };
  }

  function canReadSource(source, actor) {
    if (!source || source.status !== "Indexada" || !actor) return false;
    if (actor.role === "admin") return true;
    const map = { supervisor: "supervisor", analyst: "analista", support: "soporte", employee: "empleado", auditor: "auditor", client: "cliente" };
    const permissions = String(source.permissions || "").toLowerCase();
    if (source.confidentiality === "Publica") return true;
    if (permissions.includes("todos los empleados") && !["client"].includes(actor.role)) return true;
    return permissions.includes(map[actor.role] || actor.role);
  }

  global.DialiStateMachine = Object.freeze({ rules: RULES, allowed, transition, canReadSource });
})(window);
