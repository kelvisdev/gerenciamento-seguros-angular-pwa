import { Seguro } from 'src/app/shared/models/seguro';
import { Injectable, Injector } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class SeguroService extends BaseService<Seguro> {

  constructor(
    protected injector: Injector
  ) {
    super(injector, 'seguros', 'http://127.0.0.1:9000/api/seguros');
  }
}
