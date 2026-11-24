// ---------------------------------------------------------------------------
// sesion/sesion.ts — ESCRITO A MANO: el código base de la carpeta practica-21 (la sesión, los
// interceptores, el guardia, el login y el panel) no estaba disponible. Hace lo mismo que la
// sesión de React (Prácticas 16 y 17); si consigues la del código base, reemplázala.
// ---------------------------------------------------------------------------
// La sesión del panel: quién entró y su token. Vive en signals y en localStorage, para que
// sobreviva a recargar la página.
import { HttpClient } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap, type Observable } from 'rxjs';
import { URL_API } from '../config';
import type { Sobre, Usuario } from '../modelos/clase';

const CLAVE = 'gimnasio-admin.sesion';

interface DatosSesion {
  token: string;
  usuario: Usuario;
}

// Lo que regresa POST /auth/login (dentro del sobre { data, meta }).
interface RespuestaLogin {
  access_token: string;
  usuario: Usuario;
}

/** El login sí funcionó, pero la cuenta no es de un administrador: el panel no es para ella. */
export class CuentaNoAdmin extends Error {
  constructor() {
    super('Esta cuenta no es de administrador: el panel sólo es para el personal con rol admin.');
  }
}

@Service()
export class Sesion {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly datos = signal<DatosSesion | null>(leerGuardada());
  readonly token = computed(() => this.datos()?.token ?? null);
  readonly usuario = computed(() => this.datos()?.usuario ?? null);
  readonly esAdmin = computed(() => this.usuario()?.rol === 'admin');

  /** POST /auth/login. Sólo guarda la sesión si la cuenta es de admin; si no, lanza CuentaNoAdmin. */
  entrar(correo: string, password: string): Observable<Usuario> {
    return this.http.post<Sobre<RespuestaLogin>>(`${URL_API}/auth/login`, { correo, password }).pipe(
      map((respuesta) => respuesta.data),
      tap(({ usuario }) => {
        if (usuario.rol !== 'admin') throw new CuentaNoAdmin();
      }),
      tap(({ access_token, usuario }) => this.guardar({ token: access_token, usuario })),
      map(({ usuario }) => usuario),
    );
  }

  /** Borra la sesión y manda al login. */
  salir() {
    this.guardar(null);
    // El guardia sólo corre al NAVEGAR. Si sólo se borrara la sesión, la página del panel se
    // quedaría en pantalla: hay que navegar para que el router saque a la persona del panel.
    this.router.navigateByUrl('/login');
  }

  private guardar(datos: DatosSesion | null) {
    try {
      if (datos) localStorage.setItem(CLAVE, JSON.stringify(datos));
      else localStorage.removeItem(CLAVE);
    } catch {
      // Sin localStorage (modo privado estricto) la sesión sólo dura mientras la pestaña viva.
    }
    this.datos.set(datos);
  }
}

function leerGuardada(): DatosSesion | null {
  try {
    const texto = localStorage.getItem(CLAVE);
    return texto ? (JSON.parse(texto) as DatosSesion) : null;
  } catch {
    return null;
  }
}
