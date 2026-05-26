import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScuolaService } from '../services/scuola';
import { Classe } from '../models/scuola.models';

@Component({
  selector: 'app-classi-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './classi-list.html',
  styleUrl: './classi-list.css'
})
export class ClassiList implements OnInit {
  classi: Classe[] = [];

  constructor(private escuelaService: ScuolaService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.escuelaService.getClassi().subscribe({
      next: (data: Classe[]) => {
        this.classi = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  apriClasse(id_classe: number) {
    this.router.navigate(['/classi', id_classe]);
  }
}
