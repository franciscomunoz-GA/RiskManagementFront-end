import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ValidarNavbarService } from '../Observables/validar-navbar.service';
import readXlsxFile from 'read-excel-file';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ExcelService} from '../servicios/excel-service.service';
import { ServicioService } from '../servicios/servicio.service';
import { ValidarPermisoService } from '../servicios/validar-permiso.service';
import { FormControl } from '@angular/forms';

export interface EstructuraEncuesta{
  Id:          number;
  Folio:       string;
  Inspector:   string;
  Descripcion: string;
  Fecha:       string;
  Tipo:        string;
  Respondido:  string;
}

@Component({
  selector: 'app-encuestas',
  templateUrl: './encuestas.component.html',
  styleUrls: ['./encuestas.component.scss']
})
export class EncuestasComponent implements OnInit {
  // Servicio API
  ObtenerServicio: any;
  // sesión
  IdUsuario = JSON.parse(sessionStorage['SessionCob']).IdUsuario;
  
  displayedColumns: string[] = ['Folio', 'Fecha', 'Inspector', 'Descripcion', 'Tipo', 'Detalle'];
  Tabla: MatTableDataSource<EstructuraEncuesta>;

  Encuestas: EstructuraEncuesta[] = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(public dialog: MatDialog, 
              private Menu: ValidarNavbarService, 
              private excelService:ExcelService, 
              private snackBar: MatSnackBar, 
              public http: HttpClient,
              private Permiso: ValidarPermisoService) {
    this.ObtenerServicio = new ServicioService(http);
    this.Menu.OcultarProgress();
    this.Tabla = new MatTableDataSource(this.Encuestas);
    
  }
  
  ngOnInit() {
    this.Tabla.paginator = this.paginator;
    this.Tabla.sort = this.sort;
    this.TraerInformacion();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.Tabla.filter = filterValue.trim().toLowerCase();

    if (this.Tabla.paginator) {
      this.Tabla.paginator.firstPage();
    }
  }
  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.Encuestas, 'Encuestas');
  }
  Dialog(Id, Tipo){
    const dialogRef = this.dialog.open(DialogEncuesta, {
      width: '100vw',
      data:{
        Id: Id,
        Tipo: Tipo
      },    
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');      
    });
  }
  TraerInformacion(){    
    this.Encuestas = [];
    this.Menu.MostrarProgress();
    this.ObtenerServicio.PostRequest('Seleccionar/Calendario', 'APIREST', {
     IdUsuario: this.IdUsuario
    })
    .subscribe((response)=>{
      this.Menu.OcultarProgress();
      if(response.Success){
        if(response.Data){
          response.Data.forEach(element => {          
            let Tipo: string;
            if(element.Tipo == 1){
              Tipo = "Sitio de interés";
            }
            else{
              Tipo = "Cliente";
            } 
            let Fecha = element.Fecha.replace("T",' ');
            this.Encuestas.push({ 
              Id:          element.IdCalendario,
              Folio:       element.Folio,
              Inspector:   element.Inspector,
              Descripcion: element.Descripcion,
              Fecha:       Fecha,
              Tipo:        Tipo,
              Respondido:  element.respondido,
            });
          });
          this.Tabla.data = this.Encuestas;
          this.Tabla.paginator = this.paginator;          
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
}
export interface Riesgos {
  Id:     number
  Riesgo: string;
  Descripcion: string;
  Impacto: number;
  Probabilidad: number; 
}

export interface AreasRiesgos {  
  Area:     string;
  Riesgos:   Riesgos[];
  disabled?: boolean;
}
@Component({
  selector: 'dialog-encuesta',
  templateUrl: 'dialog-encuesta.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogEncuesta implements OnInit {
  AreasRiesgosControl = new FormControl();
  AreasRiesgos: AreasRiesgos[] = [];
  // Servicio de api
  ObtenerServicio: any;
  // sesión
  IdUsuario = JSON.parse(sessionStorage['SessionCob']).IdUsuario;

  //Información de la tabal
  Id: number;
  Tipo: string;

  Nombre: string;
  Titulo: string;  
  Progressbar: boolean = false;
  

  //Binding
  Inspector: string = "";
  Folio:     string = "";
  Cliente:   string = "";
  Fecha:     string = "";
  ToolTip:   string = "";
  SitioInteres: string = "";
  Areas:     any;
  
  Riesgos: Riesgos[] = [];

  Area: string;
  Riesgo: any;  

  //plano cartesiano
  C10_1: boolean; C10_2: boolean; C10_3: boolean; C10_4: boolean; C10_5: boolean; C10_6: boolean; C10_7: boolean; C10_8: boolean; C10_9: boolean; C10_10: boolean; 
  C9_1: boolean; C9_2: boolean; C9_3: boolean; C9_4: boolean; C9_5: boolean; C9_6: boolean; C9_7: boolean; C9_8: boolean; C9_9: boolean; C9_10: boolean; 
  C8_1: boolean; C8_2: boolean; C8_3: boolean; C8_4: boolean; C8_5: boolean; C8_6: boolean; C8_7: boolean; C8_8: boolean; C8_9: boolean; C8_10: boolean; 
  C7_1: boolean; C7_2: boolean; C7_3: boolean; C7_4: boolean; C7_5: boolean; C7_6: boolean; C7_7: boolean; C7_8: boolean; C7_9: boolean; C7_10: boolean; 
  C6_1: boolean; C6_2: boolean; C6_3: boolean; C6_4: boolean; C6_5: boolean; C6_6: boolean; C6_7: boolean; C6_8: boolean; C6_9: boolean; C6_10: boolean; 
  C5_1: boolean; C5_2: boolean; C5_3: boolean; C5_4: boolean; C5_5: boolean; C5_6: boolean; C5_7: boolean; C5_8: boolean; C5_9: boolean; C5_10: boolean; 
  C4_1: boolean; C4_2: boolean; C4_3: boolean; C4_4: boolean; C4_5: boolean; C4_6: boolean; C4_7: boolean; C4_8: boolean; C4_9: boolean; C4_10: boolean; 
  C3_1: boolean; C3_2: boolean; C3_3: boolean; C3_4: boolean; C3_5: boolean; C3_6: boolean; C3_7: boolean; C3_8: boolean; C3_9: boolean; C3_10: boolean; 
  C2_1: boolean; C2_2: boolean; C2_3: boolean; C2_4: boolean; C2_5: boolean; C2_6: boolean; C2_7: boolean; C2_8: boolean; C2_9: boolean; C2_10: boolean; 
  C1_1: boolean; C1_2: boolean; C1_3: boolean; C1_4: boolean; C1_5: boolean; C1_6: boolean; C1_7: boolean; C1_8: boolean; C1_9: boolean; C1_10: boolean; 
  constructor(public dialogRef: MatDialogRef<DialogEncuesta>, @Inject(MAT_DIALOG_DATA) public data: any, public http: HttpClient, private snackBar: MatSnackBar,) {
      this.Id   = data.Id;
      this.Tipo = data.Tipo;

      this.ObtenerServicio = new ServicioService(http);
  }
  ngOnInit() {    
    this.TraerInformacion();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  TraerInformacion(){
    console.log(this.Id, this.Tipo);
    let tipo;
    if(this.Tipo == 'Cliente'){
      tipo = 2;
    }
    else{
      tipo = 1;
    }

    this.Progressbar= true;
    this.ObtenerServicio.PostRequest('Seleccionar/CartesianoD', 'APIREST', 
    {
      Id :       this.Id,
      Tipo:      tipo,
      IdUsuario: this.IdUsuario
    })
    .subscribe((response)=>{   
      this.Progressbar = false;             
      if(response.Success){
        if(response.Data){
          let Resultado = response.Data[0];          
          if(tipo == 1){
            this.Inspector    = Resultado.Inspector;
            this.Folio        = Resultado.Folio;
            this.SitioInteres = Resultado.SitioInteres;
            this.Fecha        = Resultado.Fecha;
            
            Resultado.Riesgos.forEach(element => {              
              let Descripcion: string;
              Descripcion = "Impacto: "+element.Impacto+" Probabilidad: "+element.Probabilidad;
              this.Riesgos.push({
                Id:           element.IdRiesgo,
                Riesgo:       element.Riesgo,
                Descripcion:  Descripcion,
                Impacto:      element.Impacto,
                Probabilidad: element.Probabilidad
              });
            });            
          }
          else{
            this.Inspector = Resultado.Inspector;
            this.Folio     = Resultado.Folio;
            this.Cliente   = Resultado.Cliente;
            this.Fecha     = Resultado.Fecha;
            this.Areas     = Resultado.Areas;
            let riesgos: Riesgos[] = []; 
            Resultado.Areas.forEach(element => {
              let NombreArea: string = element.NombreArea;
              let Area: string = element.Area;
              let Titulo: string = NombreArea+" ("+Area+")";
              
              element.Riesgos.forEach(item => {
                riesgos.push({
                  Id:           item.IdRespuestas, 
                  Riesgo:       item.Riesgo, 
                  Descripcion:  "Impacto: "+item.Impacto+" Probabilidad: "+item.Probabilidad,
                  Impacto:      item.Impacto,
                  Probabilidad: item.Probabilidad
                });
              });
              this.AreasRiesgos.push({Area: Titulo, Riesgos: riesgos}); 
            });            
          }          
        }      
        else{
          this.snackBar.open('Error de conexión','',{
            duration: 3000,
            panelClass: ['mensaje-error']
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
  BuscarArea(event){    
    let area;
    // area = this.Areas.find(element => element.IdArea == event);        
    this.AreasRiesgos.forEach(element => {
      element.Riesgos.forEach(item => {
        event == item.Id ? this.MostrarPunto(item.Impacto, item.Probabilidad): null;
      });
    });
    // this.Riesgos = area.Riesgos;
  }
  BuscarRiesgo(event){
    this.Riesgos.forEach(item => {
      event == item.Id ? this.MostrarPunto(item.Impacto, item.Probabilidad): null;
    });
  }
  private MostrarPunto(Impacto: number, Probabilidad: number){
    let Formula: number;
    Formula = Math.round(((+Impacto+ +Probabilidad)/2));    
    
    switch (Formula) {
      case 1:
        this.ToolTip = Formula+" - No significativo";
        break;
      case 2:
        this.ToolTip = Formula+" - No significativo";
          break;
      case 3:
          this.ToolTip = Formula+" - Menor";
          break;
      case 4:
          this.ToolTip = Formula+" - Menor";
          break;
      case 5:
          this.ToolTip = Formula+" - Crítico";
          break;
      case 6:
          this.ToolTip = Formula+" - Crítico";
          break;
      case 7:
          this.ToolTip = Formula+" - Mayor";
          break;
      case 8:
          this.ToolTip = Formula+" - Mayor";
          break;
      case 9:
          this.ToolTip = Formula+" - Catastrófico";
          break;
      case 10:
          this.ToolTip = Formula+" - Catastrófico";
          break;
      default:
        this.ToolTip = Formula+" - No evaluado";
        break;
    }
    (Impacto == 1 && Probabilidad == 1) ? this.C1_1 = true : this.C1_1 = false;
    (Impacto == 1 && Probabilidad == 2) ? this.C1_2 = true : this.C1_2 = false;
    (Impacto == 1 && Probabilidad == 3) ? this.C1_3 = true : this.C1_3 = false;
    (Impacto == 1 && Probabilidad == 4) ? this.C1_4 = true : this.C1_4 = false;
    (Impacto == 1 && Probabilidad == 5) ? this.C1_5 = true : this.C1_5 = false;
    (Impacto == 1 && Probabilidad == 6) ? this.C1_6 = true : this.C1_6 = false;
    (Impacto == 1 && Probabilidad == 7) ? this.C1_7 = true : this.C1_7 = false;
    (Impacto == 1 && Probabilidad == 8) ? this.C1_8 = true : this.C1_8 = false;
    (Impacto == 1 && Probabilidad == 9) ? this.C1_9 = true : this.C1_9 = false;
    (Impacto == 1 && Probabilidad == 10) ? this.C1_10 = true : this.C1_10 = false;

    (Impacto == 1 && Probabilidad == 1) ? this.C2_1 = true : this.C2_1 = false;
    (Impacto == 2 && Probabilidad == 2) ? this.C2_2 = true : this.C2_2 = false;
    (Impacto == 2 && Probabilidad == 3) ? this.C2_3 = true : this.C2_3 = false;
    (Impacto == 2 && Probabilidad == 4) ? this.C2_4 = true : this.C2_4 = false;
    (Impacto == 2 && Probabilidad == 5) ? this.C2_5 = true : this.C2_5 = false;
    (Impacto == 2 && Probabilidad == 6) ? this.C2_6 = true : this.C2_6 = false;
    (Impacto == 2 && Probabilidad == 7) ? this.C2_7 = true : this.C2_7 = false;
    (Impacto == 2 && Probabilidad == 8) ? this.C2_8 = true : this.C2_8 = false;
    (Impacto == 2 && Probabilidad == 9) ? this.C2_9 = true : this.C2_9 = false;
    (Impacto == 2 && Probabilidad == 10) ? this.C2_10 = true : this.C2_10 = false;
    
    (Impacto == 3 && Probabilidad == 1) ? this.C3_1 = true : this.C3_1 = false;
    (Impacto == 3 && Probabilidad == 2) ? this.C3_2 = true : this.C3_2 = false;
    (Impacto == 3 && Probabilidad == 3) ? this.C3_3 = true : this.C3_3 = false;
    (Impacto == 3 && Probabilidad == 4) ? this.C3_4 = true : this.C3_4 = false;
    (Impacto == 3 && Probabilidad == 5) ? this.C3_5 = true : this.C3_5 = false;
    (Impacto == 3 && Probabilidad == 6) ? this.C3_6 = true : this.C3_6 = false;
    (Impacto == 3 && Probabilidad == 7) ? this.C3_7 = true : this.C3_7 = false;
    (Impacto == 3 && Probabilidad == 8) ? this.C3_8 = true : this.C3_8 = false;
    (Impacto == 3 && Probabilidad == 9) ? this.C3_9 = true : this.C3_9 = false;
    (Impacto == 3 && Probabilidad == 10) ? this.C3_10 = true : this.C3_10 = false;

    (Impacto == 4 && Probabilidad == 1) ? this.C4_1 = true : this.C4_1 = false;
    (Impacto == 4 && Probabilidad == 2) ? this.C4_2 = true : this.C4_2 = false;
    (Impacto == 4 && Probabilidad == 3) ? this.C4_3 = true : this.C4_3 = false;
    (Impacto == 4 && Probabilidad == 4) ? this.C4_4 = true : this.C4_4 = false;
    (Impacto == 4 && Probabilidad == 5) ? this.C4_5 = true : this.C4_5 = false;
    (Impacto == 4 && Probabilidad == 6) ? this.C4_6 = true : this.C4_6 = false;
    (Impacto == 4 && Probabilidad == 7) ? this.C4_7 = true : this.C4_7 = false;
    (Impacto == 4 && Probabilidad == 8) ? this.C4_8 = true : this.C4_8 = false;
    (Impacto == 4 && Probabilidad == 9) ? this.C4_9 = true : this.C4_9 = false;
    (Impacto == 4 && Probabilidad == 10) ? this.C4_10 = true : this.C4_10 = false;

    (Impacto == 5 && Probabilidad == 1) ? this.C5_1 = true : this.C5_1 = false;
    (Impacto == 5 && Probabilidad == 2) ? this.C5_2 = true : this.C5_2 = false;
    (Impacto == 5 && Probabilidad == 3) ? this.C5_3 = true : this.C5_3 = false;
    (Impacto == 5 && Probabilidad == 4) ? this.C5_4 = true : this.C5_4 = false;
    (Impacto == 5 && Probabilidad == 5) ? this.C5_5 = true : this.C5_5 = false;
    (Impacto == 5 && Probabilidad == 6) ? this.C5_6 = true : this.C5_6 = false;
    (Impacto == 5 && Probabilidad == 7) ? this.C5_7 = true : this.C5_7 = false;
    (Impacto == 5 && Probabilidad == 8) ? this.C5_8 = true : this.C5_8 = false;
    (Impacto == 5 && Probabilidad == 9) ? this.C5_9 = true : this.C5_9 = false;
    (Impacto == 5 && Probabilidad == 10) ? this.C5_10 = true : this.C5_10 = false;

    (Impacto == 6 && Probabilidad == 1) ? this.C6_1 = true : this.C6_1 = false;
    (Impacto == 6 && Probabilidad == 2) ? this.C6_2 = true : this.C6_2 = false;
    (Impacto == 6 && Probabilidad == 3) ? this.C6_3 = true : this.C6_3 = false;
    (Impacto == 6 && Probabilidad == 4) ? this.C6_4 = true : this.C6_4 = false;
    (Impacto == 6 && Probabilidad == 5) ? this.C6_5 = true : this.C6_5 = false;
    (Impacto == 6 && Probabilidad == 6) ? this.C6_6 = true : this.C6_6 = false;
    (Impacto == 6 && Probabilidad == 7) ? this.C6_7 = true : this.C6_7 = false;
    (Impacto == 6 && Probabilidad == 8) ? this.C6_8 = true : this.C6_8 = false;
    (Impacto == 6 && Probabilidad == 9) ? this.C6_9 = true : this.C6_9 = false;
    (Impacto == 6 && Probabilidad == 10) ? this.C6_10 = true : this.C6_10 = false;

    (Impacto == 7 && Probabilidad == 1) ? this.C7_1 = true : this.C7_1 = false;
    (Impacto == 7 && Probabilidad == 2) ? this.C7_2 = true : this.C7_2 = false;
    (Impacto == 7 && Probabilidad == 3) ? this.C7_3 = true : this.C7_3 = false;
    (Impacto == 7 && Probabilidad == 4) ? this.C7_4 = true : this.C7_4 = false;
    (Impacto == 7 && Probabilidad == 5) ? this.C7_5 = true : this.C7_5 = false;
    (Impacto == 7 && Probabilidad == 6) ? this.C7_6 = true : this.C7_6 = false;
    (Impacto == 7 && Probabilidad == 7) ? this.C7_7 = true : this.C7_7 = false;
    (Impacto == 7 && Probabilidad == 8) ? this.C7_8 = true : this.C7_8 = false;
    (Impacto == 7 && Probabilidad == 9) ? this.C7_9 = true : this.C7_9 = false;
    (Impacto == 7 && Probabilidad == 10) ? this.C7_10 = true : this.C7_10 = false;

    (Impacto == 8 && Probabilidad == 1) ? this.C8_1 = true : this.C8_1 = false;
    (Impacto == 8 && Probabilidad == 2) ? this.C8_2 = true : this.C8_2 = false;
    (Impacto == 8 && Probabilidad == 3) ? this.C8_3 = true : this.C8_3 = false;
    (Impacto == 8 && Probabilidad == 4) ? this.C8_4 = true : this.C8_4 = false;
    (Impacto == 8 && Probabilidad == 5) ? this.C8_5 = true : this.C8_5 = false;
    (Impacto == 8 && Probabilidad == 6) ? this.C8_6 = true : this.C8_6 = false;
    (Impacto == 8 && Probabilidad == 7) ? this.C8_7 = true : this.C8_7 = false;
    (Impacto == 8 && Probabilidad == 8) ? this.C8_8 = true : this.C8_8 = false;
    (Impacto == 8 && Probabilidad == 9) ? this.C8_9 = true : this.C8_9 = false;
    (Impacto == 8 && Probabilidad == 10) ? this.C8_10 = true : this.C8_10 = false;

    (Impacto == 9 && Probabilidad == 1) ? this.C9_1 = true : this.C9_1 = false;
    (Impacto == 9 && Probabilidad == 2) ? this.C9_2 = true : this.C9_2 = false;
    (Impacto == 9 && Probabilidad == 3) ? this.C9_3 = true : this.C9_3 = false;
    (Impacto == 9 && Probabilidad == 4) ? this.C9_4 = true : this.C9_4 = false;
    (Impacto == 9 && Probabilidad == 5) ? this.C9_5 = true : this.C9_5 = false;
    (Impacto == 9 && Probabilidad == 6) ? this.C9_6 = true : this.C9_6 = false;
    (Impacto == 9 && Probabilidad == 7) ? this.C9_7 = true : this.C9_7 = false;
    (Impacto == 9 && Probabilidad == 8) ? this.C9_8 = true : this.C9_8 = false;
    (Impacto == 9 && Probabilidad == 9) ? this.C9_9 = true : this.C9_9 = false;
    (Impacto == 9 && Probabilidad == 10) ? this.C9_10 = true : this.C9_10 = false;

    (Impacto == 10 && Probabilidad == 1) ? this.C10_1 = true : this.C10_1 = false;
    (Impacto == 10 && Probabilidad == 2) ? this.C10_2 = true : this.C10_2 = false;
    (Impacto == 10 && Probabilidad == 3) ? this.C10_3 = true : this.C10_3 = false;
    (Impacto == 10 && Probabilidad == 4) ? this.C10_4 = true : this.C10_4 = false;
    (Impacto == 10 && Probabilidad == 5) ? this.C10_5 = true : this.C10_5 = false;
    (Impacto == 10 && Probabilidad == 6) ? this.C10_6 = true : this.C10_6 = false;
    (Impacto == 10 && Probabilidad == 7) ? this.C10_7 = true : this.C10_7 = false;
    (Impacto == 10 && Probabilidad == 8) ? this.C10_8 = true : this.C10_8 = false;
    (Impacto == 10 && Probabilidad == 9) ? this.C10_9 = true : this.C10_9 = false;
    (Impacto == 10 && Probabilidad == 10) ? this.C10_10 = true : this.C10_10 = false;
  }
}