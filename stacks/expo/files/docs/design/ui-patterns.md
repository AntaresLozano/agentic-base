# Patrones de UI

Reglas de pantalla que aplican sea cual sea la identidad visual. El revisor las comprueba siempre.

## Composición

- Toda ruta empieza con `<Screen>` de `@/shared/ui`: da área segura, fondo y márgenes.
- Se compone con `Stack`, `Card`, `Text` y `Button`. Si falta un componente, se añade a
  `src/shared/ui/` (con test) antes de estilizar algo a mano en una feature.
- Un solo botón primario por pantalla. Las demás acciones son `secondary` o `ghost`.

## Los cuatro estados de toda pantalla con datos

Cada pantalla que carga datos implementa y testea los cuatro:

| Estado    | Qué se muestra                                                          |
| --------- | ----------------------------------------------------------------------- |
| Cargando  | Esqueleto o indicador; nunca una pantalla en blanco.                    |
| Vacío     | Explica qué va aquí y ofrece la acción para crear lo primero.           |
| Error     | Mensaje en lenguaje humano y botón de reintentar. Nunca un stack trace. |
| Con datos | El caso normal.                                                         |

## Accesibilidad (mínimos no negociables)

- Áreas táctiles de al menos `touchTarget` (48) de alto y ancho.
- Todo elemento interactivo tiene `accessibilityRole` y una etiqueta legible.
- Respetar el tamaño de texto del sistema (Dynamic Type / escala de fuente): no fijar alturas que
  corten el texto.
- Contraste AA garantizado por los tokens; no usar opacidad sobre texto para "aclararlo".
- Respetar "reducir movimiento" en animaciones no esenciales.

## Plataforma

- Navegación con Expo Router; gestos de volver nativos en cada plataforma.
- Teclado: los formularios usan `KeyboardAvoidingView` o equivalente y no tapan el campo activo.
- Respetar el notch, la isla dinámica y la barra de gestos (lo hace `Screen`).

## Textos

- Los textos de UI van en español, con el tono de `docs/design/identity.md`.
- Los nombres de conceptos son los de `docs/product/glossary.md`.
