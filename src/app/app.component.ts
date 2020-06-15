import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ValidarNavbarService } from './Observables/validar-navbar.service';
import { PermisosSeccionesService } from './Observables/permisos-secciones.service';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Input() eventToggle: MatSidenav;
  ShowProgressbar: Observable<boolean>;
  ShowNav:         Observable<boolean>;
  NombreUsuario:   Observable<string>;
  Menus:           Observable<any>;
  color:           Observable<string>;
  ShowSidebar: boolean = false;  
  panelOpenState = false;
  // perdóname si ves las siguientes lineas de código, tuve que adaptarme a la base de datos que ya existia -.-
  ShowCatalogoArea:                 Observable<boolean>;
  ShowCatalogoCriterioLegal:        Observable<boolean>;
  ShowCatalogoDimension:            Observable<boolean>;
  ShowCatalogoRiesgos:              Observable<boolean>;
  ShowCatalogoTipoRiesgo:           Observable<boolean>;

  ShowEncuestaRiesgosPuntosInteres: Observable<boolean>;
  ShowEncuestaRiesgosAreas:         Observable<boolean>;
  ShowEncuestaClientesRiesgosAreas: Observable<boolean>;
  
  constructor(private Menu:     ValidarNavbarService, 
              private Sidebar:  ValidarNavbarService,
              private Permisos: PermisosSeccionesService,
              public route: Router){
    this.NombreUsuario = this.Menu.ValorNombreUsuario;
    this.Menus         = this.Menu.ValorMenus;
    
  }  
  ngOnInit() {
    this.ShowNav = this.Menu.ValorNav;
    this.ShowProgressbar = this.Menu.ValorProgessbar;
    this.Menu.MostrarNav();
    this.color = this.Menu.ValorBackground;
    // Mostrar u ocultar las secciones del sidenav
    this.ShowCatalogoArea                 = this.Permisos.ValorCatalogoArea;
    this.ShowCatalogoCriterioLegal        = this.Permisos.ValorCatalogoCriterioLegal;
    this.ShowCatalogoDimension            = this.Permisos.ValorCatalogoDimension;
    this.ShowCatalogoRiesgos              = this.Permisos.ValorCatalogoRiesgos;
    this.ShowCatalogoTipoRiesgo           = this.Permisos.ValorCatalogoTipoRiesgo;

    this.ShowEncuestaRiesgosPuntosInteres = this.Permisos.ValorEncuestaRiesgosPuntosInteres;
    this.ShowEncuestaRiesgosAreas         = this.Permisos.ValorEncuestaRiesgosAreas;
    this.ShowEncuestaClientesRiesgosAreas = this.Permisos.ValorEncuestaClientesRiesgosAreas;
  }
  procesaPropagar(mensaje){
    this.ShowSidebar = mensaje;
  }
  CerrarSideMenu(){
    this.ShowSidebar = false;
  }
}
