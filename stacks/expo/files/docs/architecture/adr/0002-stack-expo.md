# 0002. Expo + React Native + TypeScript estricto

- **Estado:** Aceptada
- **Fecha:** {{TODAY}}

## Contexto

{{PROJECT_NAME}} es una app para iOS y Android desarrollada principalmente con agentes de IA. La calidad
del resultado depende de la velocidad y fiabilidad de los feedback loops (tipos, tests, recarga).

## Decisión

Expo (el SDK vigente al crear el proyecto) con TypeScript en modo `strict` y
`noUncheckedIndexedAccess`, gestionado con pnpm (`nodeLinker: hoisted`). Generación nativa continua:
`ios/` y `android/` no se versionan ni se editan a mano.

## Alternativas consideradas

- **Flutter:** buen rendimiento, pero un ecosistema que la IA conoce peor y tests de UI más lentos.
- **Nativo (Swift + Kotlin):** dos bases de código; duplica el trabajo de los agentes.

## Consecuencias

- Un solo código para ambas plataformas; tests de dominio y de componentes sin emulador.
- Las APIs de Expo cambian en cada SDK: la IA debe consultar la documentación versionada
  (ver `AGENTS.md`) en vez de su memoria.
- Las librerías con código nativo requieren un development build (`npx expo run:ios`).
