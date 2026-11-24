## Respuestas · Práctica 22

### Ejercicio 1

- **El servicio `ClasesApi`** (`src/app/servicios/clases-api.ts`, generado con
  `npx ng generate service servicios/clases-api`) tiene `crear(clase)`, que manda
  `POST /clases` con `HttpClient` y saca la clase creada del sobre `{ data, meta }`.
- **`guardar()`** del formulario manda el POST. Mientras sale, el botón se deshabilita y dice
  «Guardando…». Si sale bien, recarga el catálogo (`catalogo.restaurar()`, que vuelve a pedir
  `GET /clases`) y regresa a `/clases`. Si la API responde 400, muestra sus mensajes, uno por
  regla.
- **Sin sesión**, el `POST /clases` responde **401**: crear clases es sólo para el rol admin.
- **Sin los `Validators` de nombre y duración**, el formulario deja pasar `nombre: ""` y
  `duracionMin: 5`, y es el servidor el que responde 400 con
  `["El nombre es obligatorio", "La duración mínima es de 10 minutos"]`.
- **Ojo:** en Angular el atributo `min="10"` de un `<input type="number">` también valida en un
  formulario reactivo. Por eso se quitó del template: la regla vive sólo en
  `Validators.min(10)`.

**Si el formulario ya valida, ¿por qué también valida el servidor?**
Porque el formulario es sólo una ayuda en el navegador y cualquiera se lo puede saltar: basta
con quitar los `Validators` (como en la prueba), o mandar la petición con curl, Postman u otra
aplicación. El servidor es la única barrera que de verdad protege la base de datos. El
formulario valida para avisar rápido y sin viajar a la API; el servidor, para que nada inválido
se guarde.

**¿Por qué `httpResource` para leer y `HttpClient` para crear, editar y eliminar?**
`httpResource` es para datos que se leen: la petición sale sola, se repite cuando cambian los
signals de los que depende, y deja la respuesta, el «cargando» y el error en signals. Crear,
editar y eliminar son acciones que la persona dispara en un momento (un clic en «Guardar»):
cambian datos, no deben repetirse solas, y después hay que hacer algo con la respuesta, como
navegar o mostrar los errores. Para eso se llama a `post`, `patch` o `delete` de `HttpClient`
justo cuando hace falta, con su `subscribe()`.

**¿Qué pasa si se olvida el `subscribe()`?**
No pasa nada, y ése es el problema: los Observables de `HttpClient` son «fríos», así que la
petición no sale hasta que alguien se suscribe. No hay error ni aviso. En la prueba la API no
recibió ningún POST y el botón se quedó para siempre en «Guardando…».

### Ejercicio 2

- `app.config.ts` registra los interceptores con
  `provideHttpClient(withInterceptors([tokenInterceptor, sesionVencidaInterceptor]))`.
- En `app.routes.ts`, `/login` va fuera del panel. El panel es la ruta padre (`path: ''`) con
  `canActivate: [soloAdminGuard]`, y sus hijas (`clases`, `clases/nueva`, `horarios`,
  `miembros`…) se pintan en el `<router-outlet>` del panel.
- El formulario se carga con `loadComponent`: `ng build` lo deja en su propio archivo
  (`formulario-clase`, ~9 kB), que sólo se baja al abrir «Nueva clase» o «Editar».
- `App` ya sólo tiene `<router-outlet />`; la barra (con Clases, Horarios y Miembros) está en el
  panel.
- **Lo que se probó:** sin sesión, cualquier página manda a `/login`. Con `karla@itson.mx` (rol
  miembro) el login la rechaza: «Esta cuenta no es de administrador…». Con `admin@itson.mx` entra,
  y el `POST /clases` lleva `Authorization: Bearer …` y responde 201. «Salir» regresa al login.

**¿Qué equivale en React a `children`, al interceptor y a la guardia?**

| Angular | React (gimnasio-web) |
|---|---|
| `children` en la ruta del panel + su `<router-outlet>` | Rutas anidadas dentro de `<Route element={<Layout />}>` + `<Outlet />` |
| Interceptor (`HttpInterceptorFn`) | `api.interceptors.request.use(...)` de Axios (`servicios/api.ts`) |
| Guardia `canActivate` | El componente `RutaProtegida`: pinta `<Outlet />` o regresa `<Navigate to="/entrar" />` |

**¿Cuándo corre la guardia y por qué `salir()` tiene que navegar al login?**
La guardia corre sólo cuando el router navega: al abrir la página, al dar clic en un enlace o al
cambiar la URL. Si nadie navega, no vuelve a correr. `salir()` borra el token, pero la página
del panel ya estaba abierta: sin navegar se quedaría a la vista, y la guardia no se enteraría
hasta el siguiente clic. Por eso `salir()` hace `navigateByUrl('/login')`.

### Ejercicio 3

- La ruta `clases/:id/editar` usa el mismo `loadComponent` que `clases/nueva`. Con
  `withComponentInputBinding()`, el `:id` de la URL llega al formulario como `id = input<string>()`.
- `ClasesApi` suma `obtener(id)` (GET), `actualizar(id, cambios)` (PATCH) y `eliminar(id)`
  (DELETE).
- En el panel lateral del catálogo está el botón «Editar». Al editar, el formulario pide la clase
  y la carga con `patchValue()`.
- «Eliminar clase» sólo sale al editar y pide confirmación; con «Cancelar» no se manda nada.
- La guardia `cambiosSinGuardarGuard` (canDeactivate) pregunta «Hay cambios sin guardar. ¿Salir
  de todos modos?» si el formulario está `dirty`. Sin cambios, o después de guardar, no pregunta.
- **Opcional:** `/clases/:id` muestra la clase con sus horarios (botón «Ver horarios»).

**¿Cómo decide un solo formulario entre POST y PATCH?**
Por el `id` de la URL. En `/clases/nueva` no hay `:id` y el input vale `undefined`; en
`/clases/5/editar` vale `'5'`. `esEdicion = computed(() => id() !== undefined)`, y `guardar()`
hace `esEdicion() ? api.actualizar(id, datos) : api.crear(datos)`. Lo demás (validar, botón,
errores, volver al catálogo) es igual en los dos casos.

**¿Por qué el estado del formulario no se puede observar con `computed()`?**
Porque los formularios reactivos no son signals. `computed()` sólo se recalcula cuando cambia un
signal que leyó, y `formulario.value`, `dirty` o `valid` son propiedades normales: Angular no
anota que dependen de nada. En la prueba, `computed(() => formulario.dirty)` se quedó en `false`
aunque ya se había escrito «Yoga», mientras que `formulario.dirty` directo ya decía `true`. Los
cambios del formulario se avisan con Observables (`valueChanges`, `statusChanges`); para usarlos
en un `computed()` hay que convertirlos con `toSignal()`.

**¿Qué diferencia hay entre `canActivate` y `canDeactivate`, y qué casos no cubre la de salida?**
`canActivate` corre al **entrar** a una ruta: decide si se puede abrir (la del panel revisa que
haya sesión de admin). `canDeactivate` corre al **salir**: decide si se puede dejar la página
(la del formulario pregunta si hay cambios sin guardar). La de salida sólo cubre las navegaciones
del router (enlaces, «Volver al catálogo», el botón de atrás). No cubre recargar con F5, cerrar
la pestaña o el navegador, ni escribir otra dirección en la barra: ahí no navega Angular, se va
la página entera. Para eso haría falta el evento `beforeunload` del navegador.

**(Opcional) ¿Por qué `clases/nueva` va antes que `clases/:id`?**
Porque Angular usa la primera ruta que coincide, y `:id` acepta cualquier texto. Si `clases/:id`
fuera primero, `/clases/nueva` abriría el detalle con `id = 'nueva'` y pediría
`GET /clases/nueva`, que la API rechaza.
