# Arquitectura

<!-- ADAPTAR: los principios de este documento son la parte agéntica y conviene conservarlos;
     la estructura de carpetas y la tabla de reglas dependen del stack. -->

Arquitectura pragmática, organizada **por feature**. Cada feature es un **módulo profundo**: una
interfaz pública pequeña y mucha funcionalidad detrás. Las decisiones que la fundamentan están en
`adr/`.

## Estructura

```text
src/
├── <entrada>/           # Rutas, pantallas, endpoints o comandos. Solo componen. Sin lógica.
├── features/
│   └── <feature>/
│       ├── index.ts       # ÚNICA interfaz pública. La diseña el humano.
│       ├── domain/        # Entidades y reglas puras. Sin framework, sin red, sin disco.
│       ├── data/          # Repositorios: API, base de datos, caché.
│       ├── hooks/         # Casos de uso expuestos a la UI o a los puntos de entrada.
│       └── ui/            # Componentes propios de la feature (si hay UI).
└── shared/              # Código sin dominio: design system, utilidades. No conoce features.
```

## Reglas de dependencia

Las flechas indican "puede importar de":

```text
<entrada> ──► features/<x>/index ──► (interior de la feature) ──► shared/
                                     ui ─► hooks ─► data ─► domain
```

| Regla                                                                          | Mecanismo |
| ------------------------------------------------------------------------------ | --------- |
| `domain/` no importa el framework, la red, el disco ni otras capas o features. | Linter    |
| Una feature solo se importa a través de su `index`.                            | Linter    |
| `shared/` no conoce features ni puntos de entrada.                             | Linter    |
| Los puntos de entrada no contienen lógica de negocio.                          | Revisor   |

Impón con el linter todo lo que se pueda: el feedback mecánico e inmediato es lo que mejor corrige a
un agente. Lo que no se puede imponer lo comprueba el subagente `reviewer`.

## Módulos profundos: cómo se trabaja

1. **El humano diseña la interfaz** pública (tipos y funciones exportadas) durante `/grill-me` o
   `/write-prd`. Es el contrato y la superficie de test.
2. **La IA implementa el interior** como una caja gris: puede reorganizarlo libremente mientras la
   interfaz y los tests se mantengan.
3. **Los tests van contra la interfaz pública**, nunca contra archivos internos. Así un refactor
   interno no rompe tests.
4. **Señal de alarma:** si entender un concepto exige saltar entre muchos archivos pequeños, el
   módulo es superficial. Corre `/improve-architecture`.

## Puertos y adaptadores (solo cuando hay dos implementaciones reales)

`domain/` declara la interfaz de un repositorio (puerto) solo cuando existen o van a existir dos
implementaciones de verdad (por ejemplo, memoria para tests y base de datos en producción). Con una
sola implementación, `data/` se usa directamente. Una abstracción con un solo adaptador es
especulativa.

## Estado y datos

<!-- Pendiente: decide gestión de estado y persistencia en la fase 1 y regístralo con /adr. -->
