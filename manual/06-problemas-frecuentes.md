# 6. Problemas frecuentes

**Los hooks no hacen nada.**
Comprueba que `node --version` funciona en la shell que usa Claude Code y que
`.claude/settings.json` está en la raíz del proyecto (donde abres Claude Code). Prueba un hook a mano:

```bash
echo '{"tool_input":{"file_path":"'"$PWD"'/src/x.ts"}}' | node .claude/hooks/after-edit.mjs; echo $?
```

Si la herramienta configurada no está instalada, el paso se omite en silencio: revisa las rutas de
`.claude/hooks/config.json`.

**Claude se queda en bucle al terminar ("Antes de terminar, corrige estos fallos…").**
Es el hook de parada: hay errores de tipos o tests rotos en archivos cambiados. Solo reintenta una
vez por turno (`stop_hook_active`). Si el fallo no es suyo (un test roto de antes), díselo, o
arréglalo tú y vuelve a pedir.

**El hook de parada tarda mucho.**
Cachea el último conjunto verde, pero el typecheck es de todo el proyecto. Si es lento, cambia
`typecheck.command` por algo incremental o súbele el `timeout` en `settings.json` (180 s por
defecto).

**Claude dice que no puede editar un archivo.**
Está en `protect.deny`. Es intencionado (secretos, lockfiles, generados). Edítalo tú, o quita el
patrón si de verdad no aplica a tu proyecto.

**No aparece la status line.**
Necesita `node` y que el proyecto sea el directorio de trabajo. Si tienes una status line global en
`~/.claude/settings.json`, la del proyecto la sustituye.

**`/next-issue` no encuentra issues.**
Busca `--label ready-for-agent --state open`. ¿Creaste las etiquetas (`scripts/setup-github-labels.sh`)
y las issues tienen esa etiqueta? ¿`gh auth status` está bien y el remoto apunta al repo correcto?

**La IA inventa cosas del producto.**
¿Hiciste la fase 1? Mientras `docs/product/` esté vacío, `CLAUDE.md` debe decir que el producto está
pendiente. Después, la visión y los no-objetivos son lo que la IA usa para descartar ideas.

**La IA vuelve a proponer algo que ya descartamos.**
Falta un ADR. `/adr <la decisión y por qué>`.

**La calidad baja a mitad de sesión.**
Mira la status line: probablemente pasas de ~100k tokens. Termina la porción, commit, `/clear`, y
continúa en una sesión nueva desde la issue (el `implementer` deja notas en la issue si no termina).

**El revisor se queja de algo que el linter podría detectar.**
Pásalo al linter. Cada regla que se mueve de un documento a una herramienta es una regla que deja
de romperse.

**Quiero actualizar la base en un proyecto que ya la tiene.**
Vuelve a ejecutar el instalador sin `--force`: crea lo nuevo y lista lo que difiere. Compara cada
archivo omitido con `diff` y fusiona a mano lo que quieras; tus adaptaciones de `CLAUDE.md` y
`config.json` son tuyas.
