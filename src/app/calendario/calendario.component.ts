import { Component, OnInit, ViewChild, Inject } from '@angular/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { EventInput } from '@fullcalendar/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServicioService } from '../servicios/servicio.service';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { ValidarNavbarService } from '../Observables/validar-navbar.service';
import { ExcelService } from '../servicios/excel-service.service';
import { ValidarPermisoService } from '../servicios/validar-permiso.service';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {
  // Servicio API
  ObtenerServicio: any;
  // sesión
  IdUsuario = JSON.parse(sessionStorage['SessionCob']).IdUsuario;
  
  // references the #calendar in the template  
  @ViewChild('calendar', null) calendarComponent: FullCalendarComponent;
  locales = [esLocale];
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  calendarEvents: EventInput[] = [];
  constructor(public dialog: MatDialog, 
              private Menu: ValidarNavbarService, 
              private excelService:ExcelService, 
              private snackBar: MatSnackBar, 
              public http: HttpClient,
              private Permiso: ValidarPermisoService) {
    this.ObtenerServicio = new ServicioService(http);
    this.Menu.OcultarProgress();
   }

  ngOnInit(): void {
    this.TraerInformacion();
  }
  handleDateClick(arg) { // handler method    
    const dialogRef = this.dialog.open(DialogCalendario, {
      width: '50vw',
      data:  {
        Titulo: 'Agregar cita',
        Tipo: 'Agregar', 
        Dia: arg.dateStr
      }
    });
 
    dialogRef.afterClosed().subscribe(result => {
       this.TraerInformacion();   
    });
  }
  Detalle(event){    
    console.log(event);
    
  }
  TraerInformacion(){
    this.calendarEvents = [];
    this.Menu.MostrarProgress();
    this.ObtenerServicio.PostRequest('Seleccionar/Calendario', 'APIREST', {
      IdUsuario: this.IdUsuario
     })
     .subscribe((response)=>{
       this.Menu.OcultarProgress();
       if(response.Success){
         if(response.Data){
           response.Data.forEach(element => {
             let color: string;
             switch (element.respondido) {
               case 1:
                 color = "#1A237E";
                 break;
               case 0:
                  color = "#1B5E20";
                  break;
               case 3:
                  color = "red";
                  break;
               default:
                 color = "#1A237E";
                 break;
             }            
            this.calendarEvents = this.calendarEvents.concat({              
              id:          element.IdCalendario,
              title:       element.Inspector+" "+element.Descripcion,
              textColor:   "white",
              start:       new Date(element.Fecha),    
              color:       color,
              allDay:      false,
              
            })
           });           
         }
           
       }
       else{                
         this.snackBar.open('Error de conexión','',{
           duration: 2000
         });
       }
     }, 
     error => {      
       this.snackBar.open('Error de conexión','',{
         duration: 2000,
         
       });
     });  
  }
}
@Component({
  selector: 'dialog-calendario-area',
  templateUrl: 'dialog-calendario.html',
  styleUrls: ['./calendario.component.scss']
 })
export class DialogCalendario implements OnInit{
  Titulo: string;
  ObtenerServicio: any;
  Progressbar: boolean;
  // sesión
  IdUsuario = JSON.parse(sessionStorage['SessionCob']).IdUsuario;
  Tipo: boolean = true;
  TipoCliente: boolean = true;
  type:        number = 2;
  //ng Module  
  Dia: string;
  Hora: string;
  Clientes: any;
  SitiosInteres: any;
  Inspectores: any;
  //listado
  ListaClientes      = [];
  ListaSitiosInteres = [];
  ListaInspectores   = [];

  constructor(public dialogRef: MatDialogRef<DialogCalendario>, 
              @Inject(MAT_DIALOG_DATA) public data: any,
              public http: HttpClient, private snackBar: MatSnackBar,
              private _adapter: DateAdapter<any>) {
    this.ObtenerServicio = new ServicioService(http);

    this.Titulo = data.Titulo;
    this.Dia = data.Dia+"T00:00:00";
    this.Tipo = data.Tipo;
    
    this._adapter.setLocale('fr');
}
  ngOnInit(): void {
    if(this.data.Titulo == 'Modificar'){      
      this.Tipo = false;
    }
    else{
     this.Tipo = true;
    }
    this.TraerDetalle();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  CambiarTipoCliente(event){        
    if(event.value == "true"){
      this.type = 2;
      this.TipoCliente = true;
    }
    else{
      this.type = 1;
      this.TipoCliente = false;
    }
  }
  TraerDetalle(){
    this.Progressbar = true;
    this.ObtenerServicio.PostRequest('Seleccionar/CatalogosC', 'APIREST', {})
     .subscribe((response)=>{
       this.Progressbar = false;
       if(response.Success){
         if(response.Data){
           let Respuesta = response.Data;
           this.ListaClientes      = Respuesta.ClientesRA;
           this.ListaSitiosInteres = Respuesta.SInteresR;
           this.ListaInspectores   = Respuesta.Inspectores;
         }
         else{
          this.snackBar.open('No hay datos por mostrar','',{
            duration: 2000
          });
         }
       }
       else{                
         this.snackBar.open('Error de conexión','',{
           duration: 2000
         });
       }
     }, 
     error => {      
       this.snackBar.open('Error de conexión','',{
         duration: 2000,
         
       })
     });  
  }
  Agregar(){
    if(this.Inspectores > 0 && (this.Clientes > 0 || this.SitiosInteres > 0) && (this.Dia != undefined) && (this.Hora != undefined)){
      let fecha = this.Dia.slice(0,11)+this.Hora;
      let id: number;
      if(this.type == 1){
        id = this.SitiosInteres;
      }
      else{
        id = this.Clientes;
      }
      this.ObtenerServicio.PostRequest('Insertar/Calendario', 'APIREST', {
        IdInspector: this.Inspectores,
        Fecha:       fecha,
        Tipo:        this.type,
        Id:          id,
        IdUsuario:   this.IdUsuario
      })
       .subscribe((response)=>{
        //  this.Menu.OcultarProgress();
         if(response.Success){
           if(response.Data){
             let Respuesta = response.Data;             
             if(Respuesta > 0){
              this.snackBar.open('Cita guardada correctamente','',{
                duration: 2000,
                panelClass: ['mensaje-success']
              });
              this.onNoClick();
             }
           }
           else{
            this.snackBar.open('No hay datos por mostrar','',{
              duration: 2000
            });
           }
         }
         else{                
           this.snackBar.open('Error de conexión','',{
             duration: 2000
           });
         }
       }, 
       error => {      
         this.snackBar.open('Error de conexión','',{
           duration: 2000,
           
         })
       }); 
    }
    else{
      this.snackBar.open('Es necesario llenar todos los campos','',{
        duration: 3000,
        panelClass: ['mensaje-warning']
      });
    }     
  }
  Modificar(){

  }
}