# Estándares de testing

La calidad de los tests es el techo de la calidad de la IA. Un test que pasa "por construcción" es
peor que no tener test.

## Herramientas

<!-- ADAPTAR: una fila por capa con la herramienta y el comando reales del proyecto. -->

| Capa                  | Herramienta                      | Comando  |
| --------------------- | -------------------------------- | -------- |
| Dominio y lógica pura | `<runner de tests unitarios>`    | `<test>` |
| Componentes y hooks   | `<librería de testing de UI>`    | `<test>` |
| Flujos completos      | `<herramienta E2E>`              | `<e2e>`  |
| Visual                | Subagente `ui-verifier` (si hay) | `/qa`    |

Si alguna herramienta cambió su API recientemente o publica una guía para LLMs, enlázala aquí y pide
leerla antes de escribir tests.

## Dónde van los tests

- Junto al código: `order.ts` → `order.test.ts`.
- **Solo en las interfaces acordadas** (_seams_): la interfaz pública de la feature, los casos de uso
  públicos y los componentes compartidos. Nunca contra funciones internas.
- E2E: un flujo por historia de usuario importante.

## TDD

Obligatorio en `domain/`: rojo, verde, una porción a la vez. Ver la skill `/tdd`.

## Qué hace bueno a un test

- Se lee como una especificación: `it('rejects an order without items')`.
- Sobrevive a un refactor interno; si se rompe sin que cambie el comportamiento, estaba acoplado.
- El valor esperado viene de una fuente independiente (un literal conocido, un ejemplo resuelto a
  mano o la especificación), nunca recalculado como lo hace el código.
- Fechas y horas fijas e inyectadas; nada de "ahora" sin controlar.

## Antipatrones

- Mockear colaboradores internos de la propia feature.
- Snapshots de árboles de componentes completos (se aprueban sin leer).
- Buscar elementos por id de test cuando hay texto o rol accesible.
- Escribir todos los tests primero y luego todo el código (slicing horizontal).

## Mocks permitidos

Solo en los bordes del sistema: red, almacenamiento, notificaciones, reloj y módulos de plataforma.
