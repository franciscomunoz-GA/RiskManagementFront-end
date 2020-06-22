import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionValidate } from '../servicios/session-validate.service';
import { ValidarNavbarService } from '../Observables/validar-navbar.service';
import { PermisosSeccionesService } from '../Observables/permisos-secciones.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private Menu: ValidarNavbarService, 
              private Permisos: PermisosSeccionesService, 
              private router:Router, 
              private sessionService: SessionValidate) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.isAuthenticated();
  }

  isAuthenticated() {
    if(this.sessionService.validateSession()) {  
      this.Menu.MostrarNav();
      this.Menu.OcultarBackground();
      //this.Menu.ActualizarMenu();
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
      return true;
    } 
    else {      
      this.router.navigate(['/Login']);
      return false;
    }        
  }
}
