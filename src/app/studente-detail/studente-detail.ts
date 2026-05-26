import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScuolaService } from '../services/scuola';
import { Studente, Voto, Assenza } from '../models/scuola.models';

@Component({
  selector: 'app-studente-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './studente-detail.html',
  styleUrl: './studente-detail.css'
})
export class StudenteDetail implements OnInit {
  studente: Studente | null = null;
  voti: Voto[] = [];
  assenze: Assenza[] = [];
  mediaVoti: number = 0; // <-- Questa variabile conterrà la media corretta
  idStudente!: number;

  // Campi del form per aggiungere un nuovo voto
  formValore: number = 6;
  formData: string = new Date().toISOString().substring(0, 10);
  formTipoVerifica: string = 'Scritto';
  formNota: string = '';
  formIdInsegnamento: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private scuolaService: ScuolaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.idStudente = Number(this.route.snapshot.paramMap.get('id_studente'));
    this.caricaDatiCompletiAlunno();
  }

  caricaDatiCompletiAlunno() {
    // 1. Recupera i dettagli anagrafici dello studente
    this.scuolaService.getStudente(this.idStudente).subscribe((data: Studente) => {
      this.studente = data;
      this.cdr.detectChanges();
    });

    // 2. Recupera i voti e CALCOLA LA MEDIA REALE
    this.scuolaService.getVotiStudente(this.idStudente).subscribe((data: Voto[]) => {
      this.voti = data;
     
      if (this.voti && this.voti.length > 0) {
        // Converte esplicitamente in numero ogni valore per evitare problemi di stringhe nel DB
        const somma = this.voti.reduce((acc, v) => acc + Number(v.valore), 0);
        this.mediaVoti = somma / this.voti.length;
      } else {
        this.mediaVoti = 0;
      }
      this.cdr.detectChanges();
    });

    // 3. Recupera le assenze
    this.scuolaService.getAssenzeStudente(this.idStudente).subscribe((data: Assenza[]) => {
      this.assenze = data;
      this.cdr.detectChanges();
    });
  }

  tornaAllaClasse() {
    if (this.studente) {
      this.router.navigate(['/classi', this.studente.id_classe]);
    }
  }

  salvaNuovoVoto() {
    const payload = {
      valore: this.formValore,
      data: this.formData,
      tipo_verifica: this.formTipoVerifica,
      nota: this.formNota.trim() || null,
      id_studente: this.idStudente,
      id_insegnamento: this.formIdInsegnamento
    };

    this.scuolaService.aggiungiVoto(payload).subscribe({
      next: (res) => {
        alert('Valutazione inserita con successo!');
        this.formNota = '';
        this.caricaDatiCompletiAlunno(); // Ricarica tutto ricalcolando la media all'istante
      },
      error: (err) => {
        console.error(err);
        alert("Errore durante l'inserimento del voto.");
      }
    });
  }
}
