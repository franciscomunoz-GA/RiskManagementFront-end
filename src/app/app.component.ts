import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ValidarNavbarService } from './Observables/validar-navbar.service';
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

  ShowSidebar: boolean = false;
  
  
  constructor(private Menu: ValidarNavbarService, private Sidebar: ValidarNavbarService, public route: Router){
    this.NombreUsuario = this.Menu.ValorNombreUsuario;
    this.Menus         = this.Menu.ValorMenus;
  }  
  ngOnInit() {
    this.ShowNav = this.Menu.ValorNav;
    this.ShowProgressbar = this.Menu.ValorProgessbar;
    this.Menu.MostrarNav();
     
  }
  procesaPropagar(mensaje){
    this.ShowSidebar = mensaje    
  }
  CerrarSideMenu(){
    this.ShowSidebar = false;
  }
}
