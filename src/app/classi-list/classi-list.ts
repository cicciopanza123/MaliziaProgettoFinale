import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ScuolaService } from '../services/scuola';
import { Classe, Studente } from '../models/scuola.models';

@Component({
  selector: 'app-classi-list',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './classi-list.html',
  styleUrl: './classi-list.css'
})
export class ClassiList implements OnInit {
  classi: Classe[] = [];
  testoRicerca: string = ''; 
  risultatiRicerca: Studente[] = []; 

  constructor(private scuolaService: ScuolaService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.scuolaService.getClassi().subscribe({
      next: (data: Classe[]) => { this.classi = data; this.cdr.detectChanges(); },
      error: (err) => console.error(err)
    });
  }

  apriClasse(id_classe: number) { this.router.navigate(['/classi', id_classe]); }

  avviaRicerca() {
    if (this.testoRicerca.trim().length < 2) {
      this.risultatiRicerca = [];
      return;
    }
    this.scuolaService.cercaStudenti(this.testoRicerca).subscribe({
      next: (risultati) => {
        this.risultatiRicerca = risultati;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  apriProfiloStudente(id_studente: number) {
    this.router.navigate(['/studenti', id_studente]);
  }
}
