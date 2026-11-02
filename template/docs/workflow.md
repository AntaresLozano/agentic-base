# Flujo de trabajo con agentes

Adaptado del flujo de Matt Pocock ("Workflow for AI Coding") y de sus skills (`mattpocock/skills`,
licencia MIT). Planificar y alinear requiere al humano; implementar se puede delegar.

## Arranque del proyecto (una vez)

| Fase                 | Qué se hace                                                                 | Resultado                                                  |
| -------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 0. Base agéntica     | Instalar esta base y adaptar `CLAUDE.md`, `AGENTS.md` y los hooks al stack. | `<check>` funciona; hooks y status line activos.           |
| 1. Concepto          | `/grill-me` sobre la idea del producto.                                     | `vision.md`, `personas.md`, `glossary.md` y primeros ADRs. |
| 2. Identidad (si UI) | Referencias en `docs/design/references/` + sesión sobre la identidad.       | `identity.md` y tokens definitivos.                        |
| 3. Primera feature   | Empieza el ciclo de abajo.                                                  | Primer PRD e issues.                                       |

Hasta completar la fase 1, la IA no debe asumir nada del producto.

## El ciclo por feature

| Paso                                | Quién      | Comando          | Resultado                                                           |
| ----------------------------------- | ---------- | ---------------- | ------------------------------------------------------------------- |
| 1. Alinear                          | Tú + IA    | `/grill-me`      | Comprensión compartida; docs de producto y glosario actualizados.   |
| 2. Prototipar UI (si hay pantallas) | Tú eliges  | `/ui-prototypes` | Variante elegida y su captura en `docs/design/references/`.         |
| 3. Especificar                      | IA         | `/write-prd`     | Issue padre en GitHub con etiqueta `prd`.                           |
| 4. Dividir                          | Tú revisas | `/prd-to-issues` | Issues verticales con dependencias, etiquetadas `afk` o `hitl`.     |
| 5. Implementar                      | Agentes    | `/next-issue`    | Una issue por sesión: TDD, loops en verde, commit.                  |
| 6. Revisar                          | Subagentes | `/qa`            | Revisión de código y verificación visual con contexto limpio.       |
| 7. QA humano                        | Tú         | En la app real   | Lo que encuentres se convierte en issues nuevas (vuelve al paso 5). |

## Reglas de sesión

- **Una issue por sesión.** Termina, haz commit y usa `/clear`. No uses `/compact`: el punto de
  partida debe ser siempre el mismo.
- **Vigila el contador de contexto** de la status line. Por encima de ~100k tokens la calidad cae:
  termina la porción actual y empieza una sesión nueva.
- **Las porciones son verticales:** cada issue entrega algo verificable en la app (punto de
  entrada + UI + caso de uso + dominio + test), no "toda la capa de datos".

## Tablero (GitHub Issues)

Etiquetas (créalas con `scripts/setup-github-labels.sh` cuando exista el repo remoto):

| Etiqueta          | Significado                                                    |
| ----------------- | -------------------------------------------------------------- |
| `prd`             | Issue padre con la especificación de una feature.              |
| `afk`             | La puede implementar un agente sin humano.                     |
| `hitl`            | Requiere decisión o revisión humana durante la implementación. |
| `ready-for-agent` | Lista para que un agente la tome.                              |
| `qa-finding`      | Hallazgo de QA o revisión, convertido en trabajo.              |

Las dependencias entre issues se escriben como `Blocked by #N` en el cuerpo. Una issue está lista
cuando todas sus bloqueantes están cerradas.

## Lo que no se guarda en el repo

Los PRDs y las issues viven en GitHub y se cierran al terminar: en el repo se desactualizarían y
confundirían a agentes futuros (_doc rot_). En el repo solo viven documentos que se mantienen: visión,
glosario, identidad, arquitectura, ADRs y estándares.

## Autonomía

Se empieza supervisando cada `/next-issue`. Cuando los loops sean fiables (tests significativos,
revisor estable), se pasa a bucles AFK que encadenan issues `afk` sin intervención, y a ejecutar
issues independientes en paralelo con worktrees de git.
