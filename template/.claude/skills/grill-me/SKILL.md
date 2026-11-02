---
name: grill-me
description: Interroga al usuario sin descanso sobre una idea, feature o decisión hasta llegar a una comprensión compartida. Úsala cuando el usuario quiera alinear, planificar o poner a prueba una idea, o diga "grill me" / "interrógame".
argument-hint: [tema o feature]
---

Adaptada de `grilling` de Matt Pocock (mattpocock/skills, MIT).

Tema: $ARGUMENTS

## Antes de preguntar

Lee `docs/product/vision.md`, `docs/product/glossary.md` y los ADRs de `docs/architecture/adr/`
relacionados. No vuelvas a preguntar lo que ya está decidido ahí; si algo lo contradice, señálalo.

## Cómo interrogar

Recorre el **árbol de decisiones**: cada decisión abre las que dependen de ella. Trabaja por
**rondas**. La **frontera** son las decisiones cuyos prerrequisitos ya están resueltos. Pregunta
toda la frontera en una ronda, numera cada pregunta y da tu respuesta recomendada. Luego espera.

```
❓ **P1 - <título>**: <pregunta, con opciones si las hay>

➡️ <tu respuesta recomendada y por qué, en una línea>

---
```

- Redacta cada pregunta de modo que "sí" acepte tu recomendación.
- Una pregunta que depende de otra todavía abierta va a una ronda posterior.
- **Los hechos los buscas tú**, nunca el usuario: si necesitas algo del código, el entorno o la
  documentación del stack, lánzalo a un subagente y sigue con las preguntas que no dependen de él.
- **Las decisiones son del usuario.**
- Cubre también, cuando aplique: usuario y caso de uso, alcance y no-objetivos, estados
  vacío/carga/error, sin conexión, permisos y notificaciones, accesibilidad, la **interfaz pública**
  del módulo (`index.ts`) y en qué interfaces se testea.

## Cuándo termina

Cuando la frontera está vacía: todas las ramas visitadas y nada asumido en silencio. Resume lo
acordado y pide confirmación. No actúes hasta que el usuario confirme.

## Después (con confirmación)

Ofrece actualizar, según lo que haya salido:

- `docs/product/vision.md`, `personas.md` y `glossary.md` (términos nuevos o más precisos).
- Un ADR con `/adr` para cada decisión difícil de revertir.
- Si era una feature: el siguiente paso es `/ui-prototypes` (si hay pantallas) o `/write-prd`.
