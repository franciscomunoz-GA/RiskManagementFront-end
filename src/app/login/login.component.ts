import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ValidarNavbarService } from '../Observables/validar-navbar.service';
import { ServicioService }    from '../servicios/servicio.service';
import { ResponseApiEntity } from '../servicios/responseApiEntity';
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
  showEmail = true;
  showPassword = false;
  showRecovery = true;
  showContent = false;
  loading = false;

  message : any;  
  

  constructor(public http: HttpClient, 
              public route: Router, 
              private snackBar: MatSnackBar,               
              private Menu: ValidarNavbarService){        
    
    this.Menu.OcultarNav();
    this.ObtenerServicio = new ServicioService(http);
    this.showContent = true;
    this.Menu.OcultarProgress();
  }
  ngOnInit() {    
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
        this.loginData.email = this.loginData.email+"@grupoarmstrong.com";
      }
      this.loading = true;
      this.showEmail = false;
      this.showRecovery = false;

      this.ObtenerServicio.PostRequest('validarUsuario', 'APIREST', { Correo : this.loginData.email })
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
      this.ObtenerServicio.PostRequest('sesionUsuario', 'APIREST', { Correo : this.loginData.email, Password : this.loginData.password})
      .subscribe((response)=>{
        this.loading = false;
        if(response.Success){
          let IdUsuario = response.Data[0].Id;
          let NombreUsuario = response.Data[0].Nombre;
          this.ObtenerServicio.PostRequest('obtenerMenus', 'APIREST', { IdUsuario : IdUsuario})
          .subscribe((response)=>{
            this.loading = false;
            if(response.Success){
              if(response.Data == null && response.Message == 'Token No Valido'){
                sessionStorage.clear();
                this.back();
              }
              else{
                console.log(response);
                let token = {
                  Sesion: true,
                  IdUsuario:     IdUsuario,
                  NombreUsuario: NombreUsuario,
                  Correo:        this.loginData.email
                }
                /* Guardamos datos en Sesion */
                sessionStorage.removeItem('SessionCob');
                sessionStorage.removeItem('Menus');
                sessionStorage['Menus'] = JSON.stringify(response.Data.Menus);
                sessionStorage['SessionCob'] = JSON.stringify(token);    
                this.Menu.OcultarProgress();            
                setTimeout(()=>{ this.route.navigate(['/Principal']); }, 200);            
              }
            }
            else{
              this.showPassword = true;
              this.message = response.Message;
              this.snackBar.open(this.message,'',{
                duration: 2000
              });
            }
          }, 
          error => {
            this.loading = false;
            this.snackBar.open('','',{
              duration: 2000
            })
          });
        }
        else{
          this.showPassword = true;
          this.message = response.Message;
          this.snackBar.open(this.message,'',{
            duration: 2000
          });
        }
      }, 
      error => {
        this.loading = false;
        this.snackBar.open('','',{
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
    return emailReg.test( Email );   }
   resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
}
}
