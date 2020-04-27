import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ValidarNavbarService } from '../Observables/validar-navbar.service';
import { ServicioService }    from '../servicios/servicio.service';
import { ResponseApiEntity } from '../servicios/responseApiEntity';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {  
  ObtenerServicio: any;
  loginData = {
    email : '',
    password : ''
  }
  showEmail    = true;
  showPassword = false;
  showRecovery = true;
  showContent  = false;
  loading      = false;
  desarrollo: boolean = false;
  message : any;  
  
  constructor(public http: HttpClient, 
              public route: Router, 
              private snackBar: MatSnackBar,               
              private Menu: ValidarNavbarService){        
    
    this.ObtenerServicio = new ServicioService(http);
    this.showContent = true;
    this.Menu.OcultarNav();
    this.Menu.OcultarProgress();
    this.Menu.MostrarBackground();
  }
  ngOnInit() {    
    this.desarrollo = environment.production;
  }
  nextLogin(){
    if(this.loginData.email == "")
    {
      this.snackBar.open('Es necesario ingresar el correo electrónico','',{
        duration: 2000,
        panelClass: ['mensaje-error']
      });
    }
    else{     
      if(this.ValidateEmail(this.loginData.email) == false){
        this.snackBar.open('Es necesario ingresar un correo electrónico','',{
          duration: 2000,
          panelClass: ['mensaje-error']
        });
      }
      else{
        this.loading = true;
        this.showEmail = false;
        this.showRecovery = false;
  
        this.ObtenerServicio.PostRequest('Validar/Usuario', 'APIREST', { Correo : this.loginData.email })
        .subscribe((response: ResponseApiEntity)=>{
          this.loading = false;
          if(response.Success){
            this.showPassword = true;
            this.showRecovery = true;
          }else{
            this.showEmail = true;
            this.message = response.Message;
            this.snackBar.open(this.message,'',{
              duration: 2000
            });
          }
        }, error => {
          this.showEmail = true;
          this.loading = false;
          this.snackBar.open('Error de conexión','',{
            duration: 2000,
            
          })
        }); 
      }
                  
    }
  }
  makeLogin(){
    if(this.loginData.password == ""){
      this.snackBar.open('','',{
        duration: 2000
      });
    }
    else{
      this.loading = true;      
      this.showRecovery = false;
      this.Menu.MostrarProgress();
      this.ObtenerServicio.PostRequest('Sesion/Usuario', 'APIREST', { Correo : this.loginData.email, Password : this.loginData.password})
      .subscribe((response)=>{
        this.loading = false;
        if(response.Success){
          this.Menu.OcultarProgress();
          if(response.Data){
            let Resultado = response.Data[0];
            sessionStorage.removeItem('SessionCob');
            sessionStorage['SessionCob'] = JSON.stringify({IdUsuario: Resultado.Id, NombreUsuario: Resultado.Nombre});   
            setTimeout(()=>{ this.route.navigate(['/Dashboard']); }, 200);
          }
          else{
            this.showPassword = true;
            this.message = response.Message;
            this.snackBar.open('Contraseña incorrecta','',{
              duration: 2000
            });            
          }                    
        }
        else{
          this.loading = false;
            this.snackBar.open('Error de conexión','',{
              duration: 2000
            });
        }
      }, 
      error => {
        this.loading = false;
        this.snackBar.open('Error de conexión','',{
          duration: 2000
        })
      });
    }
  }
  public back(){
    this.loading = true;
    this.showPassword = false;
    this.showRecovery = false;
    setTimeout(()=>{
      this.loading = false;
      this.showEmail = true;
      this.showPassword = false;
      this.showRecovery = true;
    },300);
  }
  /* Evento que detecta Keyboard */
  public onKey(ev: any){
    this.showEmail ? ev.keyCode == 13 ? this.nextLogin() : null : ev.keyCode == 13 ? this.makeLogin() : null;
  }
  ValidateEmail(Email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test( Email );   
  }
  resolved(captchaResponse: string) {
    if(captchaResponse.length == 0){
      alert("Captcha no verificado")
      } 
      else {
        this.desarrollo = false;
      }
  }
}
