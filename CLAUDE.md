# agentic-base (mantenimiento de la plantilla)

Este repo es una plantilla, no un proyecto: `template/` y `stacks/` se copian en otros proyectos con
`scripts/install.mjs`. Los `CLAUDE.md` que hay dentro de `template/` y `stacks/` son plantillas para
esos proyectos, no instrucciones para ti.

## Reglas

- El núcleo (`template/`) no menciona ningún stack concreto. Lo específico va a `stacks/<nombre>/files/`.
- Los hooks no contienen valores de stack: todo sale de `.claude/hooks/config.json`.
- Docs, skills y manual en español; código y comentarios de código en inglés.
- Si cambias un skill, comando, subagente o hook, actualiza `manual/04-referencia.md`.
- Las skills adaptadas de `mattpocock/skills` conservan su línea de atribución.

## Comprobar un cambio

```bash
node scripts/install.mjs --target "$(mktemp -d)" --stack expo --dry-run
```

Y para probar de verdad, instala en un directorio temporal con `git init` y ejecuta los hooks a mano
(ver `manual/06-problemas-frecuentes.md`).
