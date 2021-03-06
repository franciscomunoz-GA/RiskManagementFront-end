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
import { CatalogoAreaComponent } from './catalogo-area/catalogo-area.component';
import { RiesgosPuntosdeinteresComponent } from './riesgos-puntosdeinteres/riesgos-puntosdeinteres.component';
import { CatalogoAreaGuard } from './guardians/catalogo-area.guard';
import { CatalogoCriterioGuard } from './guardians/catalogo-criterio.guard';
import { CatalogoDimensionGuard } from './guardians/catalogo-dimension.guard';
import { CatalogoRiesgoGuard } from './guardians/catalogo-riesgo.guard';
import { CatalogoTipoRiesgoGuard } from './guardians/catalogo-tipo-riesgo.guard';
import { EncuestaRiesgosPuntosdeinteresGuard } from './guardians/encuesta-riesgos-puntosdeinteres.guard';
import { RiesgosAreasComponent } from './riesgos-areas/riesgos-areas.component';
import { EncuestaRiesgosAreasGuard } from './guardians/encuesta-riesgos-areas.guard';
import { ClientesRiesgosAreasComponent } from './clientes-riesgos-areas/clientes-riesgos-areas.component';
import { EncuestaClientesRiesgosAreasGuard } from './guardians/encuesta-clientes-riesgos-areas.guard';
import { EncuestasGuard } from './guardians/encuestas.guard';

const routes: Routes = [
  {
    path: 'CatalogoArea',
    component: CatalogoAreaComponent,
    canActivate: [CatalogoAreaGuard]
  },
  {
    path: 'CatalogoCriterio',
    component: CatalogoCriterioComponent,
    canActivate: [CatalogoCriterioGuard]
  },
  {
    path: 'CatalogoDimension',
    component: CatalogoDimensionComponent,
    canActivate: [CatalogoDimensionGuard]
  },
  {
    path: 'CatalogoRiesgo',
    component: CatalogoRiesgoComponent,
    canActivate: [CatalogoRiesgoGuard]
  },
  {
    path: 'CatalogoTipoRiesgo',
    component: CatalogoTipoRiesgoComponent,
    canActivate: [CatalogoTipoRiesgoGuard]
  },
  {
    path: 'Dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'Encuestas',
    component: EncuestasComponent,
    canActivate: [EncuestasGuard]
  },
  {
    path: 'RiesgosPuntosInteres',
    component: RiesgosPuntosdeinteresComponent,
    canActivate: [EncuestaRiesgosPuntosdeinteresGuard]
  },
  {
    path: 'RiesgosAreas',
    component: RiesgosAreasComponent,
    canActivate: [EncuestaRiesgosAreasGuard]
  },
  {
    path: 'ClientesRiesgosAreas',
    component: ClientesRiesgosAreasComponent,
    canActivate: [EncuestaClientesRiesgosAreasGuard]
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
