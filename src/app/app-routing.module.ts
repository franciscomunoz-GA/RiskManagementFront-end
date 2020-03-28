import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guardians/auth.guard';
import { LoginGuard } from './guardians/login.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'Dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard] 
  },
  { 
    path: 'Login', 
    component: LoginComponent,
    canActivate: [LoginGuard] 
  },
  {
    path: 'nav',
    component: NavbarComponent
  },

  { 
    path: '', 
    redirectTo: '/Principal',    
    pathMatch: 'full',
  },
  {path: '**', component: DashboardComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
