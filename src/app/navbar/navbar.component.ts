import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ValidarNavbarService } from '../Observables/validar-navbar.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  sidebar: boolean = false;
  ShowNav:       Observable<boolean>;  
  NombreUsuario: Observable<string>;
  @Output() 
  propagar = new EventEmitter<boolean>();
  constructor(private Menu: ValidarNavbarService, private Sidebar: ValidarNavbarService, public route: Router) {
    this.ShowNav       = this.Menu.ValorNav;
    this.NombreUsuario = this.Menu.ValorNombreUsuario;
    this.propagar.emit(false);        
  }
  ngOnInit() {    
  }
  onPropagar(){        
    this.propagar.emit(true);
  }
  CerrarSesion(){
    sessionStorage.clear();
    this.route.navigate(['/Login']);
  }
}
