import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Seguro } from '../models/seguro';

@Injectable({
  providedIn: 'root'
})
export class SeguroService {
  private apiSeguros = 'http://localhost:9000';

  constructor(
    private http: HttpClient
  ) { }

  cadastrar(seguro: Seguro) {
    this.http.post(this.apiSeguros + '/api/seguros', seguro)
      .subscribe(
        () => alert('Seguro foi cadastrado com sucesso!'),
        (err) => console.log('Erro ao cadastrar seguro')
      );
  }
}
