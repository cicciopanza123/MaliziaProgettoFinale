import { Routes } from '@angular/router';
import { ClassiList } from './classi-list/classi-list';
import { ClasseDashboard } from './classe-dashboard/classe-dashboard';
import { StudenteDetail } from './studente-detail/studente-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'classi', pathMatch: 'full' },
  { path: 'classi', component: ClassiList },
  { path: 'classi/:id_classe', component: ClasseDashboard },
  { path: 'studenti/:id_studente', component: StudenteDetail }
];
