---
name: adr
description: Registra una decisión de arquitectura o de producto difícil de revertir como ADR en docs/architecture/adr/. Úsala cuando se tome una decisión que sorprendería a alguien nuevo o que la IA podría volver a proponer.
argument-hint: <decisión>
---

Decisión: $ARGUMENTS

1. Lee `docs/architecture/adr/README.md` (plantilla e índice) y los ADRs relacionados.
2. Si la decisión sustituye a un ADR existente, no lo edites: crea uno nuevo y cambia el estado del
   anterior a `Sustituida por NNNN`.
3. Usa el siguiente número libre: `NNNN-titulo-en-kebab-case.md`. Fecha de hoy.
4. Breve: contexto, decisión en una o dos frases, alternativas con el motivo del descarte y
   consecuencias. Una página como máximo.
5. Añade la fila al índice del README.
6. Si la decisión cambia una regla del día a día, actualiza también `CLAUDE.md`,
   `docs/architecture/overview.md` o el estándar correspondiente.
