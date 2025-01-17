import { MarcaCarro } from './../models/marca-carro';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface CarResponse {
  Makes: Array<any>;
}

@Injectable({
  providedIn: 'root'
})
export class MarcaCarroService {

  private apiCarros = 'https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getMakes';

  constructor(private http: HttpClient) { }

  private mapMarcas(marcas: Array<any>): MarcaCarro[] {
    return marcas.map(marca => ({
      codigo: marca.make_id,
      nome: marca.make_display
    }))
  }

  public getMarcas(): Observable<MarcaCarro[]> {
    return this.http.jsonp(this.apiCarros, 'callback')
      .pipe(
        map((res: CarResponse) => this.mapMarcas(res.Makes))
      );
  }
}
