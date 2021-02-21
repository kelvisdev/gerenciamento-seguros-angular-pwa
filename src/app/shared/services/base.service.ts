import { Injectable, Injector } from '@angular/core';
import Dexie from 'dexie';
import { HttpClient } from '@angular/common/http';
import { OnlineOfflineService } from './online-offline.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export abstract class BaseService<T extends { id: string }> {

  private db: Dexie;
  private table: Dexie.Table<T, any> = null;

  protected http: HttpClient;
  protected onlineOfflineService: OnlineOfflineService;

  constructor(
    protected injector: Injector,
    protected nomeTabela: string,
    protected urlApi: string
  ) {
    this.http = this.injector.get(HttpClient);
    this.onlineOfflineService = this.injector.get(OnlineOfflineService);

    this.ouvirStatusConexao();
    this.iniciarIndexedDb();
  }

  private iniciarIndexedDb() {
    this.db = new Dexie('db-seguros');
    this.db.version(1).stores({
      [this.nomeTabela]: 'id'
    });
    this.table = this.db.table(this.nomeTabela);
  }

  private salvarAPI(tabela: T) {
    this.http.post(this.urlApi, tabela)
      .subscribe(
        () => alert('Registro foi cadastrado com sucesso!'),
        (err) => console.log('Erro ao cadastrar tabela')
      );
  }

  private async salvarIndexedDb(tabela: T) {
    try {
      await this.table.add(tabela);

      const todosSeguros: T[] = await this.table.toArray();
      console.log('Registro foi salvo no IndexedDb', todosSeguros);
    } catch (error) {
      console.log('Erro ao incluir tabela no IndexedDb', error);
    }
  }

  private async enviarIndexedDbParaAPI() {
    const todosSeguros: T[] = await this.table.toArray();

    for (const tabela of todosSeguros) {
      this.salvarAPI(tabela);

      await this.table.delete(tabela.id);
      console.log(`Registro com o id ${tabela.id} foi excluído com sucesso`);
    }
  }

  public salvar(tabela: T) {
    if (this.onlineOfflineService.isOnline) {
      this.salvarAPI(tabela);
    } else {
      this.salvarIndexedDb(tabela);
    }
  }

  listar(): Observable<T[]> {
    return this.http.get<T[]>(this.urlApi);
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
}
