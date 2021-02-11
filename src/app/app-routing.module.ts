import { ListarSeguroComponent } from './components/listar-seguro/listar-seguro.component';
import { CadastrarSeguroComponent } from './components/cadastrar-seguro/cadastrar-seguro.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cadastrar' },
  { path: 'cadastrar', component: CadastrarSeguroComponent },
  { path: 'listar', component: ListarSeguroComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
