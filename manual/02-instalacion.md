# 2. Instalación

## Requisitos

| Herramienta | Para qué                                                    |
| ----------- | ----------------------------------------------------------- |
| Claude Code | El agente. Terminal, VS Code, JetBrains o escritorio.       |
| Node 18+    | Los hooks, la status line y el instalador son scripts Node. |
| git         | El hook de parada mira `git status` para saber qué cambió.  |
| GitHub CLI  | `gh auth login`. El tablero son issues de GitHub.           |

## Proyecto nuevo

1. **Crea el proyecto con la herramienta oficial de su stack** (`create-expo-app`, `create-next-app`,
   `uv init`…). La base no genera código de aplicación.
2. **Descarga la base** en cualquier carpeta:

   ```bash
   git clone --depth 1 https://github.com/AntaresLozano/agentic-base ~/agentic-base
   ```

3. **Instálala** desde la raíz de tu proyecto:

   ```bash
   node ~/agentic-base/scripts/install.mjs --stack expo   # o sin --stack: solo el núcleo
   ```

   Opciones: `--name "Mi App"`, `--force` (sobrescribe archivos que ya existen y difieren),
   `--dry-run` (solo muestra qué haría), `--target <dir>`. Ayuda: `--help`.

   Si el generador del proyecto ya creó `CLAUDE.md`, `AGENTS.md` o la config del linter, el
   instalador los **omite** y te lo dice. En un proyecto recién creado lo normal es usar `--force`.

4. **Adapta** lo marcado con `ADAPTAR` (ver abajo).
5. **Crea el tablero**: crea el repo remoto y ejecuta `./scripts/setup-github-labels.sh`.
6. **Commit**: `chore: add agentic base`.

Si usas un perfil, sigue además su README (`stacks/<perfil>/README.md`): instala las herramientas de
los feedback loops (tests, linter, E2E) que el perfil espera.

## Proyecto existente

Igual, pero **sin `--force`** la primera vez y con `--dry-run` antes:

```bash
node ~/agentic-base/scripts/install.mjs --dry-run
node ~/agentic-base/scripts/install.mjs
```

Para cada archivo omitido, decide a mano: fusiona tu `CLAUDE.md` actual con la estructura de la
plantilla (tus reglas en "Reglas que más se rompen", tus comandos en la tabla). En un proyecto con
código, la fase 1 es `/grill-me` sobre lo que ya existe para rellenar `docs/product/` y el glosario a
partir del código, y `/improve-architecture` te dirá por dónde empezar a ordenar.

## Qué adaptar después de instalar

| Archivo                         | Qué rellenar                                                                     |
| ------------------------------- | -------------------------------------------------------------------------------- |
| `CLAUDE.md`                     | Una frase del proyecto, stack, tabla de comandos, reglas, "Terminado significa". |
| `AGENTS.md`                     | Lo que la IA hace mal con tu stack y dónde está su documentación versionada.     |
| `.claude/hooks/config.json`     | Formateador, linter, typecheck y tests relacionados; archivos protegidos.        |
| `.claude/settings.json`         | Permisos `allow` de los comandos de tu stack para no aprobarlos uno a uno.       |
| `docs/architecture/overview.md` | Estructura de carpetas real y reglas de dependencia.                             |
| `docs/standards/testing.md`     | Herramientas y comandos de test.                                                 |
| `docs/design/*`                 | Bórralos si el proyecto no tiene UI.                                             |

El resto (`docs/product/`, `identity.md`, ADRs) **no se rellena a mano**: sale de las fases 1 y 2.

## Comprobar que funciona

Abre Claude Code en el proyecto y:

1. **Status line:** abajo debe verse `Modelo · ctx 12k/200k (6%) · $0.03`.
2. **Hook de edición:** pide "añade una línea en blanco al final de `src/<algún archivo>`" y mira que
   el formateador la quita.
3. **Hook de protección:** pide "escribe FOO=1 en `.env`". Debe negarse con el motivo.
4. **Skills:** escribe `/` y comprueba que aparecen `grill-me`, `write-prd`, `prd-to-issues`,
   `next-issue`, `qa`, `tdd`, `adr`…
5. **Subagentes:** `/agents` debe listar `implementer` y `reviewer` (y `ui-verifier` con perfil Expo).

## Arranque: las fases del proyecto

| Fase                 | Qué haces                                                                                                                        | Sale                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 0. Base agéntica     | Lo de este capítulo.                                                                                                             | Loops funcionando.                          |
| 1. Concepto          | `/grill-me <tu idea>`. Contesta ronda a ronda.                                                                                   | `vision.md`, `personas.md`, glosario, ADRs. |
| 2. Identidad (si UI) | Guarda 5-10 capturas de apps que te gusten en `docs/design/references/` y pide una sesión `/grill-me` sobre la identidad visual. | `identity.md` y tokens definitivos.         |
| 3. Primera feature   | Empieza el ciclo del [capítulo 3](03-flujo-de-trabajo.md).                                                                       | Primer PRD.                                 |

Hasta que la fase 1 esté hecha, `CLAUDE.md` le dice a la IA que no asuma nada del producto.
