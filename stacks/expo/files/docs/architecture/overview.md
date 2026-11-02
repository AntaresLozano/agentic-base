# Arquitectura

Clean architecture pragmática, organizada **por feature**. Cada feature es un **módulo profundo**:
una interfaz pública pequeña (`index.ts`) y mucha funcionalidad detrás. Las decisiones que la
fundamentan están en `adr/`.

## Estructura

```text
src/
├── app/                 # Rutas (Expo Router). Solo componen pantallas. Sin lógica de negocio.
├── features/
│   └── <feature>/
│       ├── index.ts       # ÚNICA interfaz pública. La diseña el humano.
│       ├── domain/        # Entidades y reglas puras. Sin React, sin red, sin Expo.
│       ├── data/          # Repositorios: API, base local, caché. Implementan puertos de domain.
│       ├── hooks/         # Casos de uso expuestos a la UI (useCreateX, useXList...).
│       └── ui/            # Componentes propios de la feature, compuestos con shared/ui.
├── shared/
│   ├── ui/              # Design system: Screen, Text, Button, Card, Stack...
│   └── lib/             # Utilidades sin dominio (fechas, formato, contraste).
└── theme/               # Tokens de diseño + useTheme().
```

## Reglas de dependencia (impuestas por ESLint)

Las flechas indican "puede importar de":

```text
app/ ──► features/<x>/index.ts ──► (interior de la feature) ──► shared/, theme/
                                   ui ─► hooks ─► data ─► domain
```

| Regla                                                                                             | Mecanismo               |
| ------------------------------------------------------------------------------------------------- | ----------------------- |
| `domain/` no importa React, React Native, Expo, `data`, `hooks`, `ui`, `theme` ni otras features. | `no-restricted-imports` |
| Una feature solo se importa a través de `@/features/<x>` (su `index.ts`).                         | `no-restricted-imports` |
| `shared/` no conoce features ni rutas.                                                            | `no-restricted-imports` |
| No se usa `Text` de react-native directamente: se usa `@/shared/ui`.                              | `no-restricted-imports` |
| No hay valores literales de color, fuente, espaciado ni radio fuera de `theme/`.                  | `no-restricted-syntax`  |

Dentro de una feature se usan imports relativos (`../domain/order`). Que una feature importe a
otra por ruta relativa (`../../otra/`) no lo bloquea el lint: lo revisa el subagente `reviewer`.

## Módulos profundos: cómo se trabaja

1. **El humano diseña la interfaz** de `index.ts` (tipos y funciones exportadas) durante `/grill-me`
   o `/write-prd`. Es el contrato y la superficie de test.
2. **La IA implementa el interior** como una caja gris: puede reorganizarlo libremente mientras la
   interfaz y los tests se mantengan.
3. **Los tests van contra la interfaz pública** (`index.ts` o los hooks), nunca contra archivos
   internos. Así un refactor interno no rompe tests.
4. **Señal de alarma:** si entender un concepto exige saltar entre muchos archivos pequeños, el
   módulo es superficial. Corre `/improve-architecture`.

## Puertos y adaptadores (solo cuando hay dos implementaciones reales)

`domain/` declara la interfaz de un repositorio (puerto) solo cuando existen o van a existir dos
implementaciones de verdad (por ejemplo, memoria para tests y SQLite en producción). Con una sola
implementación, `data/` se usa directamente. Una abstracción con un solo adaptador es especulativa.

## Estado y datos

Pendiente de la fase 1. Decide con `/grill-me` y registra con `/adr`: gestión de estado (p. ej.
TanStack Query en los `hooks/` + estado local) y persistencia (p. ej. `expo-sqlite` detrás de un
repositorio en `data/`, con o sin backend).
