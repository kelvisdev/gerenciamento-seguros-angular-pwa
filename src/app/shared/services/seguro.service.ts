import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Seguro } from '../models/seguro';
import { OnlineOfflineService } from './online-offline.service';
import Dexie from 'dexie';

@Injectable({
  providedIn: 'root'
})
export class SeguroService {
  private apiSeguros = 'http://localhost:9000';
  private db: Dexie;
  private table: Dexie.Table<Seguro, any> = null;

  constructor(
    private http: HttpClient,
    private onlineOfflineService: OnlineOfflineService
  ) {
    this.ouvirStatusConexao();
    this.iniciarIndexedDb();
  }

  iniciarIndexedDb() {
    this.db = new Dexie('db-seguros');
    this.db.version(1).stores({
      seguro: 'id'
    });
    this.table = this.db.table('seguro');
  }

  private ouvirStatusConexao() {
    this.onlineOfflineService.statusConexao
      .subscribe(online => {
        if (online) {
          this.enviarIndexedDbParaAPI();
        } else {
          console.log('estou offline');
        }
      });
  }

  private salvarAPI(seguro: Seguro) {
    this.http.post(this.apiSeguros + '/api/seguros', seguro)
      .subscribe(
        () => alert('Seguro foi cadastrado com sucesso!'),
        (err) => console.log('Erro ao cadastrar seguro')
      );
  }

  private async salvarIndexedDb(seguro: Seguro) {
    try {
      await this.table.add(seguro);

      const todosSeguros: Seguro[] = await this.table.toArray();
      console.log('Seguro foi salvo no IndexedDb', todosSeguros);
    } catch (error) {
      console.log('Erro ao incluir seguro no IndexedDb', error);
    }
  }

  private async enviarIndexedDbParaAPI() {
    const todosSeguros: Seguro[] = await this.table.toArray();

    for (const seguro of todosSeguros) {
      this.salvarAPI(seguro);

      await this.table.delete(seguro.id);
      console.log(`Seguro com o id ${seguro.id} foi excluído com sucesso`);
    }
  }

  public salvar(seguro: Seguro) {
    if (this.onlineOfflineService.isOnline) {
      this.salvarAPI(seguro);
    } else {
      this.salvarIndexedDb(seguro);
    }
  }

  listar(): Observable<Seguro[]> {
    return this.http.get<Seguro[]>(this.apiSeguros + '/api/seguros');
  }


}
