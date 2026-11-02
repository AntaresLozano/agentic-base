# Architecture Decision Records

Una decisión por archivo, numeradas: `NNNN-titulo-corto.md`. Se crean con `/adr`.

Un ADR se escribe cuando la decisión es difícil de revertir, cuando sorprendería a alguien nuevo, o
cuando la IA podría volver a proponer la alternativa descartada. Los ADRs no se editan para cambiar
la decisión: se escribe uno nuevo que "sustituye a" el anterior.

Estados: **Propuesta** · **Aceptada** · **Sustituida por NNNN** · **Descartada**.

| ADR                                      | Decisión                                  | Estado   |
| ---------------------------------------- | ----------------------------------------- | -------- |
| [0001](0001-arquitectura-por-feature.md) | Módulos por feature con interfaz única    | Aceptada |
| [0002](0002-stack-expo.md)               | Expo + React Native + TypeScript estricto | Aceptada |
| [0003](0003-navegacion.md)               | Expo Router con rutas en `src/app/`       | Aceptada |

Decisiones que suelen quedar pendientes tras la fase 1: gestión de estado y persistencia/backend.

## Plantilla

```markdown
# NNNN. Título

- **Estado:** Propuesta
- **Fecha:** AAAA-MM-DD

## Contexto

Qué fuerza esta decisión.

## Decisión

Qué se decide, en una o dos frases.

## Alternativas consideradas

- Opción: por qué no.

## Consecuencias

Qué se vuelve más fácil, qué más difícil, qué queda prohibido.
```
