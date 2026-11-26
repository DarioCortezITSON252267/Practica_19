## Respuestas · Práctica 23

### Ejercicio 1


**¿Qué diferencia hay entre un signal y un Observable?**
Un **signal** es una caja con un valor que **siempre existe**: se lee al momento con `clases()`,
Angular sabe quién lo leyó y repinta eso cuando cambia, y no hay que suscribirse ni
desuscribirse. Sirve para el **estado** (lo que hay ahora). Un **Observable** es un **flujo de
valores en el tiempo** (teclas, respuestas de la API): puede no tener valor todavía, no hace nada
hasta que alguien se suscribe, hay que terminar la suscripción, y trae operadores para manejar
el tiempo (esperar, cancelar, atrapar errores). Por eso la búsqueda se arma con un Observable y
al final se convierte en signal con `toSignal()`, para que el template lo lea como siempre.

### Ejercicio 2

**¿Qué problema evita `switchMap` y qué pasaría con `mergeMap`?**
Evita que una respuesta vieja pise a la nueva. Cuando llega un texto nuevo, `switchMap` cancela
la petición anterior y sólo importa la última. Con `mergeMap` todas siguen vivas: en la prueba,
las 4 peticiones respondieron 200 y ninguna se canceló. Aquí llegaron en orden porque el retardo
es fijo, pero en una red real una respuesta vieja que tarde más puede llegar al final: la caja
diría «fuer» y se verían los resultados de «f». Además se gastan peticiones que ya no sirven.

**¿Qué pasa si se quita `catchError` y la API se apaga?**
El error de la petición sale del `switchMap` y mata todo el tubo: un Observable que da error se
termina y ya no emite nada. En la prueba, la consola mostró `ERROR` con el `HttpErrorResponse`
(status 0) y no salió ningún aviso. La página se quedó en «Buscando…» y, al volver a `/clases`,
salió vacía, sin números ni tarjetas: `toSignal` guarda el error y lo lanza cada vez que se lee
el signal. Al prender la API otra vez, buscar ya no mandaba ninguna petición; sólo se arregló
recargando la página. Con `catchError` adentro del `switchMap`, el error se vuelve un estado más:
sale «No se pudo conectar con la API. ¿Está encendida?» con «Reintentar», y la siguiente búsqueda
funciona.
