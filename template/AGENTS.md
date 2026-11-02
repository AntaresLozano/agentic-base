# Instrucciones del stack

<!-- ADAPTAR. Este archivo lo leen Claude Code (vía @AGENTS.md en CLAUDE.md) y otras herramientas
     de IA (Codex, Cursor, etc.). Va aquí lo que la IA suele hacer MAL con esta tecnología:
     APIs que cambiaron, comandos correctos, dónde está la documentación versionada.
     CLAUDE.md es el proyecto y el proceso; AGENTS.md es el conocimiento del stack. -->

## No confíes en tu memoria para este stack

1. Lee la versión mayor de las dependencias principales en el manifiesto del proyecto.
2. Consulta la documentación de esa versión: `<URL de la documentación versionada>`.
3. Si existe un índice para LLMs (`llms.txt`), úsalo: `<URL>`.

## Comandos

```bash
<comando para instalar dependencias de forma compatible>
<comando para arrancar>
<comando de lint>
<comando de tipos>
```

## Reglas del stack

- <Archivos o carpetas generados que nunca se editan a mano y dónde se configuran en su lugar.>
- <Convenciones del framework: dónde viven las rutas, qué es un punto de entrada, etc.>
