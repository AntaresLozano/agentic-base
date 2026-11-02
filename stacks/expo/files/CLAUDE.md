# {{PROJECT_NAME}}

App móvil para iOS y Android. El concepto, el usuario y el alcance están PENDIENTES de definir con
`/grill-me` (fase 1): no asumas nada del producto que no esté en `docs/product/`.

@AGENTS.md

## Stack y comandos

Expo · React Native · TypeScript estricto · Expo Router · pnpm. Versiones exactas en `package.json`.

| Para                   | Comando                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------- |
| Todo antes de terminar | `pnpm check` (tipos + lint + formato + tests)                                           |
| Tipos                  | `pnpm typecheck`                                                                        |
| Lint                   | `pnpm lint` (`pnpm lint:fix` para corregir)                                             |
| Tests                  | `pnpm test` · `pnpm test:related <archivos>`                                            |
| E2E                    | `pnpm e2e` (necesita development build: `npx expo run:ios`)                             |
| Simulador              | `pnpm ios`                                                                              |
| Añadir dependencias    | `CI=true npx expo install <pkg> </dev/null` (nunca `pnpm add` para paquetes de Expo/RN) |

## Reglas que más se rompen

1. Ningún color, tamaño de fuente, espaciado ni radio literal fuera de `src/theme/`: usa `useTheme()`
   o `@/shared/ui`. ESLint lo bloquea.
2. Una feature se importa solo por `@/features/<x>` (su `index.ts`). `domain/` es TypeScript puro.
3. Las rutas de `src/app/` solo componen pantallas; la lógica vive en `src/features/`.
4. No uses `Text` de react-native; usa `Text` de `@/shared/ui`.
5. TDD en `domain/`. Tests solo contra interfaces públicas. RNTL 14 es asíncrono (`await render`).
6. Los nombres del dominio salen de `docs/product/glossary.md`. Si falta un término, añádelo primero.
7. No edites `ios/`, `android/` ni `.env*`. Cambiar `src/theme/tokens.ts` requiere aprobación.
8. Una issue por sesión. Al terminar: commit y `/clear`.

## Qué leer según la tarea

| Tarea                            | Lee primero                                                               |
| -------------------------------- | ------------------------------------------------------------------------- |
| Planificar o decidir producto    | `docs/product/vision.md`, `docs/product/glossary.md`                      |
| Crear o cambiar pantallas        | `docs/design/ui-patterns.md`, `docs/design/identity.md`, `src/shared/ui/` |
| Crear una feature o mover código | `docs/architecture/overview.md`, `docs/architecture/adr/`                 |
| Escribir código                  | `docs/standards/code.md`                                                  |
| Escribir tests                   | `docs/standards/testing.md`                                               |
| Entender el proceso              | `docs/workflow.md`                                                        |

## Terminado significa

- `pnpm check` en verde.
- Si hay UI: verificada en el simulador en modo claro y oscuro (subagente `ui-verifier`).
- Commit con Conventional Commits que referencia la issue (`feat(<feature>): ... (#12)`).
