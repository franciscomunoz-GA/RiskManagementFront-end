import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionValidate } from '../servicios/session-validate.service';
import { ValidarNavbarService } from '../Observables/validar-navbar.service';
import { PermisosSeccionesService } from '../Observables/permisos-secciones.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogoTipoRiesgoGuard implements CanActivate {
  Permiso: Observable<boolean>;
  constructor(private Menu: ValidarNavbarService, 
              private Permisos: PermisosSeccionesService,
              private sessionService: SessionValidate,
              private router:Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAuthenticated();
  }
  isAuthenticated(){    
    if(this.sessionService.validateSession()) {   
      this.Menu.ActualizarNombreUsuario();
      // Permisos
      this.Permisos.AccesoCatalogoArea();
      this.Permisos.AccesoCatalogoDimension();
      this.Permisos.AccesoCatalogoCriterioLegal();
      this.Permisos.AccesoCatalogoRiesgos();
      this.Permisos.AccesoCatalogoTipoRiesgo();  
      
      this.Permisos.AccesoEncuestaRiesgosPuntosInteres();
      this.Permisos.AccesoEncuestaRiesgosAreas();
      this.Permisos.AccesoEncuestaClientesRiesgosAreas();
      this.Permisos.AccesoEncuestas();
      let Permisos = JSON.parse(sessionStorage['SessionCob']).Permisos;
      let found = Permisos.find(element => element == 'ver tipos riesgos');
      if(found != null || found != undefined){
        return true;
      }
      else{
        this.router.navigate(['']);
        return false;
      }
      
      
    }
    else {      
      this.router.navigate(['/Login']);
      return false;
    } 
  }
  
}
