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
import { ValidarPermisoService } from '../servicios/validar-permiso.service';
export interface EstructuraCatalogo{
  Id:                number;  
  Nombre:            string;  
  RiesgoId:          string;
  RiesgoNombre:      string;
  SitioInteres:      string;
  Usuario:           string;
  FechaCreacion:     string;
  FechaModificacion: string;
  Estatus:           boolean;
}
@Component({
  selector: 'app-riesgos-puntosdeinteres',
  templateUrl: './riesgos-puntosdeinteres.component.html',
  styleUrls: ['./riesgos-puntosdeinteres.component.scss']
})
export class RiesgosPuntosdeinteresComponent implements OnInit {
  // Servicio API
  ObtenerServicio: any;
  // sesión
  IdUsuario = JSON.parse(sessionStorage['SessionCob']).IdUsuario;
  displayedColumns: string[] = ['Nombre', 'RiesgoId', 'RiesgoNombre', 'SitioInteres', 'Usuario', 'Fecha', 'Editar', 'Deshabilitar', 'Eliminar'];
  Tabla: MatTableDataSource<EstructuraCatalogo>;
  Catalogo: EstructuraCatalogo[] = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  //Permisos
  Create: boolean = false;
  Update: boolean = false;
  Delete: boolean = false;
  constructor(public dialog: MatDialog, 
              private Menu: ValidarNavbarService, 
              private excelService:ExcelService, 
              private snackBar: MatSnackBar, 
              public http: HttpClient,
              private Permiso: ValidarPermisoService) {
   this.ObtenerServicio = new ServicioService(http);
   this.Menu.OcultarProgress();
   this.Tabla = new MatTableDataSource(this.Catalogo);

   //Permisos   
   this.Create = Permiso.ValidarPermiso('crear riesgos');
   this.Update = Permiso.ValidarPermiso('editar riesgos');
   this.Delete = Permiso.ValidarPermiso('eliminar riesgos');
 }

  exportAsXLSX():void {
   this.excelService.exportAsExcelFile(this.Catalogo, 'EncuestaRiesgosPuntosdeInteres');
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
    this.ObtenerServicio.PostRequest('Modificar/RelacionRSIEstatus', 'APIREST', 
    {
      Id: Id, 
      Accion: Accion,
      IdUsuario: this.IdUsuario
    })
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
    this.ObtenerServicio.PostRequest('Eliminar/RelacionRSI', 'APIREST', 
    {
      Id: Id,
      IdUsuario: this.IdUsuario
    })
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
  TraerInformacion(){    
    this.Catalogo = [];
    this.Menu.MostrarProgress();
    this.ObtenerServicio.PostRequest('Seleccionar/RelacionRSI', 'APIREST', {
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
              Nombre:            element.Nombre,
              RiesgoId:          element.RiesgoId,
              RiesgoNombre:      element.RiesgoNombre,
              SitioInteres:      element.SitioInteres,
              Usuario:           element.Usuario, 
              FechaCreacion:     element.FechaCreacion,
              FechaModificacion: element.FechaModificacion,
              Estatus:           Estatus
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
  DialogAgregar(){
    const dialogRef = this.dialog.open(DialogRiesgosPuntosdeinteres, {
      width: '50vw',
      data:  {Titulo: 'Agregar'}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.TraerInformacion();
    });
  }
  DialogImportar(){
    const dialogRef = this.dialog.open(DialogImportarRiesgosPuntosdeinteres, {
      width: '100vw',
      data:   {Titulo: 'Importar'}
    });
 
    dialogRef.afterClosed().subscribe(result => {
      this.TraerInformacion();
    });
  }
  DialogModificar(Id){
    const dialogRef = this.dialog.open(DialogRiesgosPuntosdeinteres, {
      width: '50vw',
      data:  {Titulo: 'Modificar', Id: Id}
    });
 
    dialogRef.afterClosed().subscribe(result => {
       this.TraerInformacion();   
    });
  }
}
@Component({
  selector: 'dialog-encuesta-riesgos-puntosdeinteres',
  templateUrl: 'dialog-encuesta-riesgos-puntosdeinteres.html',
  styleUrls: ['./riesgos-puntosdeinteres.component.scss']
 })
 export class DialogRiesgosPuntosdeinteres implements OnInit{
  // Servicio de api
  ObtenerServicio: any;
  // sesión
  IdUsuario = JSON.parse(sessionStorage['SessionCob']).IdUsuario;

  Titulo:      string;
  Tipo:        boolean = false;
  Progressbar: boolean = false;

  // Inputs
  Nombre:       string;
  Riesgo:       any;
  PuntoInteres: any;

  // Listados
  Riesgos:       Array<string> = [];
  PuntosInteres: Array<string> = [];
  constructor(public dialogRef: MatDialogRef<DialogRiesgosPuntosdeinteres>, 
              @Inject(MAT_DIALOG_DATA) public data: any, 
              public http: HttpClient, 
              private snackBar: MatSnackBar,) {
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
  Catalogos(){
    this.Progressbar = true;
    this.ObtenerServicio.PostRequest('Seleccionar/CatalogosRSI', 'APIREST', 
    {
      Id: this.data.Id,
      IdUsuario: this.IdUsuario
    })
    .subscribe((response)=>{   
      this.Progressbar = false;             
      if(response.Success){
        if(response.Data){
          let Resultado = response.Data;
          this.Riesgos       = Resultado.Riesgos;
          this.PuntosInteres = Resultado.SitiosInteres;
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
  Detalle(){
    this.Progressbar = true;
    this.ObtenerServicio.PostRequest('Seleccionar/RelacionRSID', 'APIREST', 
    {
      Id: this.data.Id,
      IdUsuario: this.IdUsuario
    })
    .subscribe((response)=>{   
      this.Progressbar = false;             
      if(response.Success){
        if(response.Data){
          let Resultado      = response.Data[0];

          this.Nombre        = Resultado.Nombre;
          this.Riesgo        = Resultado.IdRisk;
          this.PuntoInteres = Resultado.IdSitesInterest;
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
  Agregar(){
    if(this.Nombre != '' && this.Nombre != undefined){     
      if(this.Riesgo > 0){
          if(this.PuntoInteres > 0){           
              this.Progressbar = true;
              this.ObtenerServicio.PostRequest('Insertar/RelacionRSI', 'APIREST', {
                Nombre:         this.Nombre,
                IdRiesgo:       this.Riesgo,
                IdSitioInteres: this.PuntoInteres,               
                IdUsuario:      this.IdUsuario
              })
              .subscribe((response)=>{   
                this.Progressbar = false;             
                if(response.Success){
                  if(response.Data > 0){
                    this.snackBar.open('Registro guardado correctamente','',{
                      duration: 3000,
                      panelClass: ['mensaje-success']
                    });
                    this.Nombre       = '';                    
                    this.Riesgo       = '';
                    this.PuntoInteres = '';                    
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
          this.snackBar.open('Es necesario seleccionar un punto de interés','',{
            duration: 3000,
            panelClass: ['mensaje-warning']
          });
          }
      }
      else{
        this.snackBar.open('Es necesario seleccionar un riesgo','',{
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
  Modificar(){
    if(this.Nombre != '' && this.Nombre != undefined){
      this.Progressbar = true;
      this.ObtenerServicio.PostRequest('Modificar/RelacionRSI', 'APIREST', {
        Id:             this.data.Id, 
        Nombre:         this.Nombre, 
        IdRiesgo:       this.Riesgo,
        IdSitioInteres: this.PuntoInteres,
        IdUsuario:      this.IdUsuario
      })
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
  Numero:       number;
  Nombre:       string;
  Riesgo:       string;
  SitioInteres: string;  
 }
@Component({
 selector: 'dialog-importar-encuesta-riesgo-puntosdeinteres',
 templateUrl: 'dialog-importar-encuesta-riesgo-puntosdeinteres.html',
 styleUrls: ['./riesgos-puntosdeinteres.component.scss']
})
export class DialogImportarRiesgosPuntosdeinteres implements OnInit {
 // Servicio de api
 ObtenerServicio: any;
 // sesión
 IdUsuario = JSON.parse(sessionStorage['SessionCob']).IdUsuario;

 Progressbar: boolean = false;
 Titulo: string;
 Excel: any;

 displayedColumns: string[] = ['Numero', 'Nombre','Riesgo', 'SitioInteres'];
 Tabla = new MatTableDataSource<ImportElement>();
 RegistrosTabla:ImportElement[] = []
 @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
 Catalogo = [{'Nombre': '', 'Riesgo': '', 'Punto de interes': ''}];
 constructor(public dialogRef: MatDialogRef<DialogImportarRiesgosPuntosdeinteres>,
             @Inject(MAT_DIALOG_DATA) public data: any, 
             public http: HttpClient, 
             private snackBar: MatSnackBar,
             private excelService:ExcelService) {
   this.Titulo = data.Titulo;
   this.Tabla = new MatTableDataSource(this.RegistrosTabla);
   this.ObtenerServicio = new ServicioService(http);
 } 
 exportAsXLSX():void {
  this.excelService.exportAsExcelFile(this.Catalogo, 'PlantillaRiesgosPuntosdeInteres');
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
    'Riesgo': {
      prop: 'Riesgo',
      type: String,
      required: true
    },
    'Punto de interes': {
      prop: 'SitioInteres',
      type: String,
      required: true
    }
   }
   this.Excel.addEventListener('change', () => {  
     this.RegistrosTabla = [];    
     readXlsxFile(this.Excel.files[0], { schema }).then(({ rows, errors }) => {
       // `errors` have shape `{ row, column, error, value }`.
       // errors.length === 0
       if(rows.length > 0){          
         rows.forEach((element, index) => {                        
           this.RegistrosTabla.push({
             Numero:       index+1, 
             Nombre:       element.Nombre,
             Riesgo:       element.Riesgo,
             SitioInteres: element.SitioInteres
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
      "Nombre":       element.Nombre,
      "Riesgo":       element.Riesgo,
      "SitioInteres": element.SitioInteres
    });
   });
     this.ObtenerServicio.PostRequest('Importador/RelacionRSI', 'APIREST', {
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