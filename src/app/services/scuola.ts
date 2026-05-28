import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classe, Studente, Insegnamento, Voto, Assenza, Docente, Materia } from '../models/scuola.models';

@Injectable({ providedIn: 'root' })
export class ScuolaService {
  private apiUrl = 'https://laughing-journey-v6q997q99r69c6xpv-5000.app.github.dev/api';

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
   getStudente(id_studente: number): Observable<Studente> {
    return this.http.get<Studente>(`${this.apiUrl}/studenti/${id_studente}`);
  }
  getVotiStudente(id_studente: number): Observable<Voto[]> {
    return this.http.get<Voto[]>(`${this.apiUrl}/voti?id_studente=${id_studente}`);
  }
  getAssenzeStudente(id_studente: number): Observable<Assenza[]> {
    return this.http.get<Assenza[]>(`${this.apiUrl}/assenze?id_studente=${id_studente}`);
  }
  aggiungiVoto(voto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/voti`, voto);
  }
   cercaStudenti(query: string): Observable<Studente[]> {
    return this.http.get<Studente[]>(`${this.apiUrl}/studenti/cerca?query=${query}`);
  }


}

