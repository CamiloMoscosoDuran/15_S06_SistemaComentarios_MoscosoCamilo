import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comentario {
  postId?: number;
  id?: number;
  name: string;
  email?: string;
  body: string;
  createdDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/comments';

  constructor(private http: HttpClient) { }

  // Obtener lista de comentarios
  obtenerComentarios(limite: number = 10): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${this.apiUrl}?_limit=${limite}`);
  }

  // Crear un nuevo comentario
  crearComentario(comentario: Comentario): Observable<Comentario> {
    return this.http.post<Comentario>(this.apiUrl, comentario);
  }
}
