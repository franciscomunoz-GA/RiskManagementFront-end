import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionValidate } from '../servicios/session-validate.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogoRiesgoGuard implements CanActivate {
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
      let Permisos = JSON.parse(sessionStorage['SessionCob']).Permisos;
      let found = Permisos.find(element => element == 'ver riesgos');
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
