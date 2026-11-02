---
name: ui-prototypes
description: Genera 3 variantes radicalmente distintas de una pantalla, intercambiables en el simulador, para que el usuario elija antes de especificar. Úsala cuando haya que decidir cómo se ve una pantalla.
disable-model-invocation: true
argument-hint: <pantalla o pregunta de diseño>
---

Adaptada de `prototype` (rama UI) de Matt Pocock (mattpocock/skills, MIT).

Pregunta de diseño: $ARGUMENTS

## Reglas

- **3 variantes** (máximo 5), **estructuralmente distintas**: otra disposición, otra jerarquía, otra
  acción principal. Tres listas de tarjetas con distinto color no son prototipos.
- Solo con `@/shared/ui` y tokens de `useTheme()`; respetan `docs/design/identity.md` y
  `docs/design/ui-patterns.md`. Si una variante necesita un componente nuevo, constrúyelo dentro
  del prototipo; no lo añadas a `shared/ui` todavía.
- Datos falsos y realistas (con textos en español del dominio), sin mutaciones reales.
- Trabaja en una rama `prototype/<nombre>`; nada de esto llega a `main`.

## Montaje

1. Si la pantalla existe, las variantes se montan en esa ruta. Si no, crea
   `src/app/prototype-<nombre>.tsx`.
2. Lee la variante con `useLocalSearchParams<{ variant?: string }>()` (por defecto `A`).
3. Añade un selector flotante en la parte inferior, visible solo en `__DEV__`, con flechas que
   cambian el parámetro (`router.setParams({ variant })`).

## Entrega

1. Abre la app en el simulador y toma una captura de cada variante en modo claro y oscuro
   (`xcrun simctl io booted screenshot <ruta>`). Muéstraselas al usuario.
2. Dile cómo abrir cada una (`{{APP_SCHEME}}://<ruta>?variant=B`).
3. Lo interesante suele ser "la cabecera de B con la lista de C": esa es la respuesta.

## Al elegir

1. Guarda la captura de la versión final en `docs/design/references/screen-<feature>-<pantalla>.png`
   y añádela al índice de esa carpeta.
2. Anota qué se eligió y por qué en la conversación (servirá para `/write-prd`).
3. El código del prototipo no se promociona tal cual: se reescribe con tests en las issues.
