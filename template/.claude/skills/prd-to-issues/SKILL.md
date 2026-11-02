---
name: prd-to-issues
description: Divide un PRD (issue de GitHub) en issues verticales tipo tracer bullet, con dependencias de bloqueo y etiqueta afk/hitl, y las publica en GitHub.
disable-model-invocation: true
argument-hint: '#<número del PRD>'
---

Adaptada de `to-tickets` de Matt Pocock (mattpocock/skills, MIT).

PRD: $ARGUMENTS (léelo con `gh issue view <n> --comments`).

## 1. Explora

Lee el código afectado, `docs/product/glossary.md` y los ADRs relevantes. Busca refactors previos
que faciliten el trabajo: "haz fácil el cambio, luego haz el cambio fácil". Esos van primero.

## 2. Corta en rebanadas verticales

Cada issue:

- Atraviesa **todas las capas** necesarias con algo pequeño: `domain` → `data` → casos de uso →
  UI o punto de entrada (ruta, endpoint, comando) → test. **Nunca** "toda la capa de datos" en una issue.
- Es **visible o verificable** por sí sola, idealmente en la app.
- Cabe en **una sola sesión** con el contexto limpio (muy por debajo de 100k tokens).
- Declara qué issues la **bloquean**. Sin bloqueantes = se puede empezar ya.
- Se etiqueta `afk` (un agente la hace solo) o `hitl` (requiere decisión o revisión humana: diseño
  visual nuevo, permisos del sistema, textos sensibles, cambios de tokens o de
  contratos públicos).

Excepción: un refactor mecánico amplio (renombrar algo usado en todas partes) se hace con
expandir → migrar por lotes → contraer, cada paso como issue.

## 3. Consulta al usuario

Presenta la lista numerada: **título**, **bloqueada por**, **qué entrega**, **afk/hitl**. Pregunta si
la granularidad, las dependencias y las etiquetas son correctas. Itera hasta que lo apruebe.

## 4. Publica

En orden de dependencias (las bloqueantes primero), para poder referenciar números reales:

```bash
gh issue create --title "<título>" --label ready-for-agent --label afk --body-file <tmp>
```

```markdown
## PRD

#<número del PRD>

## Qué construir

Comportamiento de punta a punta desde la perspectiva del usuario.

## Criterios de aceptación

- [ ] ...
- [ ] Estados vacío/carga/error cubiertos (si hay datos)
- [ ] Verificado visualmente, en modo claro y oscuro (si hay UI)

## Bloqueada por

- #<n>, o "Ninguna"
```

No modifiques ni cierres la issue del PRD.
