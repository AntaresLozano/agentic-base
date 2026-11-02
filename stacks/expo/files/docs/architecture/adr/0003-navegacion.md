# 0003. Expo Router con rutas en `src/app/`

- **Estado:** Aceptada
- **Fecha:** {{TODAY}}

## Contexto

Hace falta navegación con deep links, rutas tipadas y comportamiento nativo en cada plataforma.

## Decisión

Expo Router basado en archivos, con rutas en `src/app/` y `typedRoutes` activado. Los archivos de
ruta solo componen pantallas a partir de la interfaz pública de las features y de `@/shared/ui`.

## Alternativas consideradas

- **React Navigation directo:** más configuración manual y sin rutas tipadas por archivo.

## Consecuencias

- Cada archivo en `src/app/` es una pantalla: el código que no es ruta vive fuera de esa carpeta.
- Deep links gratis con el esquema `{{APP_SCHEME}}://`.
