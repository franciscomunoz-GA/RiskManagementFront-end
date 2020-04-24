import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guardians/auth.guard';
import { LoginGuard } from './guardians/login.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EncuestasComponent } from './encuestas/encuestas.component';
import { CatalogoRiesgoComponent } from './catalogo-riesgo/catalogo-riesgo.component';
import { CatalogoDimensionComponent } from './catalogo-dimension/catalogo-dimension.component';
import { CatalogoTipoRiesgoComponent } from './catalogo-tipo-riesgo/catalogo-tipo-riesgo.component';
import { CatalogoCriterioComponent } from './catalogo-criterio/catalogo-criterio.component';

const routes: Routes = [
  {
    path: 'CatalogoRiesgo',
    component: CatalogoRiesgoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'CatalogoDimension',
    component: CatalogoDimensionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'CatalogoTipoRiesgo',
    component: CatalogoTipoRiesgoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'CatalogoCriterio',
    component: CatalogoCriterioComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'Dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'Encuestas',
    component: EncuestasComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'Login', 
    component: LoginComponent,
    canActivate: [LoginGuard] 
  },
  {
    path: 'nav',
    component: NavbarComponent
  },

  { 
    path: '', 
    redirectTo: '/Dashboard',
    pathMatch: 'full',
  },
  {
    path: '**', 
    component: DashboardComponent,
    canActivate: [AuthGuard] 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
