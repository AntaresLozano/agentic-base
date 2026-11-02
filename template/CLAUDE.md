# {{PROJECT_NAME}}

<!-- ADAPTAR: una o dos frases sobre qué es el proyecto. Mientras la fase 1 no esté hecha, deja
     la frase de abajo: impide que la IA invente el producto. -->

El concepto, el usuario y el alcance están PENDIENTES de definir con `/grill-me` (fase 1): no
asumas nada del producto que no esté en `docs/product/`.

@AGENTS.md

## Stack y comandos

<!-- ADAPTAR: stack en una línea y los comandos reales del proyecto. Lo más importante es la fila
     "Todo antes de terminar": un único comando que deja tipos, lint, formato y tests en verde. -->

<Lenguaje · framework · gestor de paquetes>

| Para                   | Comando                                      |
| ---------------------- | -------------------------------------------- |
| Todo antes de terminar | `<check>` (tipos + lint + formato + tests)   |
| Tipos                  | `<typecheck>`                                |
| Lint                   | `<lint>`                                     |
| Tests                  | `<test>` · `<test de archivos relacionados>` |
| E2E                    | `<e2e>`                                      |
| Arrancar la app        | `<dev>`                                      |
| Añadir dependencias    | `<comando correcto para este stack>`         |

## Reglas que más se rompen

<!-- ADAPTAR: máximo ~8 reglas. Solo las que la IA rompe de verdad; lo demás va en docs/standards/.
     Si una regla se puede imponer con lint o un hook, impónla ahí y deja aquí solo el recordatorio. -->

1. Un módulo (feature) se importa solo por su interfaz pública (`index`). `domain/` es lógica pura.
2. Los puntos de entrada (rutas, controladores, CLI) solo componen; la lógica vive en los módulos.
3. TDD en `domain/`. Tests solo contra interfaces públicas.
4. Los nombres del dominio salen de `docs/product/glossary.md`. Si falta un término, añádelo primero.
5. No edites archivos generados ni `.env*`.
6. Una issue por sesión. Al terminar: commit y `/clear`.

## Qué leer según la tarea

| Tarea                          | Lee primero                                               |
| ------------------------------ | --------------------------------------------------------- |
| Planificar o decidir producto  | `docs/product/vision.md`, `docs/product/glossary.md`      |
| Crear o cambiar pantallas / UI | `docs/design/ui-patterns.md`, `docs/design/identity.md`   |
| Crear un módulo o mover código | `docs/architecture/overview.md`, `docs/architecture/adr/` |
| Escribir código                | `docs/standards/code.md`                                  |
| Escribir tests                 | `docs/standards/testing.md`                               |
| Entender el proceso            | `docs/workflow.md`                                        |

## Terminado significa

- `<check>` en verde.
- Si hay UI: verificada visualmente (subagente `ui-verifier` si el proyecto lo tiene).
- Commit con Conventional Commits que referencia la issue (`feat(<módulo>): ... (#12)`).
