import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidarPermisoService {
  Permisos = JSON.parse(sessionStorage['SessionCob']).Permisos;
  constructor() { }
  ValidarPermiso(Permiso: string){
    let Resultado = this.Permisos.find(element => element == Permiso);
    if(Resultado != null || Resultado != undefined){
      return true;
    }
    else{
      return false;
    }
  }
}
