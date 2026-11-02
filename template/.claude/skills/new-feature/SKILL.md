---
name: new-feature
description: Crea el esqueleto de una feature (módulo) con su interfaz pública, sus capas y un primer test, siguiendo docs/architecture/overview.md. Úsala al empezar la primera issue de una feature nueva.
argument-hint: <nombre-en-kebab-case>
---

Feature: $ARGUMENTS

1. Comprueba que el nombre (o su concepto) está en `docs/product/glossary.md`. Si no, propón la
   entrada del glosario y espera confirmación.
2. Lee `docs/architecture/overview.md`: define dónde viven los módulos y qué capas tienen. Si no
   dice otra cosa, la estructura es esta.
3. Crea solo lo que la issue actual necesita (no capas vacías por si acaso):

```text
src/features/<nombre>/
├── index.ts          # interfaz pública: solo lo que usan los puntos de entrada u otros módulos
├── domain/           # si hay reglas de negocio (lógica pura, sin framework ni I/O)
├── data/             # si hay persistencia o red
├── hooks/            # casos de uso que consume la UI (o services/ si no hay UI)
└── ui/               # componentes propios, compuestos con el design system compartido
```

4. La interfaz pública empieza con un comentario de una línea que describe el módulo, y exporta
   explícitamente (nada de `export *`):

```ts
/** Orders: create, pay and cancel orders. */
export { useOrders } from './hooks/use-orders';
export type { Order, OrderId } from './domain/order';
```

5. Si la interfaz pública no está definida en el PRD o en la issue, propónla y **pide aprobación**:
   el humano diseña las interfaces.
6. Sigue con `/tdd` sobre esa interfaz.
