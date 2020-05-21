import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionValidate } from '../servicios/session-validate.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogoCriterioGuard implements CanActivate {
  Permiso: Observable<boolean>;
  constructor(private sessionService: SessionValidate,
              private router:Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAuthenticated();
  }
  isAuthenticated(){    
    if(this.sessionService.validateSession()) {
      let Permiso: boolean = false;
      let Permisos = JSON.parse(sessionStorage['SessionCob']).Permisos;
      Permisos.forEach(element => {
        if(element === 'ver estandares legales'){
          Permiso = true;
        }
      });
      this.router.navigate(['']);
      return Permiso;
    }
    else {      
      this.router.navigate(['/Login']);
      return false;
    } 
  }
}
