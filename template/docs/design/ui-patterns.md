# Patrones de UI

<!-- Si el proyecto no tiene UI, borra este archivo y su fila en CLAUDE.md. -->

Reglas de pantalla que aplican sea cual sea la identidad visual. El revisor las comprueba siempre.

## Composición

- Toda pantalla se compone con los componentes del design system compartido. Si falta uno, se añade
  allí (con test) antes de estilizar algo a mano en una feature.
- Un solo botón primario por pantalla. Las demás acciones son secundarias.

## Los cuatro estados de toda pantalla con datos

Cada pantalla que carga datos implementa y testea los cuatro:

| Estado    | Qué se muestra                                                          |
| --------- | ----------------------------------------------------------------------- |
| Cargando  | Esqueleto o indicador; nunca una pantalla en blanco.                    |
| Vacío     | Explica qué va aquí y ofrece la acción para crear lo primero.           |
| Error     | Mensaje en lenguaje humano y botón de reintentar. Nunca un stack trace. |
| Con datos | El caso normal.                                                         |

## Accesibilidad (mínimos no negociables)

- Áreas táctiles o clicables cómodas (al menos 44-48 px).
- Todo elemento interactivo tiene rol y una etiqueta legible.
- Respetar el tamaño de texto del sistema o del navegador: no fijar alturas que corten el texto.
- Contraste WCAG AA garantizado por los tokens; no usar opacidad sobre texto para "aclararlo".
- Respetar "reducir movimiento" en animaciones no esenciales.
- Navegable con teclado (web) o con lector de pantalla (móvil).

## Plataforma

<!-- ADAPTAR: convenciones de la plataforma (gestos, áreas seguras, teclado, rutas...). -->

## Textos

- Los textos de UI van en el idioma del producto, con el tono de `docs/design/identity.md`.
- Los nombres de conceptos son los de `docs/product/glossary.md`.
