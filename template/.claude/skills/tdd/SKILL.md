---
name: tdd
description: Desarrollo guiado por tests (rojo → verde). Úsala al construir lógica de dominio, hooks o componentes, al arreglar bugs, o cuando se mencione TDD o red-green.
---

Adaptada de `tdd` de Matt Pocock (mattpocock/skills, MIT). Lee `docs/standards/testing.md`.

## Interfaces de test (_seams_)

Los tests van **solo en interfaces públicas acordadas**: el `index.ts` de la feature, sus hooks
públicos o componentes de `shared/ui`. Si la issue o el PRD no las fija, propónlas al usuario antes
de escribir el primer test, con una línea de qué detecta y qué no cada una.

## El bucle

1. **Rojo:** escribe UN test que falla por la razón correcta. Ejecútalo y míralo fallar
   (con el comando de tests relacionados de `CLAUDE.md`).
2. **Verde:** escribe solo el código mínimo para que pase. Nada especulativo.
3. Repite con la siguiente porción. Cada test responde a lo que enseñó el anterior.

El refactor no es parte del bucle: lo propone el revisor (`reviewer`) al final.

## Reglas

- Nombres de tests en lenguaje del glosario: `it('rejects an order without items')`.
- El valor esperado viene de una fuente independiente (literal conocido, ejemplo resuelto a mano),
  nunca recalculado como lo hace el código.
- El tiempo se inyecta (`now: Date`). Nada de `Date.now()` sin controlar.
- Componentes: la herramienta y las consultas de `docs/standards/testing.md` (por rol o texto).
- Mocks solo en los bordes: red, almacenamiento, notificaciones, reloj, módulos de plataforma.
- Prohibido: tests tautológicos, mockear internals propios, escribir todos los tests de golpe.
