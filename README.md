# agentic-base

Base agéntica para trabajar con **Claude Code** como un equipo: el humano decide, los agentes
implementan y revisan, y los guardarraíles mecánicos evitan que nadie tenga que "acordarse" de las
reglas.

No contiene código de aplicación. Contiene el **proceso** (skills y comandos), los **trabajadores**
(subagentes), los **guardarraíles** (hooks, status line, lint, CI), las **plantillas de memoria**
(`CLAUDE.md`, `AGENTS.md`, `docs/`) y un instalador que lo copia en cualquier proyecto.

Nació en una app móvil con Expo y se separó para reutilizarla. Basada en el flujo de trabajo de
[Matt Pocock](https://github.com/mattpocock/skills).

## El ciclo

```text
/grill-me ──► /ui-prototypes ──► /write-prd ──► /prd-to-issues ──► /next-issue ──► /qa ──► QA humano
 alinear       elegir pantalla     especificar     dividir en         implementar     revisar       │
 (tú + IA)     (tú)                (IA)            issues (tú revisas) (agentes)       (agentes)     │
                                                                          ▲                         │
                                                                          └──── hallazgos → issues ─┘
```

Una issue por sesión, contexto limpio, TDD contra interfaces públicas, rebanadas verticales,
issues `afk` (las hace un agente solo) o `hitl` (necesitan a un humano).

## Instalación rápida

```bash
git clone --depth 1 https://github.com/AntaresLozano/agentic-base ~/agentic-base

cd mi-proyecto                                    # creado con la herramienta oficial de su stack
node ~/agentic-base/scripts/install.mjs --dry-run # mira qué va a hacer
node ~/agentic-base/scripts/install.mjs           # solo el núcleo, o:
node ~/agentic-base/scripts/install.mjs --stack expo --force   # perfil Expo en un proyecto recién creado
```

Luego completa lo marcado con `ADAPTAR` en `CLAUDE.md`, `AGENTS.md` y `.claude/hooks/config.json`, y
empieza con `/grill-me <tu idea>`. Detalles en el [manual de instalación](manual/02-instalacion.md).

**Requisitos:** Claude Code, Node 18+, git y GitHub CLI (`gh auth login`).

## Qué hay dentro

```text
agentic-base/
├── manual/                      # Cómo funciona y cómo se usa (empieza por aquí)
├── scripts/install.mjs          # Instalador
├── template/                    # NÚCLEO: agnóstico al stack, se copia en tu proyecto
│   ├── CLAUDE.md                #   Memoria del proyecto (plantilla)
│   ├── AGENTS.md                #   Conocimiento del stack (plantilla)
│   ├── .claude/
│   │   ├── settings.json        #   Hooks, permisos y status line
│   │   ├── statusline.mjs       #   Modelo · contexto (aviso a 100k) · coste
│   │   ├── hooks/               #   guard-files · after-edit · stop-check + config.json
│   │   ├── agents/              #   implementer · reviewer
│   │   ├── commands/            #   /next-issue · /qa
│   │   └── skills/              #   grill-me · write-prd · prd-to-issues · tdd · adr
│   │                            #   new-feature · improve-architecture
│   ├── docs/                    #   product/ · design/ · architecture/ · standards/ · workflow.md
│   └── scripts/setup-github-labels.sh
└── stacks/
    └── expo/                    # PERFIL Expo + React Native: se copia encima del núcleo
        ├── README.md            #   Pasos propios del stack
        └── files/               #   CLAUDE.md, AGENTS.md, eslint.config.js, ui-verifier,
                                 #   /ui-prototypes, Maestro, CI, docs de arquitectura y testing
```

## Manual

1. [Conceptos](manual/01-conceptos.md): las cinco piezas y los principios.
2. [Instalación](manual/02-instalacion.md): proyecto nuevo o existente, qué adaptar, cómo comprobarlo.
3. [Flujo de trabajo](manual/03-flujo-de-trabajo.md): el ciclo completo con un ejemplo.
4. [Referencia](manual/04-referencia.md): cada skill, comando, subagente, hook y documento.
5. [Adaptar a tu stack](manual/05-adaptar-a-tu-stack.md): Python, web, Go… y cómo crear un perfil.
6. [Problemas frecuentes](manual/06-problemas-frecuentes.md).

## Contribuir

Los perfiles nuevos (`stacks/<nombre>/`) y las mejoras al núcleo son bienvenidos. Regla de oro: el
núcleo no menciona ningún stack concreto; lo específico va a un perfil.

## Créditos y licencia

- Flujo y skills adaptados de [mattpocock/skills](https://github.com/mattpocock/skills) (MIT): cada
  skill adaptada lo indica en su primera línea.
- Licencia [MIT](LICENSE).
