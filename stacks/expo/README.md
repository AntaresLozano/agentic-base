# Perfil: Expo + React Native

Perfil probado en una app real (iOS y Android) con Expo SDK 58, React Native 0.88, TypeScript
estricto, Expo Router, pnpm, Jest + React Native Testing Library 14 y Maestro.

## Qué añade al núcleo

| Archivo                         | Para qué                                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------------------ |
| `CLAUDE.md`                     | Comandos `pnpm` y las 8 reglas que más rompe la IA en React Native.                              |
| `AGENTS.md`                     | "Expo cambia en cada SDK: no te fíes de tu memoria", con enlaces a la doc versionada.            |
| `eslint.config.js`              | La arquitectura como lint: capas, interfaz única por feature, nada de colores/tamaños literales. |
| `.claude/hooks/config.json`     | Protege `ios/`, `android/`, lockfiles y pide aprobación para tocar `src/theme/tokens.ts`.        |
| `.claude/settings.json`         | Permisos para `pnpm`, Maestro y el simulador; plugin oficial de Expo.                            |
| `.claude/agents/ui-verifier.md` | Subagente que hace capturas en el simulador (claro y oscuro) y las compara con la referencia.    |
| `.claude/skills/ui-prototypes/` | 3 variantes de una pantalla intercambiables en el simulador.                                     |
| `.maestro/smoke.yaml`           | Primer flujo E2E.                                                                                |
| `.github/workflows/ci.yml`      | `pnpm check` en cada PR.                                                                         |
| `docs/…`                        | Arquitectura, ADRs del stack, patrones de UI y testing específicos de React Native.              |

## Instalación paso a paso

```bash
# 1. Crea la app con la herramienta oficial
npx create-expo-app@latest mi-app && cd mi-app
git init   # si no lo hizo create-expo-app

# 2. React Native necesita node_modules plano con pnpm
printf 'nodeLinker: hoisted\n' >> pnpm-workspace.yaml
rm -rf node_modules package-lock.json && pnpm install

# 3. Instala la base. --force porque create-expo-app ya trae CLAUDE.md, AGENTS.md y eslint.config.js
node ../agentic-base/scripts/install.mjs --stack expo --force

# 4. Herramientas de los feedback loops
CI=true npx expo install jest-expo jest @types/jest -- --save-dev </dev/null
pnpm add -D prettier eslint-config-prettier @testing-library/react-native
npx expo lint   # instala eslint y eslint-config-expo si faltan

# 5. Comprueba
pnpm check
```

Después, en `tsconfig.json`, activa `"strict": true` y `"noUncheckedIndexedAccess": true` y
comprueba que existe el alias `"@/*": ["./src/*"]` (las reglas de ESLint lo usan).

### Primera issue recomendada: el design system mínimo

Las reglas de ESLint asumen que existen `src/theme/` y `src/shared/ui/`. Antes de la primera
pantalla real, crea (o pide a Claude que cree, con `/tdd`):

- `src/theme/tokens.ts`: colores semánticos para claro y oscuro, `spacing`, `radii`, `typography`,
  `touchTarget`. Neutros hasta la fase 2.
- `src/theme/use-theme.ts`: devuelve los tokens del modo actual (`useColorScheme`).
- `src/theme/tokens.test.ts`: comprueba contraste WCAG AA de cada par texto/fondo en ambos modos.
- `src/shared/ui/`: `Screen` (área segura + fondo), `Text` (variantes tipográficas), `Button`
  (`primary`/`secondary`/`ghost`), `Card`, `Stack`, exportados desde `index.ts`.

Si partes de la plantilla por defecto de Expo, sus pantallas de ejemplo violan esas reglas: bórralas
(`pnpm reset-project` si existe el script) antes de pasar `pnpm check`.

### E2E y verificación visual

- Instala Maestro: <https://docs.maestro.dev/getting-started/installing-maestro>.
- Compila un development build una vez: `npx expo run:ios`. Sin él no funcionan `pnpm e2e` ni el
  subagente `ui-verifier`.
- Rellena `appId` en `.maestro/smoke.yaml` si el instalador no lo encontró en `app.json`
  (`expo.ios.bundleIdentifier`).

### Plugin de Expo para Claude Code

`.claude/settings.json` activa `expo@claude-plugins-official`. Si Claude Code avisa de que no lo
encuentra, instálalo desde `/plugin` (marketplace oficial) o borra esa línea.
