# Gimnasio Titanes 
## Cómo correrlo

```bash
npm install
npx ng serve        # http://localhost:4200  (también: npm start)
```

Se usa `npx ng` porque el CLI de Angular no está instalado global: `npx` usa el que trae el
proyecto en `node_modules`.

## Cómo se creó

```bash
npx @angular/cli@22 new gimnasio-admin --ssr=false --routing=false --skip-tests --style=css --skip-git
npx ng generate component tarjeta-clase
npx ng generate service catalogo                 # Práctica 20
npx ng generate component filtro-categoria       # Práctica 20
```

- `--ssr=false`: sin renderizado en el servidor.
- `--routing=false`: sin router (todavía hay una sola pantalla).
- `--skip-tests`: sin archivos `.spec.ts`.
- `--skip-git`: el repositorio se crea aparte, al entregar.


## Respuestas · Práctica 20

### Ejercicio 1

**El servicio `Catalogo`** (`src/app/catalogo.ts`)

| Qué | Cómo | Para qué |
|---|---|---|
| `clases`, `categoria` | `signal()` | El estado: se cambian con `set()` |
| `seleccionada` | `linkedSignal()` | La clase elegida: se cambia con `set()`, pero se suelta sola si deja de estar entre las visibles |
| `visibles`, `minutos`, `largas` | `computed()` | Las clases que pasan el filtro, la suma de sus minutos y cuántas duran una hora o más |

El tablero (`app.ts`) ya no tiene estado propio: hace `inject(Catalogo)` y su template lee
`catalogo.visibles()`, `catalogo.minutos()`, etcétera.

**¿Qué diferencia hay entre un signal y un computed, y cuál se parece a `useState` y cuál a `useMemo`?**
Un `signal()` guarda un valor que se cambia a mano con `set()` (o `update()`): es la fuente del
estado. Se parece a `useState`: tiene el valor y la forma de cambiarlo, y cuando cambia se vuelve
a pintar lo que lo lee. Un `computed()` es de sólo lectura: se calcula a partir de otros signals y
Angular lo recalcula únicamente cuando alguno de ellos cambia; si no, reusa el resultado. Se
parece a `useMemo`, pero sin arreglo de dependencias: Angular descubre solo qué signals lee. Aquí
`clases` y `categoria` son signals, y `visibles`, `minutos` y `largas` son computed.


**¿Qué pasa si el filtro hace `new Catalogo()` en lugar de `inject(Catalogo)`?**
`inject(Catalogo)` le pide a Angular la instancia única que comparte toda la aplicación;
`new Catalogo()` crea OTRA, con sus propios signals. El filtro cambia la categoría de su copia:
sus botones se marcan, pero el tablero lee la del servicio compartido y no se entera. No filtra y
no sale ningún error. 
