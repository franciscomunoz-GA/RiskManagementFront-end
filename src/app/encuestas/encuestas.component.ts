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
import { DataSource } from '@angular/cdk/table';

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
      maxWidth: '1200px',
      minWidth: '300px',
      data:{
        Id: Id,
        Tipo: Tipo
      },    
    });

    dialogRef.afterClosed().subscribe(result => {
      
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
  Tipo:         number;
  Id:           number;
  Riesgo:       string;
  Descripcion:  string;
  Impacto:      number;
  Probabilidad: number; 
  Resultado:    string;
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
  toppings = new FormControl();
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

  Area: any;
  Riesgo: any;  

  //plano cartesiano
  Inmediata:   boolean = true;
  Periodica:   boolean = true;
  Seguimiento: boolean = true;
  Controlada:  boolean = true;
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
  
  ToolTipC10_1: string; ToolTipC10_2: string; ToolTipC10_3: string; ToolTipC10_4: string; ToolTipC10_5: string; ToolTipC10_6: string; ToolTipC10_7: string; ToolTipC10_8: string; ToolTipC10_9: string; ToolTipC10_10: string; 
  ToolTipC9_1: string; ToolTipC9_2: string; ToolTipC9_3: string; ToolTipC9_4: string; ToolTipC9_5: string; ToolTipC9_6: string; ToolTipC9_7: string; ToolTipC9_8: string; ToolTipC9_9: string; ToolTipC9_10: string;
  ToolTipC8_1: string; ToolTipC8_2: string; ToolTipC8_3: string; ToolTipC8_4: string; ToolTipC8_5: string; ToolTipC8_6: string; ToolTipC8_7: string; ToolTipC8_8: string; ToolTipC8_9: string; ToolTipC8_10: string; 
  ToolTipC7_1: string; ToolTipC7_2: string; ToolTipC7_3: string; ToolTipC7_4: string; ToolTipC7_5: string; ToolTipC7_6: string; ToolTipC7_7: string; ToolTipC7_8: string; ToolTipC7_9: string; ToolTipC7_10: string; 
  ToolTipC6_1: string; ToolTipC6_2: string; ToolTipC6_3: string; ToolTipC6_4: string; ToolTipC6_5: string; ToolTipC6_6: string; ToolTipC6_7: string; ToolTipC6_8: string; ToolTipC6_9: string; ToolTipC6_10: string; 
  ToolTipC5_1: string; ToolTipC5_2: string; ToolTipC5_3: string; ToolTipC5_4: string; ToolTipC5_5: string; ToolTipC5_6: string; ToolTipC5_7: string; ToolTipC5_8: string; ToolTipC5_9: string; ToolTipC5_10: string; 
  ToolTipC4_1: string; ToolTipC4_2: string; ToolTipC4_3: string; ToolTipC4_4: string; ToolTipC4_5: string; ToolTipC4_6: string; ToolTipC4_7: string; ToolTipC4_8: string; ToolTipC4_9: string; ToolTipC4_10: string; 
  ToolTipC3_1: string; ToolTipC3_2: string; ToolTipC3_3: string; ToolTipC3_4: string; ToolTipC3_5: string; ToolTipC3_6: string; ToolTipC3_7: string; ToolTipC3_8: string; ToolTipC3_9: string; ToolTipC3_10: string; 
  ToolTipC2_1: string; ToolTipC2_2: string; ToolTipC2_3: string; ToolTipC2_4: string; ToolTipC2_5: string; ToolTipC2_6: string; ToolTipC2_7: string; ToolTipC2_8: string; ToolTipC2_9: string; ToolTipC2_10: string; 
  ToolTipC1_1: string; ToolTipC1_2: string; ToolTipC1_3: string; ToolTipC1_4: string; ToolTipC1_5: string; ToolTipC1_6: string; ToolTipC1_7: string; ToolTipC1_8: string; ToolTipC1_9: string; ToolTipC1_10: string;

  Update: boolean = false;

  ClientesRiesgosColumns: string[] = ['Area', 'Riesgo', 'Impacto', 'Probabilidad', 'Evaluacion'];
  ClientesRiesgos: MatTableDataSource<any>;
  RiesgosColumns: string[] = ['SitioInteres', 'Riesgo', 'Impacto', 'Probabilidad', 'Evaluacion'];
  TablaRiesgos: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<DialogEncuesta>, 
              @Inject(MAT_DIALOG_DATA) public data: any, 
              public http: HttpClient, 
              private snackBar: MatSnackBar,
              private Permiso: ValidarPermisoService,
              private excelService:ExcelService,) {
      this.Id   = data.Id;
      this.Tipo = data.Tipo;

      this.ObtenerServicio = new ServicioService(http);
      this.Update = Permiso.ValidarPermiso('modificar encuestas');
      this.ClientesRiesgos = new MatTableDataSource([]);
      this.TablaRiesgos = new MatTableDataSource([]);
  }
  ngOnInit() {
    this.ClientesRiesgos.paginator = this.paginator;
    this.ClientesRiesgos.sort = this.sort;
    this.TablaRiesgos.paginator = this.paginator;
    this.TablaRiesgos.sort = this.sort;
    this.TraerInformacion();
  }
  exportAsXLSX1():void {
    this.excelService.exportAsExcelFile(this.ClientesRiesgos.data, 'Evaluacion');
  }
  exportAsXLSX2():void {
    this.excelService.exportAsExcelFile(this.TablaRiesgos.data, 'Evaluacion');
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ClientesRiesgos.filter = filterValue.trim().toLowerCase();

    if (this.ClientesRiesgos.paginator) {
      this.ClientesRiesgos.paginator.firstPage();
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  TraerInformacion(){
    this.Riesgos = [];
    this.AreasRiesgos = [];
    this.ClientesRiesgos.data = [];
    this.TablaRiesgos.data = [];
    let tipo;
    if(this.Tipo == 'Cliente'){
      tipo = 2;
    }
    else{
      tipo = 1;
    }

    this.Progressbar= true;
    this.ObtenerServicio.PostRequest('Seleccionar/CartesianoD', 'APIREST', {
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
            let Puntos = [];
            Resultado.Riesgos.forEach((element, index) => {              
              let Descripcion: string;
              Descripcion = "Impacto: "+element.Impacto+" Probabilidad: "+element.Probabilidad;
              let Formula: number;
              let Evaluacion: string;
              Formula = Math.round(((+element.Impacto+ +element.Probabilidad)/2)); 
              if(Formula == 1 || Formula == 2){Evaluacion = "No significativo"}
              if(Formula == 3 || Formula == 4){Evaluacion = "Menor"}
              if(Formula == 5 || Formula == 6){Evaluacion = "Crítico"}
              if(Formula == 7 || Formula == 8){Evaluacion = "Mayor"}
              if(Formula == 9 || Formula == 10){Evaluacion = "Catastrófico"}
              this.Riesgos.push({
                Tipo: 1,
                Id:           element.IdRespuestas,
                Riesgo:       element.Riesgo,
                Descripcion:  Descripcion,
                Impacto:      element.Impacto,
                Probabilidad: element.Probabilidad,
                Resultado: Evaluacion
              });
              Puntos[index] = element.IdRespuestas;              
              this.Riesgo = Puntos;
            });     
            this.ArmarTabla(Resultado, tipo);
          }
          else{
            this.Inspector = Resultado.Inspector;
            this.Folio     = Resultado.Folio;
            this.Cliente   = Resultado.Cliente;
            this.Fecha     = Resultado.Fecha;
            this.Areas     = Resultado.Areas;
            
            let Puntos = [];
            Resultado.Areas.forEach(element => {
              let NombreArea: string = element.NombreArea;
              let Area: string = element.Area;
              let riesgos: Riesgos[] = []; 
              //let Titulo: string = NombreArea+" ("+Area+")";
              let Titulo: string = NombreArea;
              element.Riesgos.forEach((item, index) => {
                let Formula: number;
                let Evaluacion: string;
                Formula = Math.round(((+item.Impacto+ +item.Probabilidad)/2)); 
                if(Formula == 1 || Formula == 2){Evaluacion = "No significativo"}
                if(Formula == 3 || Formula == 4){Evaluacion = "Menor"}
                if(Formula == 5 || Formula == 6){Evaluacion = "Crítico"}
                if(Formula == 7 || Formula == 8){Evaluacion = "Mayor"}
                if(Formula == 9 || Formula == 10){Evaluacion = "Catastrófico"}
                riesgos.push({
                  Tipo: 2,
                  Id:           item.IdRespuestas, 
                  Riesgo:       item.Riesgo, 
                  Descripcion:  "Impacto: "+item.Impacto+" Probabilidad: "+item.Probabilidad,
                  Impacto:      item.Impacto,
                  Probabilidad: item.Probabilidad,
                  Resultado: Evaluacion
                });
                Puntos[item.IdRespuestas] = item.IdRespuestas;                           
              });              
              this.AreasRiesgos.push({Area: Titulo, Riesgos: riesgos}); 
              this.Area = Puntos;
              this.ArmarTabla(Resultado, tipo);
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
  ArmarTabla(Resultado: any, tipo) {
    console.log("Tabla: ",Resultado);
    this.TablaRiesgos.data = [];
    if(tipo == 1){
      Resultado.Riesgos.forEach(riesgo => {
        let Formula: number;
        let Evaluacion: string;
        Formula = Math.round(((+riesgo.Impacto+ +riesgo.Probabilidad)/2)); 
        if(Formula == 1 || Formula == 2){Evaluacion = "No significativo"}
        if(Formula == 3 || Formula == 4){Evaluacion = "Menor"}
        if(Formula == 5 || Formula == 6){Evaluacion = "Crítico"}
        if(Formula == 7 || Formula == 8){Evaluacion = "Mayor"}
        if(Formula == 9 || Formula == 10){Evaluacion = "Catastrófico"}
        this.TablaRiesgos.data.push({
          SitioInteres: Resultado.SitioInteres,
          Inspector:    Resultado.Inspector,
          Fecha:        Resultado.Fecha,          
          Id:           riesgo.IdRespuestas,
          Riesgo:       riesgo.Riesgo,
          Impacto:      riesgo.Impacto,
          Probabilidad: riesgo.Probabilidad,
          Evaluacion:   Evaluacion
        });
      });
      this.TablaRiesgos.filter = "";
      this.TablaRiesgos.paginator = this.paginator;
    }
    else{
      Resultado.Areas.forEach(area => {
        area.Riesgos.forEach(riesgo => {
          let Formula: number;
          let Evaluacion: string;
          Formula = Math.round(((+riesgo.Impacto+ +riesgo.Probabilidad)/2)); 
          if(Formula == 1 || Formula == 2){Evaluacion = "No significativo"}
          if(Formula == 3 || Formula == 4){Evaluacion = "Menor"}
          if(Formula == 5 || Formula == 6){Evaluacion = "Crítico"}
          if(Formula == 7 || Formula == 8){Evaluacion = "Mayor"}
          if(Formula == 9 || Formula == 10){Evaluacion = "Catastrófico"}
          this.ClientesRiesgos.data.push({
            Cliente:      Resultado.Cliente,
            Inspector:    Resultado.Inspector,
            Fecha:        Resultado.Fecha,
            AliasArea:    area.Area,
            Area:         area.NombreArea,
            Id:           riesgo.IdRespuestas,
            Riesgo:       riesgo.Riesgo,
            Impacto:      riesgo.Impacto,
            Probabilidad: riesgo.Probabilidad,
            Evaluacion:   Evaluacion
          });
        });
        this.ClientesRiesgos.filter = "";
        this.ClientesRiesgos.paginator = this.paginator;
      });      
    }
  }
  BuscarArea(event){
    this.LimpiarPuntos();
    event.forEach(elemento => {
      this.AreasRiesgos.forEach(element => {
        let Area = element.Area;
        element.Riesgos.forEach(item => {
          elemento == item.Id ? this.MostrarPunto(item.Impacto, item.Probabilidad, item.Riesgo, Area): null;
        });
      });
    });
    // area = this.Areas.find(element => element.IdArea == event);        
    
    // this.Riesgos = area.Riesgos;
  }
  BuscarRiesgo(event){    
    this.LimpiarPuntos();
    event.forEach(element => {
      this.Riesgos.forEach(item => {
        element == item.Id ? this.MostrarPunto(item.Impacto, item.Probabilidad, item.Riesgo): null;
      });
    });
    
  }
  private LimpiarPuntos(){
    this.C1_1 = false;
    this.C1_2 = false;
    this.C1_3 = false;
    this.C1_4 = false;
    this.C1_5 = false;
    this.C1_6 = false;
    this.C1_7 = false;
    this.C1_8 = false;
    this.C1_9 = false;
    this.C1_10 = false;

    this.C2_1 = false;
    this.C2_2 = false;
    this.C2_3 = false;
    this.C2_4 = false;
    this.C2_5 = false;
    this.C2_6 = false;
    this.C2_7 = false;
    this.C2_8 = false;
    this.C2_9 = false;
    this.C2_10 = false;

    this.C3_1 = false;
    this.C3_2 = false;
    this.C3_3 = false;
    this.C3_4 = false;
    this.C3_5 = false;
    this.C3_6 = false;
    this.C3_7 = false;
    this.C3_8 = false;
    this.C3_9 = false;
    this.C3_10 = false;

    this.C4_1 = false;
    this.C4_2 = false;
    this.C4_3 = false;
    this.C4_4 = false;
    this.C4_5 = false;
    this.C4_6 = false;
    this.C4_7 = false;
    this.C4_8 = false;
    this.C4_9 = false;
    this.C4_10 = false;

    this.C5_1 = false;
    this.C5_2 = false;
    this.C5_3 = false;
    this.C5_4 = false;
    this.C5_5 = false;
    this.C5_6 = false;
    this.C5_7 = false;
    this.C5_8 = false;
    this.C5_9 = false;
    this.C5_10 = false;

    this.C6_1 = false;
    this.C6_2 = false;
    this.C6_3 = false;
    this.C6_4 = false;
    this.C6_5 = false;
    this.C6_6 = false;
    this.C6_7 = false;
    this.C6_8 = false;
    this.C6_9 = false;
    this.C6_10 = false;
    
    this.C7_1 = false;
    this.C7_2 = false;
    this.C7_3 = false;
    this.C7_4 = false;
    this.C7_5 = false;
    this.C7_6 = false;
    this.C7_7 = false;
    this.C7_8 = false;
    this.C7_9 = false;
    this.C7_10 = false;

    this.C8_1 = false;
    this.C8_2 = false;
    this.C8_3 = false;
    this.C8_4 = false;
    this.C8_5 = false;
    this.C8_6 = false;
    this.C8_7 = false;
    this.C8_8 = false;
    this.C8_9 = false;
    this.C8_10 = false;

    this.C9_1 = false;
    this.C9_2 = false;
    this.C9_3 = false;
    this.C9_4 = false;
    this.C9_5 = false;
    this.C9_6 = false;
    this.C9_7 = false;
    this.C9_8 = false;
    this.C9_9 = false;
    this.C9_10 = false;

    this.C10_1 = false;
    this.C10_2 = false;
    this.C10_3 = false;
    this.C10_4 = false;
    this.C10_5 = false;
    this.C10_6 = false;
    this.C10_7 = false;
    this.C10_8 = false;
    this.C10_9 = false;
    this.C10_10 = false;
  }
  private MostrarPunto(Impacto: number, Probabilidad: number, Riesgo: string, Area: string = ""){
    let Formula: number;
    Formula = Math.round(((+Impacto+ +Probabilidad)/2));    
    let tooltip;
    switch (Formula) {
      case 1:
        if(Area != ""){
          tooltip = Area+", "+Riesgo+" - No significativo";
        }
        else{
          tooltip = Riesgo+" - No significativo";
        }
        break;
      case 2:
          if(Area != ""){
            tooltip = Area+", "+Riesgo+" - No significativo";
          }
          else{
            tooltip = Riesgo+" - No significativo";
          }
          break;
      case 3:          
          if(Area != ""){
            tooltip = Area+", "+Riesgo+" - Menor";
          }
          else{
            tooltip = Riesgo+" - Menor";
          }
          break;
      case 4:
          if(Area != ""){
            tooltip = Area+", "+Riesgo+" - Menor";
          }
          else{
            tooltip = Riesgo+" - Menor";
          }
          break;
      case 5:          
          if(Area != ""){
            tooltip = Area+", "+Riesgo+" - Crítico";
          }
          else{
            tooltip = Riesgo+" - Crítico";
          }
          break;
      case 6:
          if(Area != ""){
            tooltip = Area+", "+Riesgo+" - Crítico";
          }
          else{
            tooltip = Riesgo+" - Crítico";
          }
          break;
      case 7:          
          if(Area != ""){
            tooltip = Area+", "+Riesgo+" - Mayor";
          }
          else{
            tooltip = Riesgo+" - Mayor";
          }
          break;
      case 8:
          if(Area != ""){
            tooltip = Area+", "+Riesgo+" - Mayor";
          }
          else{
            tooltip = Riesgo+" - Mayor";
          }
          break;
      case 9:          
          if(Area != ""){
            tooltip = Area+", "+Riesgo+" - Catastrófico";
          }
          else{
            tooltip = Riesgo+" - Catastrófico";
          }
          break;
      case 10:
        if(Area != ""){
          tooltip = Area+", "+Riesgo+" - Catastrófico";
        }
        else{
          tooltip = Riesgo+" - Catastrófico";
        }
          break;
      default:
        tooltip = Area+" "+Riesgo+" - No evaluado";
        break;
    }
    if(Impacto == 1 && Probabilidad == 1){this.C1_1 = true; this.ToolTipC1_1 = tooltip;}
    if(Impacto == 1 && Probabilidad == 2){this.C1_2 = true; this.ToolTipC1_2 = tooltip;}
    if(Impacto == 1 && Probabilidad == 3){this.C1_3 = true; this.ToolTipC1_3 = tooltip;}
    if(Impacto == 1 && Probabilidad == 4){this.C1_4 = true; this.ToolTipC1_4 = tooltip;}
    if(Impacto == 1 && Probabilidad == 5){this.C1_5 = true; this.ToolTipC1_5 = tooltip;}
    if(Impacto == 1 && Probabilidad == 6){this.C1_6 = true; this.ToolTipC1_6 = tooltip;}
    if(Impacto == 1 && Probabilidad == 7){this.C1_7 = true; this.ToolTipC1_7 = tooltip;}
    if(Impacto == 1 && Probabilidad == 8){this.C1_8 = true; this.ToolTipC1_8 = tooltip;}
    if(Impacto == 1 && Probabilidad == 9){this.C1_9 = true; this.ToolTipC1_9 = tooltip;}
    if(Impacto == 1 && Probabilidad == 10){this.C1_10 = true; this.ToolTipC1_10 = tooltip;}

    if(Impacto == 2 && Probabilidad == 1){this.C2_1 = true; this.ToolTipC2_1 = tooltip;}
    if(Impacto == 2 && Probabilidad == 2){this.C2_2 = true; this.ToolTipC2_2 = tooltip;}
    if(Impacto == 2 && Probabilidad == 3){this.C2_3 = true; this.ToolTipC2_3 = tooltip;}
    if(Impacto == 2 && Probabilidad == 4){this.C2_4 = true; this.ToolTipC2_4 = tooltip;}
    if(Impacto == 2 && Probabilidad == 5){this.C2_5 = true; this.ToolTipC2_5 = tooltip;}
    if(Impacto == 2 && Probabilidad == 6){this.C2_6 = true; this.ToolTipC2_6 = tooltip;}
    if(Impacto == 2 && Probabilidad == 7){this.C2_7 = true; this.ToolTipC2_7 = tooltip;}
    if(Impacto == 2 && Probabilidad == 8){this.C2_8 = true; this.ToolTipC2_8 = tooltip;}
    if(Impacto == 2 && Probabilidad == 9){this.C2_9 = true; this.ToolTipC2_9 = tooltip;}
    if(Impacto == 2 && Probabilidad == 10){this.C2_10 = true; this.ToolTipC2_10 = tooltip;}
    
    if(Impacto == 3 && Probabilidad == 1){this.C3_1 = true; this.ToolTipC3_1 = tooltip;}
    if(Impacto == 3 && Probabilidad == 2){this.C3_2 = true; this.ToolTipC3_2 = tooltip;}
    if(Impacto == 3 && Probabilidad == 3){this.C3_3 = true; this.ToolTipC3_3 = tooltip;}
    if(Impacto == 3 && Probabilidad == 4){this.C3_4 = true; this.ToolTipC3_4 = tooltip;}
    if(Impacto == 3 && Probabilidad == 5){this.C3_5 = true; this.ToolTipC3_5 = tooltip;}
    if(Impacto == 3 && Probabilidad == 6){this.C3_6 = true; this.ToolTipC3_6 = tooltip;}
    if(Impacto == 3 && Probabilidad == 7){this.C3_7 = true; this.ToolTipC3_7 = tooltip;}
    if(Impacto == 3 && Probabilidad == 8){this.C3_8 = true; this.ToolTipC3_8 = tooltip;}
    if(Impacto == 3 && Probabilidad == 9){this.C3_9 = true; this.ToolTipC3_9 = tooltip;}
    if(Impacto == 3 && Probabilidad == 10){this.C3_10 = true; this.ToolTipC3_10 = tooltip;}

    if(Impacto == 4 && Probabilidad == 1){this.C4_1 = true; this.ToolTipC4_1 = tooltip;}
    if(Impacto == 4 && Probabilidad == 2){this.C4_2 = true; this.ToolTipC4_2 = tooltip;}
    if(Impacto == 4 && Probabilidad == 3){this.C4_3 = true; this.ToolTipC4_3 = tooltip;}
    if(Impacto == 4 && Probabilidad == 4){this.C4_4 = true; this.ToolTipC4_4 = tooltip;}
    if(Impacto == 4 && Probabilidad == 5){this.C4_5 = true; this.ToolTipC4_5 = tooltip;}
    if(Impacto == 4 && Probabilidad == 6){this.C4_6 = true; this.ToolTipC4_6 = tooltip;}
    if(Impacto == 4 && Probabilidad == 7){this.C4_7 = true; this.ToolTipC4_7 = tooltip;}
    if(Impacto == 4 && Probabilidad == 8){this.C4_8 = true; this.ToolTipC4_8 = tooltip;}
    if(Impacto == 4 && Probabilidad == 9){this.C4_9 = true; this.ToolTipC4_9 = tooltip;}
    if(Impacto == 4 && Probabilidad == 10){this.C4_10 = true; this.ToolTipC4_10 = tooltip;}

    if(Impacto == 5 && Probabilidad == 1){this.C5_1 = true; this.ToolTipC5_1 = tooltip;}
    if(Impacto == 5 && Probabilidad == 2){this.C5_2 = true; this.ToolTipC5_2 = tooltip;}
    if(Impacto == 5 && Probabilidad == 3){this.C5_3 = true; this.ToolTipC5_3 = tooltip;}
    if(Impacto == 5 && Probabilidad == 4){this.C5_4 = true; this.ToolTipC5_4 = tooltip;}
    if(Impacto == 5 && Probabilidad == 5){this.C5_5 = true; this.ToolTipC5_5 = tooltip;}
    if(Impacto == 5 && Probabilidad == 6){this.C5_6 = true; this.ToolTipC5_6 = tooltip;}
    if(Impacto == 5 && Probabilidad == 7){this.C5_7 = true; this.ToolTipC5_7 = tooltip;}
    if(Impacto == 5 && Probabilidad == 8){this.C5_8 = true; this.ToolTipC5_8 = tooltip;}
    if(Impacto == 5 && Probabilidad == 9){this.C5_9 = true; this.ToolTipC5_9 = tooltip;}
    if(Impacto == 5 && Probabilidad == 10){this.C5_10 = true; this.ToolTipC5_10 = tooltip;}

    if(Impacto == 6 && Probabilidad == 1){this.C6_1 = true; this.ToolTipC6_1 = tooltip;}
    if(Impacto == 6 && Probabilidad == 2){this.C6_2 = true; this.ToolTipC6_2 = tooltip;}
    if(Impacto == 6 && Probabilidad == 3){this.C6_3 = true; this.ToolTipC6_3 = tooltip;}
    if(Impacto == 6 && Probabilidad == 4){this.C6_4 = true; this.ToolTipC6_4 = tooltip;}
    if(Impacto == 6 && Probabilidad == 5){this.C6_5 = true; this.ToolTipC6_5 = tooltip;}
    if(Impacto == 6 && Probabilidad == 6){this.C6_6 = true; this.ToolTipC6_6 = tooltip;}
    if(Impacto == 6 && Probabilidad == 7){this.C6_7 = true; this.ToolTipC6_7 = tooltip;}
    if(Impacto == 6 && Probabilidad == 8){this.C6_8 = true; this.ToolTipC6_8 = tooltip;}
    if(Impacto == 6 && Probabilidad == 9){this.C6_9 = true; this.ToolTipC6_9 = tooltip;}
    if(Impacto == 6 && Probabilidad == 10){this.C6_10 = true; this.ToolTipC6_10 = tooltip;}

    if(Impacto == 7 && Probabilidad == 1){this.C7_1 = true; this.ToolTipC7_1 = tooltip;}
    if(Impacto == 7 && Probabilidad == 2){this.C7_2 = true; this.ToolTipC7_2 = tooltip;}
    if(Impacto == 7 && Probabilidad == 3){this.C7_3 = true; this.ToolTipC7_3 = tooltip;}
    if(Impacto == 7 && Probabilidad == 4){this.C7_4 = true; this.ToolTipC7_4 = tooltip;}
    if(Impacto == 7 && Probabilidad == 5){this.C7_5 = true; this.ToolTipC7_5 = tooltip;}
    if(Impacto == 7 && Probabilidad == 6){this.C7_6 = true; this.ToolTipC7_6 = tooltip;}
    if(Impacto == 7 && Probabilidad == 7){this.C7_7 = true; this.ToolTipC7_7 = tooltip;}
    if(Impacto == 7 && Probabilidad == 8){this.C7_8 = true; this.ToolTipC7_8 = tooltip;}
    if(Impacto == 7 && Probabilidad == 9){this.C7_9 = true; this.ToolTipC7_9 = tooltip;}
    if(Impacto == 7 && Probabilidad == 10){this.C7_10 = true; this.ToolTipC7_10 = tooltip;}

    if(Impacto == 8 && Probabilidad == 1){this.C8_1 = true; this.ToolTipC8_1 = tooltip;}
    if(Impacto == 8 && Probabilidad == 2){this.C8_2 = true; this.ToolTipC8_2 = tooltip;}
    if(Impacto == 8 && Probabilidad == 3){this.C8_3 = true; this.ToolTipC8_3 = tooltip;}
    if(Impacto == 8 && Probabilidad == 4){this.C8_4 = true; this.ToolTipC8_4 = tooltip;}
    if(Impacto == 8 && Probabilidad == 5){this.C8_5 = true; this.ToolTipC8_5 = tooltip;}
    if(Impacto == 8 && Probabilidad == 6){this.C8_6 = true; this.ToolTipC8_6 = tooltip;}
    if(Impacto == 8 && Probabilidad == 7){this.C8_7 = true; this.ToolTipC8_7 = tooltip;}
    if(Impacto == 8 && Probabilidad == 8){this.C8_8 = true; this.ToolTipC8_8 = tooltip;}
    if(Impacto == 8 && Probabilidad == 9){this.C8_9 = true; this.ToolTipC8_9 = tooltip;}
    if(Impacto == 8 && Probabilidad == 10){this.C8_10 = true; this.ToolTipC8_10 = tooltip;}

    if(Impacto == 9 && Probabilidad == 1){this.C9_1 = true; this.ToolTipC9_1 = tooltip;}
    if(Impacto == 9 && Probabilidad == 2){this.C9_2 = true; this.ToolTipC9_2 = tooltip;}
    if(Impacto == 9 && Probabilidad == 3){this.C9_3 = true; this.ToolTipC9_3 = tooltip;}
    if(Impacto == 9 && Probabilidad == 4){this.C9_4 = true; this.ToolTipC9_4 = tooltip;}
    if(Impacto == 9 && Probabilidad == 5){this.C9_5 = true; this.ToolTipC9_5 = tooltip;}
    if(Impacto == 9 && Probabilidad == 6){this.C9_6 = true; this.ToolTipC9_6 = tooltip;}
    if(Impacto == 9 && Probabilidad == 7){this.C9_7 = true; this.ToolTipC9_7 = tooltip;}
    if(Impacto == 9 && Probabilidad == 8){this.C9_8 = true; this.ToolTipC9_8 = tooltip;}
    if(Impacto == 9 && Probabilidad == 9){this.C9_9 = true; this.ToolTipC9_9 = tooltip;}
    if(Impacto == 9 && Probabilidad == 10){this.C9_10 = true; this.ToolTipC9_10 = tooltip;}

    if(Impacto == 10 && Probabilidad == 1){this.C10_1 = true; this.ToolTipC10_1 = tooltip;}
    if(Impacto == 10 && Probabilidad == 2){this.C10_2 = true; this.ToolTipC10_2 = tooltip;}
    if(Impacto == 10 && Probabilidad == 3){this.C10_3 = true; this.ToolTipC10_3 = tooltip;}
    if(Impacto == 10 && Probabilidad == 4){this.C10_4 = true; this.ToolTipC10_4 = tooltip;}
    if(Impacto == 10 && Probabilidad == 5){this.C10_5 = true; this.ToolTipC10_5 = tooltip;}
    if(Impacto == 10 && Probabilidad == 6){this.C10_6 = true; this.ToolTipC10_6 = tooltip;}
    if(Impacto == 10 && Probabilidad == 7){this.C10_7 = true; this.ToolTipC10_7 = tooltip;}
    if(Impacto == 10 && Probabilidad == 8){this.C10_8 = true; this.ToolTipC10_8 = tooltip;}
    if(Impacto == 10 && Probabilidad == 9){this.C10_9 = true; this.ToolTipC10_9 = tooltip;}
    if(Impacto == 10 && Probabilidad == 10){this.C10_10 = true; this.ToolTipC10_10 = tooltip;} 
  }
  EditarRiesgo(Riesgo){
    const dialogRef = this.dialog.open(DialogModificarRiesgo, {
      maxWidth: '600px',
      minWidth: '200px',
      data:{
        Riesgo: Riesgo
      },    
    });

    dialogRef.afterClosed().subscribe(result => {
      this.TraerInformacion();
    });
  }
  AtencionInmediata(){
    this.Inmediata = true;
    this.Periodica = false;
    this.Seguimiento = false;
    this.Controlada = false;
  }
  AtencionPeriodica(){
    this.Inmediata = false;
    this.Periodica = true;
    this.Seguimiento = false;
    this.Controlada = false;
  }
  AtencionSeguimiento(){
    this.Inmediata = false;
    this.Periodica = false;
    this.Seguimiento = true;
    this.Controlada = false;
  }
  AtencionControlada(){
    this.Inmediata = false;
    this.Periodica = false;
    this.Seguimiento = false;
    this.Controlada = true;
  }
  AtencionTodos(){
    this.Inmediata = true;
    this.Periodica = true;
    this.Seguimiento = true;
    this.Controlada = true;
  }
}
@Component({
  selector: 'dialog-modificar-riesgo',
  templateUrl: 'dialog-modificar-riesgo.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogModificarRiesgo {
  Id: number;
  Tipo: number;
  Impacto: number;
  Probabilidad: number
  Riesgo: string;
  // sesión
  IdUsuario = JSON.parse(sessionStorage['SessionCob']).IdUsuario;
  ObtenerServicio: any;
  constructor(public dialogRef: MatDialogRef<DialogModificarRiesgo>, 
              @Inject(MAT_DIALOG_DATA) public data: any, 
              public http: HttpClient, 
              private snackBar: MatSnackBar,) {
    this.Id   = data.Riesgo.Id;
    this.Tipo = data.Riesgo.Tipo;
    this.Impacto = data.Riesgo.Impacto;
    this.Probabilidad = data.Riesgo.Probabilidad;
    this.Riesgo = data.Riesgo.Riesgo;
    this.ObtenerServicio = new ServicioService(http);
    if(this.Id == null){
      this.Id = this.data.IdRespuestas;
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  Guardar(){    
    if((this.Impacto > 0 || this.Impacto < 11) && (this.Probabilidad > 0 || this.Probabilidad < 11)){
      let Parametros = [{
        IdRespuestas: this.Id,
        Impacto:      this.Impacto, 
        Probabilidad: this.Probabilidad
      }];
      let tipo;
      if(this.Tipo != 1){
        tipo = 2;
      }
      else{
        tipo = 1
      }
      this.ObtenerServicio.PostRequest('Modificar/Resultados', 'APIREST', {      
        Tipo:      tipo,
        Datos:     JSON.stringify(Parametros),
        IdUsuario: this.IdUsuario
      })
      .subscribe((response)=>{
        console.log(response);
        this.onNoClick();
      }, 
      error => {      
        this.snackBar.open('Error de conexión','',{
          duration: 2000,
          
        });
      });
    }
    else{
      this.snackBar.open('El rango es de 1 a 10','',{
        duration: 2000
      });
    }
  }
  ValidarImpacto(){
    if(this.Impacto < 1 || this.Impacto > 10){
      this.Impacto = null;
      this.snackBar.open('El rango es de 1 a 10','',{
        duration: 2000
      });
    }
  }
  ValidarProbabilidad(){
    if(this.Probabilidad < 1 || this.Probabilidad > 10){
      this.Probabilidad = null;
      this.snackBar.open('El rango es de 1 a 10','',{
        duration: 2000
      });
    }
  }  
}