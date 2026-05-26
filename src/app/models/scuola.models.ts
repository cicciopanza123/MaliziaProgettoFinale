export interface Classe {
  id_classe: number;
  nome: string;
  sezione: string;
  indirizzo: string;
  id_anno: number;
}
export interface Studente {
  id_studente: number;
  cognome: string;
  nome: string;
  codice_fiscale: string;
  data_nascita: string | Date;
  id_classe: number;
}
export interface Insegnamento {
  id_insegnamento: number;
  id_docente: number;
  id_materia: number;
  id_classe: number;
  giorno: string;
  ora_inizio: string;
  ora_fine: string;
}
export interface Voto {
  id_voto: number;
  valore: number;
  data: string | Date;
  tipo_verifica: string;
  nota?: string;
  id_studente: number;
  id_insegnamento: number;
}
export interface Assenza {
  id_assenza: number;
  data: string | Date;
  tipo: string;
  giustificata: number;
  nota?: string;
  id_studente: number;
}
export interface Docente {
  id_docente: number;
  nome: string;
  cognome: string;
  email: string;
  specializzazione: string;
}
export interface Materia {
  id_materia: number;
  nome: string;
  descrizione: string;
  ore_settimanali: number;
}
