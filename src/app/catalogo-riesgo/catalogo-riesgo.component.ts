import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ThemePalette} from '@angular/material/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ValidarNavbarService } from '../Observables/validar-navbar.service';
import readXlsxFile from 'read-excel-file';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ExcelService} from '../servicios/excel-service.service';
import { ServicioService } from '../servicios/servicio.service';
import { ThrowStmt } from '@angular/compiler';
import { NodeCompatibleEventEmitter } from 'rxjs/internal/observable/fromEvent';
export interface EstructuraCatalogo{
  Id:            number;
  Identificador: string;
  Nombre:        string;  
  Criterio:      string;
  Dimension:     string;
  TipoRiesgo:    string;
  Usuario:       string;
  FechaCreacion: string;
  FechaModificacion: string;
  Estatus:       boolean;
}
@Component({
  selector: 'app-catalogo-riesgo',
  templateUrl: './catalogo-riesgo.component.html',
  styleUrls: ['./catalogo-riesgo.component.scss']
})
export class CatalogoRiesgoComponent implements OnInit {
  // Servicio API
 ObtenerServicio: any;
 // sesión
 IdUsuario = JSON.parse(sessionStorage['SessionCob']).IdUsuario;
 displayedColumns: string[] = ['Nombre', 'Identificador', 'Criterio', 'Dimension', 'TipoRiesgo', 'Usuario', 'Fecha', 'Editar', 'Deshabilitar', 'Eliminar'];
 Tabla: MatTableDataSource<EstructuraCatalogo>;
 Catalogo: EstructuraCatalogo[] = [];
 @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
 @ViewChild(MatSort, {static: true}) sort: MatSort;

 constructor(public dialog: MatDialog, 
             private Menu: ValidarNavbarService, 
             private excelService:ExcelService, 
             private snackBar: MatSnackBar, 
             public http: HttpClient,) {
   this.ObtenerServicio = new ServicioService(http);
   this.Menu.OcultarProgress();
   this.Tabla = new MatTableDataSource(this.Catalogo);
 }
 exportAsXLSX():void {
   this.excelService.exportAsExcelFile(this.Catalogo, 'CatalogoRiesgos');
 }
 ngOnInit(): void {
   this.Tabla.paginator = this.paginator;
   this.Tabla.sort = this.sort;    
   this.TraerInformacion();
 }
 applyFilter(event: Event) {
   const filterValue = (event.target as HTMLInputElement).value;
   this.Tabla.filter = filterValue.trim().toLowerCase();
 }
 Deshabilitar(event, Id){
   let Accion: number;
   if(event.checked){
     Accion = 1;
   }
   else{
     Accion = 0;
   }
   this.Menu.MostrarProgress();
   this.ObtenerServicio.PostRequest('Modificar/RiskEstatus', 'APIREST', {Id: Id, Accion: Accion})
   .subscribe((response)=>{
     this.Menu.OcultarProgress();
     if(response.Success){
       if(response.Data == 1){
         this.snackBar.open('Registro guardado correctamente','',{
           duration: 3000,
           panelClass: ['mensaje-success']
         });
       }
       else{
         this.snackBar.open('Error al guardar el registro','',{
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
 Eliminar(Id){
   this.snackBar.open('¿Seguro de eliminar el registro?', 'Eliminar', {
     duration: 5000,
   }).onAction().subscribe(()=>{
     this.EliminarRegistro(Id);
   });
 }
 EliminarRegistro(Id){
   this.Menu.MostrarProgress();
   this.ObtenerServicio.PostRequest('Eliminar/Risk', 'APIREST', {Id: Id})
   .subscribe((response)=>{
     this.TraerInformacion();
     this.Menu.OcultarProgress();
     if(response.Success){
       if(response.Data == 1){
         this.snackBar.open('Registro eliminado correctamente','',{
           duration: 3000,
           panelClass: ['mensaje-success']
         });
       }
       else{
         this.snackBar.open('No ha sido eliminado el registro','',{
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
 DialogAgregar(){    
   const dialogRef = this.dialog.open(DialogRiesgo, {
     width: '50vw',
     data:  {Titulo: 'Agregar'}
   });
   dialogRef.afterClosed().subscribe(result => {
     this.TraerInformacion();
   });
 }
 DialogModificar(Id){
   const dialogRef = this.dialog.open(DialogRiesgo, {
     width: '50vw',
     data:  {Titulo: 'Modificar', Id: Id}
   });

   dialogRef.afterClosed().subscribe(result => {
      this.TraerInformacion();   
   });
 }
 DialogImportar(){
   const dialogRef = this.dialog.open(DialogImportarRiesgo, {
     width: '100vw',
     data:   {Titulo: 'Importar'}
   });

   dialogRef.afterClosed().subscribe(result => {
     this.TraerInformacion();
   });
 }
 TraerInformacion(){    
   this.Catalogo = [];
   this.Menu.MostrarProgress();
   this.ObtenerServicio.PostRequest('Seleccionar/Risk', 'APIREST', {
    IdUsuario: this.IdUsuario
   })
   .subscribe((response)=>{
     this.Menu.OcultarProgress();
     if(response.Success){
       if(response.Data){
         response.Data.forEach(element => {
           let Estatus: boolean;
           if(element.Estatus == 1){
             Estatus = true;
           }
           else{
             Estatus = false;
           }
           this.Catalogo.push({ 
            Id:                element.Id,
            Identificador:     element.IdRiesgo, 
            Nombre:            element.Nombre,
            TipoRiesgo:        element.TiposRiesgos,
            Dimension:         element.Dimension,
            Criterio:          element.CriteriosLegales,
            Usuario:           element.Usuario, 
            FechaCreacion:     element.FechaCreacion,
            FechaModificacion: element.FechaModificacion,
            Estatus: Estatus
          });
         });
         this.Tabla.data = this.Catalogo;
         this.Tabla.paginator = this.paginator;
         
       }   
     }
     else{   
       this.Menu.OcultarProgress();             
       this.snackBar.open('Error de conexión','',{
         duration: 3000
       });
     }
   }, 
   error => {   
    this.Menu.OcultarProgress();   
     this.snackBar.open('Error de conexión','',{
       duration: 3000,       
     })
   });        
 }
}
@Component({
 selector: 'dialog-catalogo-riesgo',
 templateUrl: 'dialog-catalogo-riesgo.html',
 styleUrls: ['./catalogo-riesgo.component.scss']
})
export class DialogRiesgo implements OnInit{
 // Servicio de api
 ObtenerServicio: any;
 // sesión
 IdUsuario = JSON.parse(sessionStorage['SessionCob']).IdUsuario;
 
 Nombre: string;
 Titulo: string;  
 Progressbar: boolean = false;
 Tipo: boolean = false;

 // Inputs
 Identificador: any;
 CriterioLegal: any;
 Dimension:     any;
 TipoRiesgo:    any;

 // Listados
 Criterioslegales: Array<string> = [];
 Dimensiones:      Array<string> = [];
 TiposRiesgos:     Array<string> = [];
 constructor(public dialogRef: MatDialogRef<DialogRiesgo>, @Inject(MAT_DIALOG_DATA) public data: any, public http: HttpClient, private snackBar: MatSnackBar,) {
     this.Titulo = data.Titulo;
     this.ObtenerServicio = new ServicioService(http);
 }
 ngOnInit(){
   this.Catalogos();
   if(this.data.Titulo == 'Modificar'){     
     this.Tipo = false;
   }
   else{
    this.Tipo = true;
   }
 }
 onNoClick(): void {
   this.dialogRef.close();
 }
 Agregar(){
   if(this.Nombre != '' && this.Nombre != undefined){
    if(this.Identificador != '' && this.Identificador != undefined){
      if(this.CriterioLegal > 0){
        if(this.Dimension > 0){
          if(this.TipoRiesgo > 0){
            this.Progressbar = true;
            this.ObtenerServicio.PostRequest('Insertar/Risk', 'APIREST', {
              Nombre:      this.Nombre, 
              IdRiesgo:    this.Identificador,
              IdDimension: this.Dimension,
              IdTRiesgo:   this.TipoRiesgo,
              IdCLegales:  this.CriterioLegal,
              IdUsuario:   this.IdUsuario})
            .subscribe((response)=>{   
              this.Progressbar = false;             
              if(response.Success){
                if(response.Data > 0){
                  this.snackBar.open('Registro guardado correctamente','',{
                    duration: 3000,
                    panelClass: ['mensaje-success']
                  });
                  this.Nombre        = '';
                  this.Identificador = '';
                  this.Dimension     = '';
                  this.TipoRiesgo    = '';
                  this.CriterioLegal = '';
                }
                else if(response.Data == 'Duplicado'){
                  this.snackBar.open('Ya existe un registro con el mismo nombre','',{
                    duration: 3000,
                    panelClass: ['mensaje-warning']
                  });
                }
                else{
                  this.snackBar.open('No ha sido creado el registro','',{
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
          else{
            this.snackBar.open('Es necesario seleccionar un tipo de riesgo','',{
              duration: 3000,
              panelClass: ['mensaje-warning']
            });
          }
        }
        else{
        this.snackBar.open('Es necesario seleccionar una dimensión','',{
          duration: 3000,
          panelClass: ['mensaje-warning']
        });
        }
     }
     else{
      this.snackBar.open('Es necesario seleccionar un criterio legal','',{
        duration: 3000,
        panelClass: ['mensaje-warning']
      });
     }
    }
    else{
      this.snackBar.open('Es necesario agregar el identificador','',{
        duration: 3000,
        panelClass: ['mensaje-warning']
      });
    }          
   }
   else{
     this.snackBar.open('Es necesario agregar el nombre del catálogo','',{
       duration: 3000,
       panelClass: ['mensaje-warning']
     });
   }
 }
 Detalle(){
  this.Progressbar = true;
  this.ObtenerServicio.PostRequest('Seleccionar/RiskD', 'APIREST', {Id: this.data.Id})
  .subscribe((response)=>{   
    this.Progressbar = false;             
    if(response.Success){
      if(response.Data){
        let Resultado      = response.Data[0];
        this.Nombre        = Resultado.Nombre;
        this.Identificador = Resultado.IdRiesgo;
        this.CriterioLegal = Resultado.IdCriteriosLegales;
        this.Dimension     = Resultado.IdDimension;
        this.TipoRiesgo    = Resultado.IdTiposRiesgos;
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
 Catalogos(){
  this.Progressbar = true;
  this.ObtenerServicio.PostRequest('Seleccionar/CatalogosR', 'APIREST', {})
  .subscribe((response)=>{         
    this.Progressbar = false;
    if(response.Success){
      if(response.Data){
        let Resultado = response.Data;
        this.Criterioslegales = Resultado.CriteriosLegales;
        this.Dimensiones      = Resultado.Dimensiones;
        this.TiposRiesgos     = Resultado.TiposRiesgos;
        if(this.data.Titulo == 'Modificar'){
          this.Detalle();          
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
 Modificar(){
  if(this.Nombre != '' && this.Nombre != undefined){
    this.Progressbar = true;
    this.ObtenerServicio.PostRequest('Modificar/Risk', 'APIREST', {
      Id:          this.data.Id, 
      Nombre:      this.Nombre, 
      IdRiesgo:    this.Identificador,
      IdDimension: this.Dimension,
      IdTRiesgo:   this.TipoRiesgo,
      IdCLegales:  this.CriterioLegal,
      IdUsuario:   this.IdUsuario})
    .subscribe((response)=>{   
      this.Progressbar = false;             
      if(response.Success){
        if(response.Data > 0){
          this.snackBar.open('Registro guardado correctamente','',{
            duration: 3000,
            panelClass: ['mensaje-success']
          });
          this.onNoClick();
        }
        else if(response.Data == 'Duplicado'){
          this.snackBar.open('Ya existe un registro con el mismo nombre','',{
            duration: 3000,
            panelClass: ['mensaje-warning']
          });
        }
        else{
          this.snackBar.open('No ha sido creado el registro','',{
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
  else{
    this.snackBar.open('Es necesario agregar el nombre del catálogo','',{
      duration: 3000,
      panelClass: ['mensaje-warning']
    });
  }
 }
}
export interface ImportElement {
  Numero:        number;
  Nombre:        string;
  Identificador: string;
  Dimension:     string;
  TipoRiesgo:    string;
  Criterio:      string;
 }
@Component({
 selector: 'dialog-importar-catalogo-riesgo',
 templateUrl: 'dialog-importar-catalogo-riesgo.html',
 styleUrls: ['./catalogo-riesgo.component.scss']
})
export class DialogImportarRiesgo implements OnInit {
 // Servicio de api
 ObtenerServicio: any;
 // sesión
 IdUsuario = JSON.parse(sessionStorage['SessionCob']).IdUsuario;

 Progressbar: boolean = false;
 Titulo: string;
 Excel: any;

 displayedColumns: string[] = ['Numero', 'Nombre','Identificador', 'Dimension','TipoRiesgo', 'Criterio'];
 Tabla = new MatTableDataSource<ImportElement>();
 RegistrosTabla:ImportElement[] = []
 @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
 Catalogo = [{'Nombre': '', 'Identificador': '', 'Dimension': '', 'Tipo de riesgo': '', 'Criterio legal': ''}];
 constructor(public dialogRef: MatDialogRef<DialogRiesgo>,
             @Inject(MAT_DIALOG_DATA) public data: any, 
             public http: HttpClient, 
             private snackBar: MatSnackBar,
             private excelService:ExcelService) {
   this.Titulo = data.Titulo;
   this.Tabla = new MatTableDataSource(this.RegistrosTabla);
   this.ObtenerServicio = new ServicioService(http);
 } 
 exportAsXLSX():void {
  this.excelService.exportAsExcelFile(this.Catalogo, 'PantillaRiesgos');
  }
 ngOnInit() {
   this.Tabla.paginator = this.paginator;

   this.Excel = (<HTMLInputElement>document.getElementById('Excel'));
   const schema = {
     'Nombre': {
       prop: 'Nombre',
       type: String,
       required: true
     },
     'Identificador': {
      prop: 'Identificador',
      type: String,
      required: true
    },
    'Dimension': {
      prop: 'Dimension',
      type: String,
      required: true
    },
    'Tipo de riesgo': {
      prop: 'TipoRiesgo',
      type: String,
      required: true
    },
    'Criterio legal': {
      prop: 'Criterio',
      type: String,
      required: true
    },
   }
   this.Excel.addEventListener('change', () => {  
     this.RegistrosTabla = [];    
     readXlsxFile(this.Excel.files[0], { schema }).then(({ rows, errors }) => {
       // `errors` have shape `{ row, column, error, value }`.
       // errors.length === 0
       if(rows.length > 0){          
         rows.forEach((element, index) => {                        
           this.RegistrosTabla.push({
             Numero:        index+1, 
             Nombre:        element.Nombre,
             Identificador: element.Identificador,
             Dimension:     element.Dimension,
             TipoRiesgo:    element.TipoRiesgo,
             Criterio:      element.Criterio,
            });            
         });          
       }
       this.Tabla.data = this.RegistrosTabla;
       this.Tabla.paginator = this.paginator;
     });           
   })
 }
 onNoClick(): void {
   this.dialogRef.close();
 }
 Importar(){
   this.Progressbar = true;
   let Registros = [];
   this.RegistrosTabla.forEach(element => {
    
    Registros.push({
      "IdRiesgo":      element.Identificador,
      "Nombre":        element.Nombre,
      "Dimension":     element.Dimension,
      "TipoRiesgo":    element.TipoRiesgo,
      "CriterioLegal": element.Criterio,
      "Area":          ''
    });
   });
     this.ObtenerServicio.PostRequest('Importar/Risk', 'APIREST', {
       Datos: JSON.stringify(Registros), 
       IdUsuario: this.IdUsuario
      })
     .subscribe((response)=>{   
       this.Progressbar = false;             
       if(response.Success){
         if(response.Data){
           if(response.Data.Dato){
             let Resultado: string = '';
             if(response.Data.Correctos.length > 0){
               let contador: number;
                response.Data.Correctos.forEach((element, index) => {
                  contador = index+1;
                });
                Resultado = Resultado+" Insertados: "+contador;
             }
             else{
              Resultado = Resultado+" Insertados: 0";
             }
             if(response.Data.Duplicados.length > 0){
               let contador: number;
                response.Data.Duplicados.forEach((element, index) => {
                  contador = index+1;
                });
                Resultado = Resultado+" Duplicados: "+contador;
             }
             else{
              Resultado = Resultado+" Duplicados: 0";
             }
             if(response.Data.Errores.length > 0){
              let contador: number;
              response.Data.Errores.forEach((element, index) => {
                contador = index+1;
              });
              Resultado = Resultado+" Errores: "+contador;
              }
              else{
              Resultado = Resultado+" Errores: 0";
              }
              this.snackBar.open(Resultado,'',{
                duration: 6000,
              });
           }
           else if(response.Data.Dato == 'Duplicado'){
            this.snackBar.open('Ya existe un registro con el mismo nombre','',{
              duration: 3000,
              panelClass: ['mensaje-warning']
            });
           }
           else{
            this.snackBar.open('No ha sido creado el registro','',{
              duration: 3000,
              panelClass: ['mensaje-error']
            });
           }           
         }
         else if(response.Data == 'Duplicado'){
           this.snackBar.open('Ya existe un registro con el mismo nombre','',{
             duration: 3000,
             panelClass: ['mensaje-warning']
           });
         }
         else{
           this.snackBar.open('No ha sido creado el registro','',{
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
}