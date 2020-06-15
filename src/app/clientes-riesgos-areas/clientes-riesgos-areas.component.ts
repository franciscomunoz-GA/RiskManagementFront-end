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

export interface EstructuraCatalogo{
  Id:                number;  
  Nombre:            string;
  Cliente:           string;  
  RiesgoId:          string;
  RiesgoNombre:      string;
  Area:              string;
  Usuario:           string;
  FechaCreacion:     string;
  FechaModificacion: string;
  Estatus:           boolean;
}

@Component({
  selector: 'app-clientes-riesgos-areas',
  templateUrl: './clientes-riesgos-areas.component.html',
  styleUrls: ['./clientes-riesgos-areas.component.scss']
})
export class ClientesRiesgosAreasComponent implements OnInit {
// Servicio API
ObtenerServicio: any;
// sesión
IdUsuario = JSON.parse(sessionStorage['SessionCob']).IdUsuario;
displayedColumns: string[] = ['Nombre', 'Cliente', 'RiesgoId', 'RiesgoNombre', 'Area', 'Usuario', 'Fecha', 'Editar', 'Deshabilitar', 'Eliminar'];
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
 this.excelService.exportAsExcelFile(this.Catalogo, 'EncuestaClientesRiesgosAreas');
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
  this.ObtenerServicio.PostRequest('Modificar/RelacionCRAEstatus', 'APIREST', 
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
          duration: 4000,
          panelClass: ['mensaje-success']
        });
      }
      else{
        this.snackBar.open('Error al guardar el registro','',{
          duration: 4000,
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
  this.ObtenerServicio.PostRequest('Eliminar/RelacionCRA', 'APIREST', 
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
          duration: 4000,
          panelClass: ['mensaje-success']
        });
      }
      else{
        this.snackBar.open('No ha sido eliminado el registro','',{
          duration: 4000,
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
  this.ObtenerServicio.PostRequest('Seleccionar/RelacionCRA', 'APIREST', {
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
            Cliente:           element.Cliente,
            RiesgoId:          element.RiesgoId,
            RiesgoNombre:      element.RiesgoNombre,
            Area:              element.Area,
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
        duration: 4000
      });
    }
  }, 
  error => {   
    this.Menu.OcultarProgress();   
    this.snackBar.open('Error de conexión','',{
      duration: 4000,       
    })
  });        
}
DialogAgregar(){
  const dialogRef = this.dialog.open(DialogClienteRiesgosAreas, {
    width: '50vw',
    data:  {Titulo: 'Agregar'}
  });
  dialogRef.afterClosed().subscribe(result => {
    this.TraerInformacion();
  });
}
DialogImportar(){
  const dialogRef = this.dialog.open(DialogImportarClienteRiesgosAreas, {
    width: '100vw',
    data:   {Titulo: 'Importar'}
  });

  dialogRef.afterClosed().subscribe(result => {
    this.TraerInformacion();
  });
}
DialogModificar(Id){
  const dialogRef = this.dialog.open(DialogClienteRiesgosAreas, {
    width: '50vw',
    data:  {Titulo: 'Modificar', Id: Id}
  });

  dialogRef.afterClosed().subscribe(result => {
     this.TraerInformacion();   
  });
}
}
@Component({
selector: 'dialog-encuesta-clientes-riesgos-areas',
templateUrl: 'dialog-encuesta-clientes-riesgos-areas.html',
styleUrls: ['./clientes-riesgos-areas.component.scss']
})
export class DialogClienteRiesgosAreas implements OnInit{
// Servicio de api
ObtenerServicio: any;
// sesión
IdUsuario = JSON.parse(sessionStorage['SessionCob']).IdUsuario;

Titulo:      string;
Tipo:        boolean = false;
Progressbar: boolean = false;

// Inputs
Nombre: string;
Cliente: any;
RiesgoArea: any;

// Listados
RiesgosAreas:  Array<string> = [];
Clientes:      Array<string> = [];
constructor(public dialogRef: MatDialogRef<DialogClienteRiesgosAreas>, 
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
  this.ObtenerServicio.PostRequest('Seleccionar/CatalogosCRA', 'APIREST', 
  {
    Id: this.data.Id,
    IdUsuario: this.IdUsuario
  })
  .subscribe((response)=>{   
    this.Progressbar = false;             
    if(response.Success){
      if(response.Data){
        let Resultado      = response.Data;
        this.RiesgosAreas  = Resultado.RiesgosAreas;
        this.Clientes      = Resultado.Clientes;
        
        if(this.data.Titulo == 'Modificar'){
          this.Detalle();          
        }
      }      
      else{
        this.snackBar.open('Error de conexión','',{
          duration: 4000,
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
  this.ObtenerServicio.PostRequest('Seleccionar/RelacionCRAD', 'APIREST', 
  {
    Id: this.data.Id,
    IdUsuario: this.IdUsuario
  })
  .subscribe((response)=>{   
    this.Progressbar = false;             
    if(response.Success){
      if(response.Data){
        let Resultado = response.Data[0];

        this.Nombre     = Resultado.Nombre;
        this.Cliente    = Resultado.IdCliente;
        this.RiesgoArea = Resultado.IdRelacionRiesgoArea;
      }      
      else{
        this.snackBar.open('Error de conexión','',{
          duration: 4000,
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
    if(this.RiesgoArea > 0){
      if(this.Cliente > 0){
        this.Progressbar = true;
        this.ObtenerServicio.PostRequest('Insertar/RelacionCRA', 'APIREST', {
          Nombre:    this.Nombre,
          IdRelRiskArea:  this.RiesgoArea,
          IdCliente: this.Cliente,
          IdUsuario: this.IdUsuario
        })
        .subscribe((response)=>{   
          this.Progressbar = false;             
          if(response.Success){
            if(response.Data > 0){
              this.snackBar.open('Registro guardado correctamente','',{
                duration: 4000,
                panelClass: ['mensaje-success']
              });
              this.onNoClick();
              this.Nombre     = '';                    
              this.RiesgoArea = '';                   
            }
            else if(response.Data == 'Duplicidad Relacion'){
              this.snackBar.open('Ya existe un registro con la misma relación cliente-riesgo-área','',{
                duration: 4000,
                panelClass: ['mensaje-warning']
              });
            }
            else if(response.Data == 'Duplicidad'){
              this.snackBar.open('Ya existe un registro con la misma relación cliente-riesgo-área','',{
                duration: 4000,
                panelClass: ['mensaje-warning']
              });
            }
            else{
              this.snackBar.open('No ha sido creado el registro','',{
                duration: 4000,
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
        this.snackBar.open('Es necesario seleccionar un cliente','',{
          duration: 4000,
          panelClass: ['mensaje-warning']
        });
      }
    }
    else{
      this.snackBar.open('Es necesario seleccionar un riesgo-área','',{
        duration: 4000,
        panelClass: ['mensaje-warning']
      });
    }
  }
  else{
    this.snackBar.open('Es necesario agregar el nombre del catálogo','',{
      duration: 4000,
      panelClass: ['mensaje-warning']
    });
  }
}
Modificar(){
  if(this.Nombre != '' && this.Nombre != undefined){
    this.Progressbar = true;
    this.ObtenerServicio.PostRequest('Modificar/RelacionCRA', 'APIREST', {
      Id:            this.data.Id, 
      Nombre:        this.Nombre, 
      IdCliente:     this.Cliente,
      IdRelRiskArea: this.RiesgoArea,
      IdUsuario:     this.IdUsuario
    })
    .subscribe((response)=>{   
      this.Progressbar = false;             
      if(response.Success){
        if(response.Data > 0){
          this.snackBar.open('Registro guardado correctamente','',{
            duration: 4000,
            panelClass: ['mensaje-success']
          });
          this.onNoClick();
        }
        else if(response.Data == 'Duplicado'){
          this.snackBar.open('Ya existe un registro con el mismo nombre','',{
            duration: 4000,
            panelClass: ['mensaje-warning']
          });
        }
        else{
          this.snackBar.open('No ha sido creado el registro','',{
            duration: 4000,
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
      duration: 4000,
      panelClass: ['mensaje-warning']
    });
  }
 }
}
export interface ImportElement {
Numero:     number;
Nombre:     string;
RiesgoArea: string;
Cliente:    string;  
}
@Component({
selector: 'dialog-importar-encuesta-clientes-riesgos-areas',
templateUrl: 'dialog-importar-encuesta-clientes-riesgos-areas.html',
styleUrls: ['./clientes-riesgos-areas.component.scss']
})
export class DialogImportarClienteRiesgosAreas implements OnInit {
// Servicio de api
ObtenerServicio: any;
// sesión
IdUsuario = JSON.parse(sessionStorage['SessionCob']).IdUsuario;

Progressbar: boolean = false;
Titulo: string;
Excel: any;

displayedColumns: string[] = ['Numero', 'Nombre','RiesgoArea', 'Cliente'];
Tabla = new MatTableDataSource<ImportElement>();
RegistrosTabla:ImportElement[] = []
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
Catalogo = [{'Nombre': '', 'Cliente': '', 'Riesgo-Area': '' }];
constructor(public dialogRef: MatDialogRef<DialogImportarClienteRiesgosAreas>,
           @Inject(MAT_DIALOG_DATA) public data: any, 
           public http: HttpClient, 
           private snackBar: MatSnackBar,
           private excelService:ExcelService) {
 this.Titulo = data.Titulo;
 this.Tabla = new MatTableDataSource(this.RegistrosTabla);
 this.ObtenerServicio = new ServicioService(http);
} 
exportAsXLSX():void {
this.excelService.exportAsExcelFile(this.Catalogo, 'PlantillaClientesAreasRiesgos');
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
  'Riesgo-Area': {
    prop: 'RiesgoArea',
    type: String,
    required: true
  },
  'Cliente': {
    prop: 'Cliente',
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
           Numero:     index+1, 
           Nombre:     element.Nombre,
           RiesgoArea: element.RiesgoArea,
           Cliente:    element.Cliente
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
      "Nombre":          element.Nombre,
      "RiesgoArea":      element.RiesgoArea,
      "NombreComercial": element.Cliente
    });
  });
    this.ObtenerServicio.PostRequest('Importador/RelacionCRA', 'APIREST', {
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
              duration: 4000,
              panelClass: ['mensaje-warning']
            });
          }
          else{
            this.snackBar.open('No ha sido creado el registro','',{
              duration: 4000,
              panelClass: ['mensaje-error']
            });
          }           
        }
        else if(response.Data == 'Duplicado'){
          this.snackBar.open('Ya existe un registro con el mismo nombre','',{
            duration: 4000,
            panelClass: ['mensaje-warning']
          });
        }
        else{
          this.snackBar.open('No ha sido creado el registro','',{
            duration: 4000,
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