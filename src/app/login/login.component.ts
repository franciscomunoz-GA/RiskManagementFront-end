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
  styleUrls: ['./login.component.scss']
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
  disabled: boolean = true;
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
    for (var i = 1; i <= 10000; i++){
      clearInterval(i);
    } 
  }

  ngOnInit() {    
    this.disabled = environment.production;
    // this.disabled = false;
  }
  nextLogin(){
    if(this.loginData.email == ""){
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
        this.showRecovery = false;  
        this.makeLogin();
      }
                  
    }
  }
  makeLogin(){
    if(this.loginData.password == ""){
      this.snackBar.open('No se ha ingresado una contraseña','',{
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
            let Resultado = response.Data;
            if(Resultado.Permisos == [] || Resultado.Permisos == null || Resultado.Permisos == ''){
              this.snackBar.open('Contraseña incorrecta','',{
                duration: 2000
              }); 
            }
            else{
              if(Resultado.Sesion[0].Sesion != 'Sesión activa'){
                this.ActualizarSesion(Resultado.Sesion[0].Id);
                sessionStorage.removeItem('SessionCob');
                sessionStorage['SessionCob'] = JSON.stringify({IdUsuario: Resultado.Sesion[0].Id, NombreUsuario: Resultado.Sesion[0].Nombre, Permisos: Resultado.Permisos});   
                this.route.navigate(['/Dashboard']);
              }
              else{
                this.snackBar.open('Se detectó que ya existe una conexión, si está intentando establecer una conexión adicional es necesario que espere 5 minutos y vuelva a intentarlo','',{
                  duration: 10000
                });  
              } 
            }
                    
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
  UserPass(ev: any){
    if(ev.keyCode == 13){
      if(this.disabled == false){
        this.makeLogin();
      }
    }    
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
        this.disabled = false;
      }
  }
  private ActualizarSesion(IdUsuario){
    setInterval(()=>{
      this.ObtenerServicio.PostRequest('Actualizar/Seccion', 'APIREST', { IdUsuario: IdUsuario})
      .subscribe((response)=>{
        this.loading = false;
        if(response.Success){
          console.log();
             
        }
        else{
          this.loading = false;
            this.snackBar.open('Error de conexión','',{
              duration: 2000
            });
        }
      });
    }, 240000);
  }
}
