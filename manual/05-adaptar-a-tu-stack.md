# 5. Adaptar a tu stack

El núcleo no sabe nada de tu tecnología. Lo que cambia entre stacks está concentrado en pocos
archivos.

## `.claude/hooks/config.json`

Los hooks no se tocan; solo su configuración.

| Clave                  | Tipo                  | Qué es                                                                            |
| ---------------------- | --------------------- | --------------------------------------------------------------------------------- |
| `skipPaths`            | regex                 | Rutas que los hooks de edición ignoran (dependencias, generados, builds).         |
| `sourceFiles`          | regex                 | Qué cambios disparan el check de parada. Vacío o ausente = el hook no hace nada.  |
| `format.files`         | regex                 | Qué archivos se formatean tras editarlos.                                         |
| `format.command`       | array                 | Comando del formateador. `{file}` es el archivo editado. Su resultado no bloquea. |
| `lint.files`           | regex                 | Qué archivos se lintan tras editarlos.                                            |
| `lint.command`         | array                 | Comando del linter (con auto-fix). Si sale con error, Claude recibe la salida.    |
| `typecheck.command`    | array                 | Comprobación de tipos del proyecto entero, en el hook de parada.                  |
| `relatedTests.command` | array                 | Tests relacionados con los archivos cambiados. `{files}` se expande a la lista.   |
| `protect.deny`         | `[{pattern, reason}]` | Archivos que la IA nunca edita. El motivo se le muestra.                          |
| `protect.ask`          | `[{pattern, reason}]` | Archivos que la IA puede editar solo con tu aprobación.                           |

Las rutas de los comandos se resuelven desde la raíz del proyecto si contienen `/`
(`node_modules/.bin/eslint`, `.venv/bin/ruff`) o desde el `PATH` si no (`cargo`, `go`). **Si la
herramienta no está instalada, el paso se omite** en vez de fallar: la base funciona desde el
primer minuto y los loops se activan al instalar cada herramienta.

### Ejemplos

**Python con uv, ruff, mypy y pytest**

```json
{
  "skipPaths": "^(\\.venv|build|dist)/",
  "sourceFiles": "^(src|app)/.*\\.py$",
  "format": { "files": "\\.py$", "command": [".venv/bin/ruff", "format", "{file}"] },
  "lint": { "files": "\\.py$", "command": [".venv/bin/ruff", "check", "--fix", "{file}"] },
  "typecheck": { "command": [".venv/bin/mypy", "src"] },
  "relatedTests": { "command": [".venv/bin/pytest", "-x", "-q", "--testmon"] },
  "protect": {
    "deny": [
      { "pattern": "(^|/)\\.env(\\.|$)", "reason": "Secretos: edítalo tú." },
      { "pattern": "^uv\\.lock$", "reason": "El lockfile lo modifica uv." }
    ],
    "ask": [{ "pattern": "^migrations/", "reason": "Las migraciones aplicadas no se reescriben." }]
  }
}
```

(Sin `pytest-testmon`, usa la suite entera si es rápida, o deja `relatedTests` vacío.)

**Next.js / web con pnpm, eslint, tsc y vitest**

```json
{
  "skipPaths": "^(node_modules|\\.next|dist|coverage)/",
  "sourceFiles": "^(src|app)/.*\\.(ts|tsx)$",
  "format": {
    "files": "\\.(ts|tsx|js|json|md|css)$",
    "command": ["node_modules/.bin/prettier", "--write", "--log-level", "silent", "{file}"]
  },
  "lint": {
    "files": "\\.(ts|tsx|js)$",
    "command": ["node_modules/.bin/eslint", "--fix", "--no-warn-ignored", "{file}"]
  },
  "typecheck": { "command": ["node_modules/.bin/tsc", "--noEmit"] },
  "relatedTests": { "command": ["node_modules/.bin/vitest", "related", "--run", "{files}"] },
  "protect": {
    "deny": [{ "pattern": "(^|/)\\.env(\\.|$)", "reason": "Secretos: edítalo tú." }],
    "ask": []
  }
}
```

**Go**: `format` → `["gofmt", "-w", "{file}"]`, `lint` → `["golangci-lint", "run", "--fix"]`,
`typecheck` → `["go", "vet", "./..."]`, `relatedTests` → `["go", "test", "./..."]`.

## `CLAUDE.md` y `AGENTS.md`

- **`CLAUDE.md`** es el proyecto y el proceso: una frase del producto, comandos, reglas que más se
  rompen, qué leer según la tarea, qué significa "terminado". Menos de ~80 líneas. Cada línea se
  paga en cada mensaje.
- **`AGENTS.md`** es el stack: lo que la IA recuerda mal. APIs que cambiaron, el comando correcto
  para añadir dependencias, carpetas generadas, enlaces a la documentación de la versión exacta
  (mejor aún, a un `llms.txt`). Lo leen también otras herramientas (Codex, Cursor…).

La pregunta para cada regla: **¿se puede imponer mecánicamente?** Si sí, al linter, a un tipo o a
`protect` en los hooks, y en `CLAUDE.md` solo un recordatorio de una línea.

## La arquitectura como lint

En el perfil Expo, `eslint.config.js` impone con `no-restricted-imports` y `no-restricted-syntax`:

- `domain/` no importa React, Expo ni otras capas.
- Una feature solo se importa por `@/features/<x>`.
- `shared/` no conoce features.
- Nada de colores hex/rgb ni tamaños literales fuera de `src/theme/`.

Equivalentes en otros stacks: `import-linter` (Python), `dependency-cruiser` o `eslint-plugin-boundaries`
(JS/TS), `depguard` (Go), ArchUnit (JVM). Merecen la pena: el linter corre en cada edición gracias
al hook, así que la IA corrige la violación en el mismo instante en que la comete.

## `.claude/settings.json`

- Añade a `permissions.allow` los comandos de lectura y de check de tu stack (`Bash(pnpm test *)`,
  `Bash(uv run pytest *)`…) para no aprobarlos uno a uno. Deja fuera lo destructivo.
- `permissions.deny` ya bloquea `git push --force` y leer `.env*`.
- Si tu stack tiene plugin oficial de Claude Code, actívalo en `enabledPlugins`.

## Verificación visual

`ui-verifier` y `/ui-prototypes` vienen en el perfil Expo porque dependen del simulador de iOS
(`xcrun simctl`). Para web, el equivalente es un subagente que use Playwright (o un MCP de
navegador) para abrir la URL, cambiar `prefers-color-scheme` y hacer capturas. Copia
`stacks/expo/files/.claude/agents/ui-verifier.md` y cambia la sección "Preparación" y
"Verificación".

## Crear un perfil nuevo

```text
stacks/<nombre>/
├── README.md       # Qué añade y pasos de instalación propios del stack
├── stack.json      # description, gitignore (líneas extra), packageJson (scripts a fusionar)
└── files/          # Se copia encima de template/: mismas rutas que en el proyecto final
    ├── CLAUDE.md
    ├── AGENTS.md
    └── .claude/hooks/config.json
```

- En `files/` solo va lo que difiere del núcleo; un archivo con la misma ruta reemplaza al del núcleo.
- Placeholders disponibles en cualquier archivo: `{{PROJECT_NAME}}`, `{{TODAY}}`, `{{APP_SCHEME}}`
  y `{{APP_ID}}` (estos dos se leen de `app.json` de Expo si existe).
- `packageJson.scripts` se fusiona en el `package.json` del proyecto sin pisar scripts existentes
  (salvo con `--force`); el resto de claves se añade solo si no existen.
- Prueba el perfil con `--dry-run` en un proyecto recién generado y abre un PR.
