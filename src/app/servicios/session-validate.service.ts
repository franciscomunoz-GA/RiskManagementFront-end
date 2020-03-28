import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SessionValidate{

  constructor(public route: Router){}
  public validatePermission(menu, submenu){

    let menus = JSON.parse(sessionStorage['Menus']);
    let resultado: boolean = false;
    menus.forEach(element => {
      if(element.Nombre == menu){
        element.Submenus.forEach(elemento => {
          elemento.Nombre == submenu ? resultado = true : resultado = false;
        });
      }      
    });    
    
    return resultado;
  }
  /* Validar Sesion */
  public validateSession(){
    if(sessionStorage['SessionCob'] == '' || sessionStorage['SessionCob'] == null || sessionStorage['SessionCob'] == undefined){
      //Redireccionar a Login      
      return false;
    }
    else{      
      return true;
    }
  }

  public validateLogin(){
    if(sessionStorage['SessionCob'] == '' || sessionStorage['SessionCob'] == null)
    {
      //Permanece en Login
    }else{
      //Redireccionar a Home
      this.route.navigate(['/Principal']);
      return true;
    }
  }

  private user = new BehaviorSubject<String>('Usuario');

  get showUser(){
    return this.user.asObservable();
  }
  makeUser(){
    if(sessionStorage.getItem('SessionCob'))
    {
      let dataSession = JSON.parse(sessionStorage['SessionCob'])
      this.user.next(dataSession.NombreUsuario);
    }
  }

}