import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classe, Studente, Insegnamento, Voto, Assenza, Docente, Materia } from '../models/scuola.models';

@Injectable({ providedIn: 'root' })
export class ScuolaService {
  private apiUrl = 'https://improved-parakeet-x5v77qpvwpww2vgw6-3000.app.github.dev/api';

  constructor(private http: HttpClient) {}

  getClassi(): Observable<Classe[]> {
    return this.http.get<Classe[]>(`${this.apiUrl}/classi`);
  }
  getClasseById(id_classe: number): Observable<Classe> {
    return this.http.get<Classe>(`${this.apiUrl}/classi/${id_classe}`);
  }
  getStudentiByClasse(id_classe: number): Observable<Studente[]> {
    return this.http.get<Studente[]>(`${this.apiUrl}/studenti?id_classe=${id_classe}`);
  }
  getOrarioClasse(id_classe: number): Observable<Insegnamento[]> {
    return this.http.get<Insegnamento[]>(`${this.apiUrl}/insegnamenti?id_classe=${id_classe}`);
  }
  getDocentiByClasse(id_classe: number): Observable<Docente[]> {
    return this.http.get<Docente[]>(`${this.apiUrl}/classi/${id_classe}/docenti`);
  }
  getMaterie(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.apiUrl}/materie`);
  }
}
