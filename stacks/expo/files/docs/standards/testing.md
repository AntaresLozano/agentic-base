# Estándares de testing

La calidad de los tests es el techo de la calidad de la IA. Un test que pasa "por construcción" es
peor que no tener test.

## Herramientas

| Capa                  | Herramienta                                      | Comando                                 |
| --------------------- | ------------------------------------------------ | --------------------------------------- |
| Dominio y lógica pura | Jest (preset `jest-expo`)                        | `pnpm test`                             |
| Componentes y hooks   | React Native Testing Library 14                  | `pnpm test`                             |
| Flujos completos      | Maestro (`.maestro/*.yaml`)                      | `pnpm e2e` (requiere development build) |
| Visual                | Subagente `ui-verifier` (capturas del simulador) | `/qa`                                   |

Testing Library 14 cambió su API: `render` y `userEvent` son asíncronos. Su guía oficial para LLMs
está en `node_modules/@testing-library/react-native/docs/guides/llm-guidelines.md`. Léela antes de
escribir tests de componentes.

## Dónde van los tests

- Junto al código: `order.ts` → `order.test.ts`.
- **Solo en las interfaces acordadas** (_seams_): el `index.ts` de la feature, los hooks públicos y
  los componentes de `shared/ui`. Nunca contra funciones internas.
- E2E en `.maestro/<feature>-<flujo>.yaml`, con un flujo por historia de usuario importante.

## TDD

Obligatorio en `domain/`: rojo, verde, una porción a la vez. Ver la skill `/tdd`.

## Qué hace bueno a un test

- Se lee como una especificación: `it('rejects an order without items')`.
- Sobrevive a un refactor interno; si se rompe sin que cambie el comportamiento, estaba acoplado.
- El valor esperado viene de una fuente independiente (un literal conocido, un ejemplo resuelto a
  mano o la especificación), nunca recalculado como lo hace el código.
- Fechas y horas fijas e inyectadas; nada de `Date.now()` sin controlar.

## Antipatrones

- Mockear colaboradores internos de la propia feature.
- Snapshots de árboles de componentes completos (se aprueban sin leer).
- `getByTestId` cuando hay texto o rol accesible (prioridad: `getByRole` → `getByLabelText` →
  `getByText` → `getByTestId`).
- Escribir todos los tests primero y luego todo el código (slicing horizontal).

## Mocks permitidos

Solo en los bordes del sistema: red, almacenamiento, notificaciones, reloj y módulos nativos de Expo.
