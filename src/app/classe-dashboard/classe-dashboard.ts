import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScuolaService } from '../services/scuola';
import { Classe, Studente, Insegnamento, Docente, Materia } from '../models/scuola.models';

@Component({
  selector: 'app-classe-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './classe-dashboard.html',
  styleUrl: './classe-dashboard.css'
})
export class ClasseDashboard implements OnInit {
  idClasse!: number;
  classeDettaglio: Classe | null = null;
  studenti: Studente[] = [];
  orario: Insegnamento[] = [];
  docenti: Docente[] = [];
  materie: Materia[] = [];
  vistaAttiva: 'studenti' | 'docenti' = 'studenti';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private scuolaService: ScuolaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.idClasse = Number(this.route.snapshot.paramMap.get('id_classe'));
    
    this.scuolaService.getClasseById(this.idClasse).subscribe((data: Classe) => {
      this.classeDettaglio = data;
      this.cdr.detectChanges();
    });
    this.scuolaService.getStudentiByClasse(this.idClasse).subscribe((data: Studente[]) => {
      this.studenti = data;
      this.cdr.detectChanges();
    });
    this.scuolaService.getOrarioClasse(this.idClasse).subscribe((data: Insegnamento[]) => {
      this.orario = data;
      this.cdr.detectChanges();
    });
    this.scuolaService.getDocentiByClasse(this.idClasse).subscribe((data: Docente[]) => {
      this.docenti = data;
      this.cdr.detectChanges();
    });
    this.scuolaService.getMaterie().subscribe((data: Materia[]) => {
      this.materie = data;
      this.cdr.detectChanges();
    });
  }

  cambiaVista(vista: 'studenti' | 'docenti') {
    this.vistaAttiva = vista;
  }

  getNomeDocente(id: number): string {
    const d = this.docenti.find(doc => doc.id_docente === id);
    return d ? `${d.cognome} ${d.nome}` : `Docente #${id}`;
  }

  getNomeMateria(id: number): string {
    const m = this.materie.find(mat => mat.id_materia === id);
    return m ? m.nome : `Materia #${id}`;
  }

  guardaStudente(id_studente: number) {
    this.router.navigate(['/studenti', id_studente]);
  }

  indietro() {
    this.router.navigate(['/classi']);
  }
}
