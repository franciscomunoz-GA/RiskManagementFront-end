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

export interface EstructuraCatalogo{
  Id:      number;  
  Nombre:  string;    
  Area:    string;
  Riesgos: string;
  Usuario: string;  
  Fecha:   string;
  Estatus: boolean;
  Usada:   boolean;
}

@Component({
  selector: 'app-riesgos-areas',
  templateUrl: './riesgos-areas.component.html',
  styleUrls: ['./riesgos-areas.component.scss']
})
export class RiesgosAreasComponent implements OnInit {
  // Servicio API
  ObtenerServicio: any;
  // sesión
  IdUsuario = JSON.parse(sessionStorage['SessionCob']).IdUsuario;
  displayedColumns: string[] = ['Nombre', 'Area', 'Riesgos', 'Usuario', 'Fecha', 'Editar', 'Deshabilitar', 'Eliminar'];
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
  this.excelService.exportAsExcelFile(this.Catalogo, 'EncuestaRiesgosAreas');
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
    this.ObtenerServicio.PostRequest('Modificar/RelacionRAEstatus', 'APIREST', 
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
    this.ObtenerServicio.PostRequest('Eliminar/RelacionRA', 'APIREST', 
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
    this.ObtenerServicio.PostRequest('Seleccionar/RelacionRA', 'APIREST', {
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
            let Usada: boolean;
            if(element.usada > 0){
              Usada = true;
            }
            else{
              Usada = false;
            }
            this.Catalogo.push({ 
              Id:      element.Id,
              Nombre:  element.Nombre,            
              Area:    element.NombreArea,
              Riesgos: element.Riesgos,
              Usuario: element.Usuario, 
              Fecha:   element.Fecha,            
              Estatus: Estatus,
              Usada:   Usada
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
    const dialogRef = this.dialog.open(DialogRiesgosAreas, {      
      maxWidth: '600px',
      minWidth: '300px',
      data:  {Titulo: 'Agregar'}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.TraerInformacion();
    });
  }
  DialogImportar(){
    const dialogRef = this.dialog.open(DialogImportarRiesgosAreas, {
      width: '100vw',
      data:   {Titulo: 'Importar'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.TraerInformacion();
    });
  }
  DialogModificar(Id){
    const dialogRef = this.dialog.open(DialogRiesgosAreas, {
      maxWidth: '600px',
      minWidth: '300px',
      data:  {Titulo: 'Modificar', Id: Id}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.TraerInformacion();   
    });
  }
}
@Component({
  selector: 'dialog-encuesta-riesgos-areas',
  templateUrl: 'dialog-encuesta-riesgos-areas.html',
  styleUrls: ['./riesgos-areas.component.scss']
})
export class DialogRiesgosAreas implements OnInit{
  // Servicio de api
  ObtenerServicio: any;
  // sesión
  IdUsuario = JSON.parse(sessionStorage['SessionCob']).IdUsuario;

  Titulo:      string;
  Tipo:        boolean = false;
  Progressbar: boolean = false;

  // Inputs
  Nombre: string;
  Riesgo: any;
  Area:   any;
  toppings = new FormControl();
  // Listados
  Riesgos:          Array<string> = [];
  PuntosInteres:    Array<string> = [];
  RiesgosAgregados: Array<any> = [];
  Areas:            Array<string> = [];
  constructor(public dialogRef: MatDialogRef<DialogRiesgosAreas>, 
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
    this.ObtenerServicio.PostRequest('Seleccionar/CatalogosRA', 'APIREST', {
      Id: this.data.Id,
      IdUsuario: this.IdUsuario
    })
    .subscribe((response)=>{   
      this.Progressbar = false;             
      if(response.Success){
        if(response.Data){
          let Resultado = response.Data;
          this.Riesgos  = Resultado.Riesgos;
          this.Areas    = Resultado.Areas;
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
    this.RiesgosAgregados = [];
    this.ObtenerServicio.PostRequest('Seleccionar/RelacionRAD', 'APIREST', 
    {
      Id: this.data.Id,
      IdUsuario: this.IdUsuario
    })
    .subscribe((response)=>{   
      this.Progressbar = false;             
      if(response.Success){
        if(response.Data){
          let Resultado = response.Data[0];

          this.Nombre           = Resultado.Nombre;
          this.Area             = Resultado.IdArea;
          if(Resultado.Riesgos != []){
            Resultado.Riesgos.forEach(element => {
              this.RiesgosAgregados.push({
                Id:     element.idRelacion,
                Nombre: element.Riesgo,
              })   
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
  
  Agregar(){
    if(this.Nombre != '' && this.Nombre != undefined){     
      if(this.Area > 0){
          if(this.RiesgosAgregados.length > 0){
            let riesgos = [];
            this.RiesgosAgregados.forEach(element => {
              riesgos.push(element.Id);
            });
            this.Progressbar = true;
            this.ObtenerServicio.PostRequest('Insertar/RelacionRA', 'APIREST', {
              Nombre:    this.Nombre,
              IdArea:    this.Area,               
              IdRiesgo:  JSON.stringify(riesgos),
              IdUsuario: this.IdUsuario
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
                else if(response.Data == 'Duplicidad Nombre'){
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
          this.snackBar.open('Es necesario agregar al menos un riesgo','',{
            duration: 3000,
            panelClass: ['mensaje-warning']
          });
        }
      }
      else{
        this.snackBar.open('Es necesario seleccionar un área','',{
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
  AgregarRiesgos(){
    if(this.Riesgo != '' && this.Riesgo != undefined){
      if(this.Titulo == 'Modificar'){
        this.InsertarRiesgos();
      }
      else{
        this.Riesgo.forEach(element => {
          let Nombre = this.BuscarEnArray(this.Riesgos, 'Nombre', element);
          let Duplicado = this.BuscarEnArray(this.RiesgosAgregados, 'Nombre', element);
          if(!Duplicado){
            this.RiesgosAgregados.push({Id: element, Nombre: Nombre});
          }                
        });
      }
      this.Riesgo = '';      
    }
  }
  Modificar(){
  if(this.Nombre != '' && this.Nombre != undefined){
    this.Progressbar = true;
    this.ObtenerServicio.PostRequest('Modificar/RelacionRA', 'APIREST', {
      Id:        this.data.Id, 
      Nombre:    this.Nombre, 
      IdArea:    this.Area,
      IdUsuario: this.IdUsuario
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
  EliminarRiesgos(riesgos){
    if(this.Titulo == 'Modificar'){
      this.BorrarRiesgos(riesgos);
    }
    else{
      riesgos.forEach(element => {
        console.log(element._value);
        this.RiesgosAgregados.forEach((item, index) => {
          if(item.Id === element._value) {
            this.RiesgosAgregados.splice(index, 1);
          }
        });
      });
    }    
  }
  private InsertarRiesgos(){
    this.Progressbar = true;
    this.ObtenerServicio.PostRequest('Agregar/RelacionRA', 'APIREST', {  
      Id:        this.data.Id,       
      IdArea:    this.Area,  
      IdRiesgo:       JSON.stringify(this.Riesgo),
      IdUsuario:      this.IdUsuario
    })
    .subscribe((response)=>{   
      this.Progressbar = false;             
      if(response.Success){
        if(response.Data){
          this.Detalle();
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
  private BorrarRiesgos(riesgos){
    let RiesgosEliminados = [];
    riesgos.forEach(element => {
      RiesgosEliminados.push(element._value);
    });
    this.Progressbar = true;
    this.ObtenerServicio.PostRequest('Quitar/RelacionRA', 'APIREST', {      
      IdRelacion: JSON.stringify(RiesgosEliminados),
      IdUsuario:  this.IdUsuario
    })
    .subscribe((response)=>{   
      this.Progressbar = false;             
      if(response.Success){
        if(response.Data){
          this.Detalle();
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
  private BuscarEnArray(array, Tipo: string, Valor){
    let Resultado = false;
    if(Tipo === 'Nombre'){
      array.find((element, index) => {
        if(element.Id == Valor){
          Resultado = element.Nombre;
        }
      });
    }
    else{
      array.find((element, index) => {
        if(element.Nombre == Valor){
          Resultado = element.Id;
        }
      });
    }
    return Resultado;
    }
}
export interface ImportElement {
Numero:       number;
Nombre:       string;
Riesgo:       string;
Area: string;  
}
@Component({
selector: 'dialog-importar-encuesta-riesgos-areas',
templateUrl: 'dialog-importar-encuesta-riesgos-areas.html',
styleUrls: ['./riesgos-areas.component.scss']
})
export class DialogImportarRiesgosAreas implements OnInit {
// Servicio de api
ObtenerServicio: any;
// sesión
IdUsuario = JSON.parse(sessionStorage['SessionCob']).IdUsuario;

Progressbar: boolean = false;
Titulo: string;
Excel: any;

displayedColumns: string[] = ['Numero', 'Nombre', 'Area', 'Riesgo'];
Tabla = new MatTableDataSource<ImportElement>();
RegistrosTabla:ImportElement[] = []
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
Catalogo = [{'Nombre': '', 'Area': '', 'Riesgo': ''}];
constructor(public dialogRef: MatDialogRef<DialogImportarRiesgosAreas>,
           @Inject(MAT_DIALOG_DATA) public data: any, 
           public http: HttpClient, 
           private snackBar: MatSnackBar,
           private excelService:ExcelService) {
 this.Titulo = data.Titulo;
 this.Tabla = new MatTableDataSource(this.RegistrosTabla);
 this.ObtenerServicio = new ServicioService(http);
} 
exportAsXLSX():void {
this.excelService.exportAsExcelFile(this.Catalogo, 'PlantillaRiesgosAreas');
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
  'Area': {
    prop: 'Area',
    type: String,
    required: true
  },
  'Riesgo': {
    prop: 'Riesgo',
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
        if(!this.Duplicidad(element)){
          if((element.Nombre != '' && element.Nombre != undefined) && (element.Area != '' && element.Area != undefined) && (element.Riesgo != '' && element.Riesgo != undefined))
          this.RegistrosTabla.push({
            Numero: index+1, 
            Nombre: element.Nombre,
            Area:   element.Area,
            Riesgo: element.Riesgo,
            }); 
        }           
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
    "Area": element.Area
  });
 });
   this.ObtenerServicio.PostRequest('Importador/RelacionRA', 'APIREST', {
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
  private Duplicidad(Fila): boolean{
    let Resultado: boolean = false;
    this.RegistrosTabla.forEach(element => {
      if(element.Nombre == Fila.Nombre && element.Area == Fila.Area &&element.Riesgo == Fila.Riesgo){
        Resultado = true;
      } 
    });
    return Resultado;
 }
}