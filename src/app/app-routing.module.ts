import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guardians/auth.guard';
import { LoginGuard } from './guardians/login.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EncuestasComponent } from './encuestas/encuestas.component';
import { CatalogoRiesgoComponent } from './catalogo-riesgo/catalogo-riesgo.component';

const routes: Routes = [
  {
    path: 'CatalogoRiesgo',
    component: CatalogoRiesgoComponent,
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
