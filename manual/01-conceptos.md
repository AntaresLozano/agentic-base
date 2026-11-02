# 1. Conceptos

Esta base convierte a Claude Code en un equipo con roles, memoria y guardarraíles. No es un prompt
largo: es un conjunto pequeño de archivos que reparten el trabajo entre **el humano**, que decide, y
**los agentes**, que implementan y revisan.

Está adaptada del flujo de trabajo de Matt Pocock ("Workflow for AI Coding") y de sus skills
([mattpocock/skills](https://github.com/mattpocock/skills), MIT).

## Las cinco piezas

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ MEMORIA        CLAUDE.md · AGENTS.md · docs/                                 │
│                Qué es el proyecto, sus reglas y sus decisiones.              │
├──────────────────────────────────────────────────────────────────────────────┤
│ PROCESOS       .claude/skills/ · .claude/commands/                           │
│                Cómo se hace cada paso: alinear, especificar, dividir, TDD.   │
├──────────────────────────────────────────────────────────────────────────────┤
│ TRABAJADORES   .claude/agents/  (implementer · reviewer · ui-verifier)       │
│                Subagentes con contexto limpio y un único trabajo.            │
├──────────────────────────────────────────────────────────────────────────────┤
│ GUARDARRAÍLES  .claude/hooks/ · linter · CI · status line                    │
│                Feedback mecánico e inmediato. No dependen de que la IA       │
│                "se acuerde".                                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│ TABLERO        GitHub Issues (prd · afk · hitl · ready-for-agent · qa-finding)│
│                El trabajo vivo. Fuera del repo para que no se pudra.         │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Los principios

**1. El humano decide; la IA ejecuta.** El producto, las interfaces públicas de los módulos, la
identidad visual y las decisiones difíciles de revertir son humanas. `/grill-me` existe para que la
IA te haga las preguntas en vez de suponer las respuestas.

**2. Contexto limpio y pequeño.** La calidad del modelo cae a medida que se llena el contexto (a
partir de ~100k tokens, la "zona tonta"). Por eso: una issue por sesión, `/clear` al terminar,
subagentes que empiezan de cero y una status line que avisa al acercarse al límite. Nunca
`/compact`: el punto de partida de cada sesión debe ser siempre el mismo.

**3. Documentación push y pull.** `CLAUDE.md` es corto y se carga siempre (push). Los estándares
completos viven en `docs/` y se leen solo cuando la tarea lo pide (pull), según la tabla "Qué leer
según la tarea". El revisor, en cambio, los carga todos siempre: su trabajo es ser exigente.

**4. Feedback loops antes que instrucciones.** Una regla que se puede imponer con un linter, un tipo
o un hook no se escribe solo en un documento: se impone. Los hooks formatean y lintan cada archivo
editado, bloquean archivos protegidos y no dejan que la IA termine con tipos o tests en rojo.

**5. Rebanadas verticales.** Cada issue atraviesa todas las capas con algo pequeño y verificable
(dominio → datos → caso de uso → UI → test). Nunca "toda la capa de datos" en una issue: así cada
paso se puede probar y cada sesión cabe en el contexto.

**6. Módulos profundos.** Organización por feature, cada una con una interfaz pública mínima
(`index`) y mucha funcionalidad detrás. El humano diseña la interfaz, la IA implementa el interior,
los tests van contra la interfaz. Los agentes navegan mejor un proyecto así, y los refactors
internos no rompen tests.

**7. Lenguaje ubicuo.** `docs/product/glossary.md` es la fuente de los nombres. Si el glosario dice
`Order`, nadie escribe `Purchase`. Un concepto nuevo se añade al glosario antes de nombrarlo en el
código.

**8. Nada de documentos que se pudren.** Los PRDs y las issues viven en GitHub y se cierran. En el
repo solo hay documentos que se mantienen: visión, glosario, identidad, arquitectura, ADRs y
estándares. Un documento desactualizado engaña a los agentes futuros.

**9. AFK y HITL.** Cada issue se etiqueta `afk` (la puede hacer un agente sin humano) o `hitl`
(necesita una decisión o revisión humana). La autonomía se gana: se empieza supervisando y se
encadenan issues `afk` cuando los loops son fiables.

## Núcleo y perfiles

- **`template/`** es el núcleo agnóstico: proceso, skills, subagentes, hooks configurables y
  plantillas de documentos. Sirve para cualquier stack.
- **`stacks/<nombre>/`** añade lo específico de una tecnología: comandos, reglas de lint, protección
  de archivos generados, verificación visual. Hoy existe `stacks/expo/` (React Native).

El instalador copia el núcleo y, encima, el perfil elegido.
