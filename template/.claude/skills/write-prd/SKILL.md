---
name: write-prd
description: Convierte la conversación actual (normalmente tras /grill-me) en un PRD y lo publica como issue padre en GitHub. No entrevista: sintetiza.
disable-model-invocation: true
---

Adaptada de `to-spec` de Matt Pocock (mattpocock/skills, MIT).

No vuelvas a entrevistar al usuario: sintetiza lo que ya se habló.

## Proceso

1. Si no lo has hecho, explora el código relevante. Usa el vocabulario de
   `docs/product/glossary.md` y respeta los ADRs de `docs/architecture/adr/`.
2. Propón las **interfaces de test** (_seams_): las interfaces públicas donde se observará el
   comportamiento, normalmente el `index.ts` de la feature y sus hooks. Cuantas menos, mejor.
   Confírmalas con el usuario.
3. Escribe el PRD con la plantilla y publícalo:
   `gh issue create --title "PRD: <feature>" --label prd --body-file <archivo temporal>`.
   No guardes el PRD en el repo.
4. Devuelve el número de la issue y sugiere `/prd-to-issues #<n>`.

## Plantilla

```markdown
## Problema

Desde la perspectiva del usuario.

## Solución

Desde la perspectiva del usuario.

## Historias de usuario

Lista numerada y exhaustiva: "Como <actor>, quiero <capacidad>, para <beneficio>".
Incluye estados vacío, carga, error, sin conexión y accesibilidad.

## Decisiones de implementación

- Módulos (features) que se crean o modifican.
- Interfaz pública de cada módulo (`index.ts`): tipos y funciones exportadas.
- Modelo de datos y persistencia.
- Puntos de entrada nuevos: rutas, pantallas, endpoints o comandos.
- Referencia visual elegida (`docs/design/references/...`), si hay UI.
  Sin rutas de archivos internos ni fragmentos de código (se desactualizan), salvo un tipo o máquina
  de estados que salga de un prototipo y fije una decisión mejor que la prosa.

## Decisiones de testing

- Interfaces de test acordadas y qué cubre cada una.
- Flujos E2E que se añaden (si el proyecto los usa).

## Fuera de alcance

## Notas
```
