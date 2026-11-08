# Gimnasio Titanes · Panel de administración (Práctica 19)

El panel de administración del gimnasio, hecho con Angular 22. Por ahora es un tablero con datos
locales (las 8 clases del seed escritas a mano): un resumen con tres números y una tarjeta por
clase. Todo con componentes standalone, un `input.required()` y el flujo de control del template
(`@if`, `@for`, `@empty`).

## Cómo correrlo

```bash
npm install
npx ng serve        # http://localhost:4200  (también: npm start)
```

Se usa `npx ng` porque el CLI de Angular no está instalado global: `npx` usa el que trae el
proyecto en `node_modules`.

