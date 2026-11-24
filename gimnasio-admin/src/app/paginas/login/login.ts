// <app-login> — ESCRITO A MANO (ver la nota de sesion/sesion.ts). La página /login: fuera del
// panel, sin barra. Sólo deja pasar a una cuenta de administrador.
import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { mensajeDeError } from '../../servicios/errores';
import { CuentaNoAdmin, Sesion } from '../../sesion/sesion';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly sesion = inject(Sesion);
  private readonly router = inject(Router);

  // ?volver=/clases/nueva → a dónde se quería entrar. Llega como input gracias a
  // withComponentInputBinding() (app.config.ts), igual que el :id de la URL.
  readonly volver = input<string>();

  protected readonly formulario = inject(FormBuilder).nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  protected readonly c = this.formulario.controls;

  protected readonly entrando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected entrar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const { correo, password } = this.formulario.getRawValue();
    this.entrando.set(true);
    this.error.set(null);
    this.sesion.entrar(correo, password).subscribe({
      next: () => this.router.navigateByUrl(this.volver() || '/clases'),
      error: (e: unknown) => {
        this.entrando.set(false);
        // 401: «Credenciales inválidas» (el mensaje de la API). Cuenta de miembro: CuentaNoAdmin.
        this.error.set(e instanceof CuentaNoAdmin ? e.message : mensajeDeError(e, 'No se pudo iniciar sesión.'));
      },
    });
  }
}
