# Identidad visual

> **Estado: PENDIENTE (fase 2).** Los tokens de diseño son provisionales y neutros. Este documento
> y esos tokens se definen juntos en la fase 2.

<!-- Si el proyecto no tiene UI, borra este archivo y su fila en CLAUDE.md. -->

## Cómo se aplica la identidad (vigente desde ya)

- **La fuente de verdad es código:** el archivo de tokens (`src/theme/tokens.ts` o el equivalente de
  tu stack). Este documento explica el _porqué_; los tokens son el _qué_.
- **Nada de valores literales** de color, tamaño de fuente, espaciado o radio fuera del tema. El
  linter lo bloquea.
- **Colores semánticos, no de paleta:** los componentes usan `colors.accent` o
  `colors.textSecondary`, nunca `indigo600`.
- **Modo claro y oscuro desde el día uno.** Toda pantalla se verifica en ambos.
- **Contraste WCAG AA** garantizado por un test sobre los tokens. Si un cambio de paleta rompe el
  test, se corrige el token.
- **Cambiar valores de tokens requiere tu aprobación:** un hook pide confirmación antes de que la IA
  edite el archivo de tokens (`protect.ask` en `.claude/hooks/config.json`).

## Personalidad de marca

<!-- 3-5 adjetivos con una frase cada uno. Ej.: "Calmada: nunca usamos urgencia ni culpa". -->

## Lo que NO somos

<!-- Con ejemplos concretos: "No somos gamificación agresiva (rachas que castigan, confeti en todo)". -->

## Tono de voz (textos de la UI)

<!-- ¿Tuteo o usted? ¿Humor? Longitud de los textos. Ejemplos buenos y malos. -->

## Color

<!-- Qué transmite el color de acento y cuándo se usa. Cuándo se usa success/warning/danger. -->

## Tipografía

<!-- Fuente (¿sistema o personalizada?) y cuándo usar cada variante: display, title, heading... -->

## Forma y espacio

<!-- Radios (¿redondeado, amable?), densidad (¿aireado o compacto?), uso de sombras. -->

## Movimiento

<!-- Cuándo animar, duraciones (tokens `motion`), respeto a "reducir movimiento". -->

## Iconografía e ilustración

<!-- Librería de iconos, estilo (línea, relleno), ilustraciones sí/no. -->

## Referencias

Ver `docs/design/references/`.
