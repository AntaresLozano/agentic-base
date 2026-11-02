---
description: Elige la siguiente issue lista (sin bloqueantes abiertas) y la implementa con el subagente implementer.
argument-hint: '[#número opcional]'
---

Issue pedida: $ARGUMENTS

1. Si se indicó una issue, úsala. Si no:
   - `gh issue list --label ready-for-agent --state open --json number,title,labels,body --limit 50`
   - Descarta las que tengan en "Bloqueada por" alguna issue todavía abierta
     (compruébalo con `gh issue view <n> --json state`).
   - Prefiere `afk` sobre `hitl` y el número más bajo.
2. Muéstrame la issue elegida (número, título, etiqueta) en una línea.
3. Si es `hitl`, para y pregúntame antes de seguir.
4. Delega la implementación al subagente `implementer` con el número de la issue.
5. Cuando termine, lanza el subagente `reviewer` sobre su rama y, si la issue toca UI y el proyecto
   tiene el subagente `ui-verifier` (`.claude/agents/ui-verifier.md`), lánzalo en paralelo.
6. Resume: commits, veredictos y hallazgos bloqueantes. Si hay bloqueantes, propón arreglarlos en
   esta misma sesión solo si son pequeños; si no, propón crear issues `qa-finding`.
7. Recuérdame hacer `/clear` antes de la siguiente issue.
