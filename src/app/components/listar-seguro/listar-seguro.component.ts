import { SeguroService } from './../../shared/services/seguro.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Seguro } from 'src/app/shared/models/seguro';

@Component({
  selector: 'app-listar-seguro',
  templateUrl: './listar-seguro.component.html',
  styleUrls: ['./listar-seguro.component.css']
})
export class ListarSeguroComponent implements OnInit {

  public seguros$: Observable<Seguro[]>;

  constructor(
    private seguroService: SeguroService
  ) { }

  ngOnInit(): void {
    this.seguros$ = this.seguroService.listar()
  }

}
