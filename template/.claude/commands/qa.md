---
description: Revisión completa de la rama actual (código + visual) y lista de comprobación para tu QA manual. Los hallazgos se convierten en issues.
argument-hint: '[rama o referencia base, por defecto main]'
---

Base: $ARGUMENTS (si está vacío, `main`).

1. Lanza en paralelo, con contexto limpio:
   - Subagente `reviewer` sobre `git diff <base>...HEAD`.
   - Subagente `ui-verifier`, si existe en `.claude/agents/` y el diff toca UI (rutas,
     componentes compartidos o la carpeta `ui/` de algún módulo).
2. Presenta los dos informes por separado, sin mezclarlos ni reordenarlos.
3. Genera una **lista de QA manual** corta para que yo pruebe en la app real: los flujos de las
   historias de usuario afectadas, los casos límite (vacío, error, sin conexión, texto grande, modo
   oscuro) y lo que los subagentes no pueden ver (sensación, animaciones, gestos).
4. Pregúntame qué hallazgos convertir en issues. Para cada uno que apruebe:
   `gh issue create --label qa-finding --label ready-for-agent --label <afk|hitl>` con criterios de
   aceptación concretos y referencia a la issue o PRD de origen.
