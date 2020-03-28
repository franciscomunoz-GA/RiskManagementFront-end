import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionValidate } from '../servicios/session-validate.service';
import { ValidarNavbarService } from '../Observables/validar-navbar.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private Menu: ValidarNavbarService, private router:Router, private sessionService: SessionValidate) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.isAuthenticated();
  }
  isAuthenticated(){
    if(this.sessionService.validateSession() == false) {
      this.Menu.OcultarNav();
      return true;
    } 
    else {
      this.router.navigate(['/Principal']);
      return false;
    }        
  }    
}
