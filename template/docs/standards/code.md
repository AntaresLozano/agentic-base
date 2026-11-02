# Estándares de código

Ejemplos en TypeScript: si tu stack es otro, conserva las reglas y cambia los ejemplos.

Lo que ya imponen las herramientas (TypeScript, ESLint, Prettier) no se repite aquí. Esto es lo que
el revisor comprueba a mano.

## Nombres

- Código en inglés; textos de UI en el idioma del producto.
- Los conceptos del dominio usan exactamente el término de `docs/product/glossary.md`.
- Archivos en `kebab-case` (`order-list.tsx`); componentes en `PascalCase`; hooks `useXxx`.
- Booleanos con prefijo `is`, `has`, `can` o `should`.
- Un nombre que necesita un comentario para entenderse es un mal nombre.

## Funciones y módulos

- Una feature expone solo lo necesario en `index.ts`. Exportar algo es una decisión de diseño.
- Sin abstracciones especulativas: nada de parámetros, genéricos ni interfaces "por si acaso".
- Preferir funciones puras en `domain/`; los efectos (red, disco, fechas actuales) entran como
  parámetros o viven en `data/`.
- El tiempo es una dependencia: el dominio recibe `now: Date`, nunca llama a `new Date()` por dentro.

## Tipos

- Prohibido `any`. `unknown` + validación en los bordes (red, almacenamiento, deep links).
- Modelar estados con uniones discriminadas, no con varios booleanos:
  `{ status: 'loading' } | { status: 'error'; error: AppError } | { status: 'ready'; data: T }`.
- Usar tipos de dominio pequeños en vez de primitivos sueltos cuando el concepto importa
  (`OrderId` en vez de `string`).

## Errores

- Los errores esperados del dominio se devuelven como valores (uniones), no como excepciones.
- Las excepciones son para lo inesperado. Se capturan en el borde (hooks) y se muestran con el
  estado de error de la pantalla (`docs/design/ui-patterns.md`).
- Nunca tragar un error en silencio (`catch {}` vacío).

## Componentes

- Sin lógica de negocio en componentes: la UI llama hooks y renderiza.
- Estilos solo con tokens vía `useTheme()` o componentes de `@/shared/ui`.
- Accesibilidad: rol y etiqueta en todo lo interactivo.

## Comentarios

- Explican el _porqué_, no el _qué_. Sin código comentado; para eso está git.

## Commits

- Conventional Commits: `feat(orders): create order from cart (#12)`.
- Un commit por issue o paso lógico; cada commit deja tipos, lint y tests en verde.
