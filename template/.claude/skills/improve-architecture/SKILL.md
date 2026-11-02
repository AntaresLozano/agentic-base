---
name: improve-architecture
description: Analiza el código en busca de módulos superficiales y propone hacerlos más profundos (mejor testeabilidad y navegabilidad para la IA). Correr cada 2-3 semanas.
disable-model-invocation: true
argument-hint: [área opcional]
---

Adaptada de `improve-codebase-architecture` de Matt Pocock (mattpocock/skills, MIT).

Área: $ARGUMENTS (si está vacía, decide tú dónde mirar).

## Vocabulario (úsalo con precisión)

- **Módulo:** una feature o pieza con interfaz propia. **Interfaz:** lo que exporta.
- **Profundidad:** mucha funcionalidad detrás de una interfaz pequeña. **Superficial:** la interfaz
  es casi tan compleja como lo que oculta.
- **Seam:** interfaz pública donde se testea. **Localidad:** lo que cambia junto, vive junto.
- **Prueba de borrado:** si borrar un módulo concentra la complejidad en otro sitio, era
  superficial; si solo la mueve, no.

## 1. Explora

- Con área: céntrate ahí.
- Sin área: mira `git log --oneline -50 --stat` para encontrar las zonas que más cambian.
- Lee `docs/product/glossary.md`, `docs/architecture/overview.md` y los ADRs.
- Lanza un subagente con contexto limpio para recorrer el código y anotar fricción:
  conceptos repartidos en muchos archivos pequeños, interfaces superficiales, funciones extraídas
  solo para testear, módulos que se filtran entre sí, zonas sin tests o difíciles de testear.

## 2. Presenta candidatos

En el chat, una tarjeta por candidato:

- **Archivos / módulos implicados**
- **Problema:** por qué causa fricción
- **Propuesta:** qué cambiaría, en lenguaje llano
- **Beneficio:** en términos de localidad y de cómo mejoran los tests
- **Antes / después:** un diagrama ASCII o mermaid corto
- **Fuerza:** `Fuerte` · `Vale la pena explorar` · `Especulativo`
- Si contradice un ADR, dilo y explica por qué reabrirlo.

Termina con tu **recomendación principal**. No propongas interfaces todavía. Pregunta: "¿Cuál
quieres explorar?"

## 3. Profundiza

Con el candidato elegido, usa `/grill-me` para recorrer las decisiones: forma del módulo
profundizado, qué queda detrás de la interfaz, qué tests sobreviven. Actualiza el glosario si nace
un concepto y ofrece un ADR si el usuario descarta el cambio por una razón que convenga recordar.
