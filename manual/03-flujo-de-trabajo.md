# 3. Flujo de trabajo

Planificar y alinear requieren al humano; implementar y revisar se pueden delegar.

## El ciclo por feature

| Paso             | Quién      | Comando             | Resultado                                                         |
| ---------------- | ---------- | ------------------- | ----------------------------------------------------------------- |
| 1. Alinear       | Tú + IA    | `/grill-me <idea>`  | Comprensión compartida; glosario y docs de producto actualizados. |
| 2. Prototipar UI | Tú eliges  | `/ui-prototypes`    | Variante elegida y su captura en `docs/design/references/`.       |
| 3. Especificar   | IA         | `/write-prd`        | Issue padre en GitHub con etiqueta `prd`.                         |
| 4. Dividir       | Tú revisas | `/prd-to-issues #N` | Issues verticales con dependencias, `afk` o `hitl`.               |
| 5. Implementar   | Agentes    | `/next-issue`       | Una issue por sesión: TDD, loops en verde, commit.                |
| 6. Revisar       | Subagentes | `/qa`               | Revisión de código y visual con contexto limpio.                  |
| 7. QA humano     | Tú         | En la app           | Lo que encuentres se convierte en issues (vuelve al paso 5).      |

El paso 2 solo existe si la feature tiene pantallas nuevas (y en el perfil Expo). Los pasos 1-4 se
hacen en **una** sesión; a partir del 5, **una sesión por issue**.

## Ejemplo completo

Supón una app de recetas que quiere una lista de la compra.

### 1. Alinear: `/grill-me lista de la compra`

Claude lee la visión, el glosario y los ADRs, y te pregunta en **rondas**. Cada pregunta trae su
respuesta recomendada; contestar "sí" la acepta.

```text
❓ P1 - Origen de los artículos: ¿se añaden desde una receta, a mano, o ambos?
➡️ Ambos; desde receta es el caso principal y a mano cubre lo demás.

❓ P2 - Unidades: ¿se suman cantidades iguales de recetas distintas (200 g + 300 g)?
➡️ Sí, si la unidad coincide; si no, líneas separadas.
```

Las preguntas que dependen de otras esperan a la ronda siguiente. Cuando no quedan ramas abiertas,
Claude resume lo acordado y, con tu confirmación, actualiza el glosario (`ShoppingList`,
`ShoppingItem`…) y propone ADRs para lo difícil de revertir.

**Tu trabajo aquí:** decidir. Sobre todo la **interfaz pública** del módulo nuevo: qué exporta su
`index`. Es el contrato y es donde irán los tests.

### 2. Prototipar (si hay pantallas): `/ui-prototypes lista de la compra`

Claude monta 3 variantes estructuralmente distintas en una rama `prototype/…`, intercambiables en
el simulador, y te enseña capturas en claro y oscuro. Eliges (a menudo "la cabecera de B con la
lista de C"). La captura final se guarda como referencia para el `ui-verifier`. El código del
prototipo no se promociona: se reescribe con tests.

### 3. Especificar: `/write-prd`

No vuelve a preguntar: sintetiza la conversación en un PRD (problema, solución, historias de
usuario, decisiones de implementación y de testing, fuera de alcance) y lo publica como issue con
etiqueta `prd`. Te devuelve el número, por ejemplo `#14`.

### 4. Dividir: `/prd-to-issues #14`

Propone una lista numerada de rebanadas verticales:

```text
1. Añadir un artículo a mano y verlo en la lista       bloqueada por: —    afk
2. Añadir todos los ingredientes de una receta         bloqueada por: 1    afk
3. Sumar cantidades con la misma unidad                bloqueada por: 2    afk
4. Estado vacío con ilustración                        bloqueada por: 1    hitl
```

Revisas granularidad, dependencias y etiquetas, e iteras hasta aprobarla. Entonces crea las issues
en GitHub en orden de dependencias. **Aquí termina la sesión de planificación: `/clear`.**

### 5. Implementar: `/next-issue`

Elige la issue `ready-for-agent` de número más bajo sin bloqueantes abiertas (prefiere `afk`; si es
`hitl`, te pregunta antes). Delega en el subagente `implementer`, que:

1. Lee la issue y su PRD, y `CLAUDE.md` con los documentos que tocan.
2. Crea la rama `15-anadir-articulo-a-mano`.
3. Si la feature es nueva, `/new-feature`; luego `/tdd`: un test rojo, el mínimo código verde,
   repetir.
4. Construye la rebanada completa y deja el check en verde (los hooks le obligan).
5. Hace commit `feat(shopping-list): add item manually (#15)`. No hace push ni cierra la issue.

Al terminar, `/next-issue` lanza al `reviewer` (y al `ui-verifier` si hay UI) y te resume
veredictos y hallazgos. Si hay bloqueantes pequeños, se arreglan en la misma sesión.

**Termina la sesión: push / PR, cierra la issue, `/clear`.** Repite con la siguiente.

### 6. Revisar la rama entera: `/qa`

Antes de fusionar una feature completa: revisor + verificador visual en paralelo con contexto
limpio, y una **lista de QA manual** para ti (flujos, casos límite, lo que un agente no puede sentir:
animaciones, gestos). Los hallazgos que apruebes se convierten en issues `qa-finding`.

### 7. QA humano

Prueba en la app real. Lo que encuentres → issue → paso 5.

## Reglas de sesión

- **Una issue por sesión.** Termina, commit, `/clear`. Nada de `/compact`.
- **Mira la status line.** En amarillo (~70k tokens) ve cerrando; en rojo (100k) termina la
  porción, haz commit y empieza de cero. El `implementer` deja una nota en la issue si no llega.
- **No mezcles issues.** Si aparece otra cosa, crea una issue y sigue.
- **Las decisiones nuevas van a un ADR** (`/adr`), no a un comentario perdido en el chat.

## Mantenimiento periódico

| Cada…                                      | Qué                                                        | Para qué                                                     |
| ------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------ |
| 2-3 semanas                                | `/improve-architecture`                                    | Detectar módulos superficiales antes de que la IA se pierda. |
| Al tomar decisión                          | `/adr <decisión>`                                          | Que la IA no vuelva a proponer lo descartado.                |
| Al corregir a la IA dos veces por lo mismo | Añadir regla a `CLAUDE.md`, o mejor, al linter o a un hook | Convertir una corrección en un guardarraíl.                  |

## Niveles de autonomía

1. **Supervisado** (al empezar): lanzas `/next-issue` y revisas cada resultado.
2. **AFK encadenado**: cuando los tests son significativos y el revisor es estable, encadena issues
   `afk` sin intervención (por ejemplo con `/loop /next-issue` o en sesiones sucesivas).
3. **Paralelo**: issues independientes (sin bloqueos entre sí) en worktrees de git distintos, una
   sesión de Claude Code en cada uno.

Las `hitl` siempre pasan por ti.
