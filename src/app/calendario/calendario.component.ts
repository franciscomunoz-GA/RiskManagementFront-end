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

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {
  // references the #calendar in the template  
  @ViewChild('calendar', null) calendarComponent: FullCalendarComponent;
  locales = [esLocale];
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  calendarEvents: EventInput[] = [
    { 
      title: 'Event Now', 
      start: new Date('2020-06-05'), 
      description:"1)Descripcion del evento, o algo asi por el estilo.",
      color: 'purple'
    },
    { 
      title: 'Other event ', 
      start: new Date('2020-06-07'), 
      description:"2)Descripcion del evento, o algo asi por el estilo.",
      color: 'orange' // override!
    }

  ];
  constructor(public dialog: MatDialog, ) { }

  ngOnInit(): void {
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
  TraerInformacion(){
    
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