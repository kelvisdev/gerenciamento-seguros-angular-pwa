import { PushNotificationService } from './../../shared/services/push-notification.service';
import { SeguroService } from './../../shared/services/seguro.service';
import { Seguro } from './../../shared/models/seguro';
import { MarcaCarroService } from './../../shared/services/marca-carro.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MarcaCarro } from 'src/app/shared/models/marca-carro';

@Component({
  selector: 'app-cadastrar-seguro',
  templateUrl: './cadastrar-seguro.component.html',
  styleUrls: ['./cadastrar-seguro.component.css']
})
export class CadastrarSeguroComponent implements OnInit {

  public seguro = new Seguro();
  public marcasCarro$: Observable<MarcaCarro[]>;

  constructor(
    private marcaCarroService: MarcaCarroService,
    public seguroService: SeguroService,
    private pushNotificationService: PushNotificationService
  ) { }

  ngOnInit(): void {
    this.marcasCarro$ = this.marcaCarroService.getMarcas();
  }

  cadastrar() {
    this.seguro.id = this.seguro.placaCarro;
    this.seguroService.salvar(this.seguro);
  }

  enviarNotificacao() {
    this.pushNotificationService.enviar();
  }

}
