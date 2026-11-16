## Respuestas · Práctica 21

### Ejercicio 1

**¿Qué pieza de React Router corresponde a `router-outlet`, a `routerLink` y a `routerLinkActive`?**

| Angular | React Router | Qué hace |
|---|---|---|
| `<router-outlet />` | `<Outlet />` | El hueco donde se pinta la página de la ruta actual |
| `routerLink="/clases"` | `<Link to="/clases">` | Cambia de página sin recargar |
| `routerLinkActive="barra__enlace--activo"` | `<NavLink>` (su `className` con `isActive`) | Le pone una clase al enlace de la ruta actual |

**¿Por qué la ruta comodín (`**`) va al final y la ruta vacía necesita `pathMatch: 'full'`?**
Angular revisa las rutas en orden y usa la primera que coincide. El comodín coincide con
cualquier dirección: si va antes, se queda con todas. En la prueba, con `**` al principio,
`/horarios` y el enlace de Miembros terminaban en `/clases`. Al final sólo atrapa lo que ninguna
otra ruta reconoció.

La ruta vacía `''` es el principio de cualquier dirección, así que con el `pathMatch` de siempre
(`'prefix'`) coincidiría con todas. Con `'full'` sólo coincide cuando la dirección completa está
vacía, que es lo que se quiere: mandar `/` a `/clases`. Angular exige escribirlo en una
redirección vacía: sin `pathMatch` la página queda en blanco con el error **NG04014** («please
provide 'pathMatch'»).

### Ejercicio 2

**¿Dónde vive el valor de un campo en un formulario reactivo y en qué se diferencia del `useState` de React?**
Vive en su `FormControl`, dentro del `FormGroup` que se creó en la clase del componente
(`formulario.controls.nombre.value`). El template sólo se conecta con `formControlName`. En
React, con `useState`, el valor vive en el estado del componente: cada tecla llama al `set` y
vuelve a pintar todo el componente, y la validación se escribe a mano. En el formulario reactivo
el control guarda el valor, y además si es válido, si ya se tocó y sus errores; para leerlo
completo basta con `formulario.getRawValue()`.

**¿Qué regresa un validador propio cuando el valor es válido y cuando no, y cómo se relaciona con `hasError`?**
Cuando el valor es válido regresa `null`. Cuando no, regresa un objeto con una clave por error,
por ejemplo `{ bloquesDe5: { valor: 47, sugerido: 45 } }`. Angular guarda ese objeto en
`control.errors`, y `hasError('bloquesDe5')` pregunta si esa clave está ahí. Lo de adentro sirve
para el mensaje: `getError('bloquesDe5').sugerido` da el 45 de «por ejemplo, 45».

### Ejercicio 3

**¿Qué cambió en el servicio del catálogo y por qué ningún componente se enteró?**
Cambió de dónde salen las clases: antes eran un `signal()` con el arreglo local, y ahora salen
de un `httpResource` que hace `GET /clases`. Ningún componente se enteró porque el servicio
siguió ofreciendo lo mismo: `clases`, `visibles`, `minutos`, `largas` y `seleccionada` tienen el
mismo nombre y siguen siendo signals que se leen igual (`catalogo.visibles()`). Los componentes
dependen de esa cara pública del servicio, no de cómo consigue los datos. Lo único nuevo para la
página fueron `cargando` y `error`, que antes no existían.

**¿Por qué no hizo falta iniciar sesión para leer el catálogo?**
Porque en la API `GET /clases` es pública: el controlador lleva `@Publico()`, así que el guard
de JWT la deja pasar sin token. Las peticiones salen sin encabezado `Authorization`. Crear,
editar y borrar clases sí piden sesión, y además rol admin; eso llega en la Práctica 22.

