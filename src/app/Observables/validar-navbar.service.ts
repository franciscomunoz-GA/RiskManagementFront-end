import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class ValidarNavbarService {  
  private Nav      = new BehaviorSubject<boolean>(true);
  private Progress = new BehaviorSubject<boolean>(true);
  private Sidebar  = new BehaviorSubject<boolean>(true);
  
  private NombreUsuario = new BehaviorSubject<string>('');
  private Menus         = new BehaviorSubject<any>([]);
  
  constructor() { }
  
  get ValorNav(){
    return this.Nav.asObservable();
  }
  get ValorProgessbar(){
    return this.Progress.asObservable();
  }
  get ValorSidebar(){
    return this.Sidebar.asObservable();
  }
  get ValorMenus(){
    return this.Menus.asObservable();
  }
  get ValorNombreUsuario(){
    return this.NombreUsuario.asObservable();
  }
  ActualizarNombreUsuario(){
    let Usuario = JSON.parse(sessionStorage['SessionCob']).NombreUsuario;
    this.NombreUsuario.next(Usuario);
  }
  ActualizarMenu(){
    let Menus = JSON.parse(sessionStorage['Menus']);
    console.log(Menus);
    
    this.Menus.next(Menus);
  }
  MostrarNav(){
    this.Nav.next(true);
  }
  OcultarNav(){
    this.Nav.next(false);
  }
  MostrarProgress(){
    this.Progress.next(true);
  }
  OcultarProgress(){
    this.Progress.next(false);
  }
  MostrarSidebar(){
    this.Sidebar.next(true);            
  }
  OcultarSidebar(){
    this.Sidebar.next(false);      
  } 
}
