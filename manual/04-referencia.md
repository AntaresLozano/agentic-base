# 4. Referencia

## Skills y comandos

Se invocan escribiendo `/<nombre>` en Claude Code. Las marcadas como **automática** también puede
elegirlas Claude cuando la tarea encaja; las **manuales** (`disable-model-invocation: true`) solo
se ejecutan si tú las llamas, porque crean cosas fuera del repo o son caras.

| Nombre                  | Tipo          | Cuándo                                       | Lee                                  | Produce                                              |
| ----------------------- | ------------- | -------------------------------------------- | ------------------------------------ | ---------------------------------------------------- |
| `/grill-me [tema]`      | automática    | Alinear una idea, feature o decisión.        | visión, glosario, ADRs               | Preguntas por rondas; al final, docs actualizados.   |
| `/write-prd`            | manual        | Tras `/grill-me`.                            | la conversación, glosario, ADRs      | Issue `prd` en GitHub.                               |
| `/prd-to-issues #N`     | manual        | Con un PRD publicado.                        | el PRD, el código afectado           | Issues verticales con bloqueos y `afk`/`hitl`.       |
| `/next-issue [#N]`      | comando       | Implementar la siguiente issue lista.        | issues `ready-for-agent`             | Rama + commit + informes de revisión.                |
| `/qa [base]`            | comando       | Antes de fusionar una rama.                  | `git diff <base>...HEAD`             | Informes + lista de QA manual + issues `qa-finding`. |
| `/new-feature <nombre>` | automática    | Primera issue de una feature nueva.          | glosario, `overview.md`              | Esqueleto del módulo con su `index`.                 |
| `/tdd`                  | automática    | Lógica de dominio, hooks, componentes, bugs. | `testing.md`                         | Tests y código, de uno en uno.                       |
| `/adr <decisión>`       | automática    | Decisión difícil de revertir.                | índice de ADRs                       | `docs/architecture/adr/NNNN-….md` + índice.          |
| `/improve-architecture` | manual        | Cada 2-3 semanas.                            | `git log`, glosario, ADRs, el código | Candidatos de refactor con su fuerza.                |
| `/ui-prototypes`        | manual (Expo) | Decidir cómo se ve una pantalla.             | identidad, patrones de UI            | 3 variantes en el simulador + referencia elegida.    |

## Subagentes

Empiezan con el contexto vacío: no saben nada de tu conversación salvo lo que se les pasa.

| Subagente     | Modelo | Herramientas                   | Hace                                                                   | No hace                                         |
| ------------- | ------ | ------------------------------ | ---------------------------------------------------------------------- | ----------------------------------------------- |
| `implementer` | sonnet | lectura, edición, Bash, skills | Una issue de punta a punta con TDD y commit.                           | Push, cerrar issues, decidir diseño o tokens.   |
| `reviewer`    | opus   | solo lectura + Bash            | Revisa el diff en dos ejes: **estándares** y **especificación**.       | Editar archivos.                                |
| `ui-verifier` | sonnet | solo lectura + Bash            | Capturas en claro y oscuro en el simulador; compara con la referencia. | Editar `src/`, arrancar o compilar sin permiso. |

El modelo de cada uno se cambia en el `model:` de su archivo en `.claude/agents/`.

## Hooks

Configurados en `.claude/settings.json`; sus comandos y patrones, en `.claude/hooks/config.json`.

| Hook              | Evento                      | Qué hace                                                                                                                    |
| ----------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `guard-files.mjs` | Antes de editar             | `protect.deny`: bloquea (`.env`, lockfiles, carpetas generadas). `protect.ask`: pide tu aprobación.                         |
| `after-edit.mjs`  | Después de editar           | Formatea y linta el archivo. Si quedan errores, se los devuelve a Claude para que los arregle.                              |
| `stop-check.mjs`  | Antes de que Claude termine | Si cambió código fuente: typecheck + tests relacionados. Si fallan, Claude sigue trabajando. Cachea el último estado verde. |
| `statusline.mjs`  | Siempre visible             | Modelo · contexto usado (verde/amarillo/rojo, límite 100k) · coste de la sesión.                                            |

## Etiquetas del tablero

Se crean con `./scripts/setup-github-labels.sh`.

| Etiqueta          | Significado                                                    |
| ----------------- | -------------------------------------------------------------- |
| `prd`             | Issue padre con la especificación de una feature.              |
| `afk`             | La puede implementar un agente sin humano.                     |
| `hitl`            | Requiere decisión o revisión humana durante la implementación. |
| `ready-for-agent` | Lista para que un agente la tome.                              |
| `qa-finding`      | Hallazgo de QA o revisión, convertido en trabajo.              |

Las dependencias se escriben en el cuerpo de la issue, en la sección "Bloqueada por" (`#N`). Una
issue está lista cuando todas sus bloqueantes están cerradas.

## Documentos del proyecto

| Documento                       | Quién lo escribe          | Cuándo se carga                         |
| ------------------------------- | ------------------------- | --------------------------------------- |
| `CLAUDE.md`                     | Tú (al instalar)          | Siempre (push). Mantenlo corto.         |
| `AGENTS.md`                     | Tú (al instalar)          | Siempre, importado desde `CLAUDE.md`.   |
| `docs/product/vision.md`        | `/grill-me` (fase 1)      | Planificación.                          |
| `docs/product/personas.md`      | `/grill-me` (fase 1)      | Planificación.                          |
| `docs/product/glossary.md`      | `/grill-me`, cada feature | Al nombrar cualquier cosa.              |
| `docs/design/identity.md`       | Fase 2                    | Al tocar UI.                            |
| `docs/design/ui-patterns.md`    | Viene con la base         | Al tocar UI; el revisor siempre.        |
| `docs/design/references/`       | Tú y `/ui-prototypes`     | `ui-verifier`, `/ui-prototypes`.        |
| `docs/architecture/overview.md` | Base + tú                 | Al crear o mover módulos.               |
| `docs/architecture/adr/`        | `/adr`                    | Antes de proponer alternativas.         |
| `docs/standards/code.md`        | Viene con la base         | Al escribir código; el revisor siempre. |
| `docs/standards/testing.md`     | Base + tú                 | Al escribir tests; el revisor siempre.  |
| `docs/workflow.md`              | Viene con la base         | Al dudar del proceso.                   |

## Archivos que no se versionan

`.claude/settings.local.json` (tus preferencias y permisos personales) y `.claude/.cache/` (caché del
hook de parada). El instalador los añade a `.gitignore`.
