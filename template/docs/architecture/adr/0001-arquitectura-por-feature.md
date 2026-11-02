# 0001. Módulos por feature con interfaz única

- **Estado:** Aceptada
- **Fecha:** {{TODAY}}

## Contexto

El proyecto se desarrolla principalmente con agentes de IA. Organizar el código por capas globales
(`/repositories`, `/usecases`, `/screens`) produce muchos módulos superficiales: entender una
feature exige saltar entre carpetas lejanas, y eso confunde a los agentes y dificulta los tests.

## Decisión

Organizar por feature (`src/features/<x>/`), cada una con capas internas `domain`, `data`, `hooks` y
`ui`, y una sola interfaz pública: `index`. Las reglas de dependencia se imponen con el linter (ver
`../overview.md`).

## Alternativas consideradas

- **Arquitectura por capas globales:** demasiados archivos pequeños y acoplamiento difuso.
- **Sin estructura (todo en `components/` o `utils/`):** rápido al principio, inmanejable después.

## Consecuencias

- Los tests se escriben contra la interfaz pública, lo que permite refactorizar el interior.
- Compartir código entre features obliga a moverlo a `shared/` o a exponerlo en su `index`.
- La IA puede cargar una feature entera en contexto sin arrastrar el resto del proyecto.
