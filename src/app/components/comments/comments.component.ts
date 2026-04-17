import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, Comentario } from '../../services/api.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
  standalone: false
})
export class CommentsComponent implements OnInit {
  comentarios = signal<Comentario[]>([]);
  formulario!: FormGroup;
  cargando = signal(false);
  mensajeExito = signal('');
  cantidadComentarios = signal(0);

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      body: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.cargarComentarios();
  }

  cargarComentarios(): void {
    this.cargando.set(true);
    this.apiService.obtenerComentarios(10).subscribe({
      next: (datos) => {
        this.comentarios.set(datos);
        this.actualizarContador();
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar comentarios:', error);
        this.cargando.set(false);
      }
    });
  }

  crearComentario(): void {
    if (this.formulario.invalid) {
      return;
    }

    // El nuevo ID es la cantidad actual de comentarios + 1
    const nuevoId = this.comentarios().length + 1;

    const nuevoComentario: Comentario = {
      name: this.formulario.value.name,
      body: this.formulario.value.body,
      postId: 1,
      id: nuevoId,
      createdDate: new Date().toLocaleString('es-ES')
    };

    this.cargando.set(true);
    this.apiService.crearComentario(nuevoComentario).subscribe({
      next: (comentarioCreado) => {
        // Agregar el comentario al inicio de la lista
        const comentarioConFecha: Comentario = {
          ...comentarioCreado,
          createdDate: new Date().toLocaleString('es-ES')
        };
        
        const listaActual = this.comentarios();
        this.comentarios.set([comentarioConFecha, ...listaActual]);
        this.actualizarContador();
        
        // Limpiar formulario
        this.formulario.reset();
        
        // Mostrar mensaje de confirmación
        this.mensajeExito.set('¡Comentario creado exitosamente!');
        setTimeout(() => this.mensajeExito.set(''), 3000);
        
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al crear comentario:', error);
        this.cargando.set(false);
      }
    });
  }

  private actualizarContador(): void {
    this.cantidadComentarios.set(this.comentarios().length);
  }

  get nombre() {
    return this.formulario.get('name');
  }

  get comentario() {
    return this.formulario.get('body');
  }
}
