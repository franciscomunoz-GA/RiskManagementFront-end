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
import { ValidarPermisoService } from '../servicios/validar-permiso.service';
export interface EstructuraCatalogo{
  Id:            number;
  Nombre:        string;
  Usuario:       string;
  FechaCreacion: string;
  FechaModificacion: string;
  Estatus:       boolean;
}
@Component({
  selector: 'app-catalogo-tipo-riesgo',
  templateUrl: './catalogo-tipo-riesgo.component.html',
  styleUrls: ['./catalogo-tipo-riesgo.component.scss']
})
export class CatalogoTipoRiesgoComponent implements OnInit {
  // Servicio API
  ObtenerServicio: any;
  // sesión
  IdUsuario = JSON.parse(sessionStorage['SessionCob']).IdUsuario;
  displayedColumns: string[] = ['Nombre', 'Usuario', 'Fecha', 'Editar', 'Deshabilitar', 'Eliminar'];
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
   this.Create = Permiso.ValidarPermiso('crear tipos riesgos');
   this.Update = Permiso.ValidarPermiso('editar tipos riesgos');
   this.Delete = Permiso.ValidarPermiso('eliminar tipos riesgos');
  }
  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.Catalogo, 'CatalogoTiposDeRiesgos');
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
    this.ObtenerServicio.PostRequest('Modificar/RiskTypesEstatus', 'APIREST', 
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
    this.ObtenerServicio.PostRequest('Eliminar/RiskTypes', 'APIREST', 
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
  DialogAgregar(){    
    const dialogRef = this.dialog.open(DialogTipoRiesgo, {
      width: '50vw',
      data:  {Titulo: 'Agregar'}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.TraerInformacion();
    });
  }
  DialogModificar(Id){
    const dialogRef = this.dialog.open(DialogTipoRiesgo, {
      width: '50vw',
      data:  {Titulo: 'Modificar', Id: Id}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.TraerInformacion();   
    });
  }
  DialogImportar(){
    const dialogRef = this.dialog.open(DialogImportarTipoRiesgo, {
      width: '70vw',
      data:   {Titulo: 'Importar'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.TraerInformacion();
    });
  }
  TraerInformacion(){    
    this.Catalogo = [];
    this.Menu.MostrarProgress();
    this.ObtenerServicio.PostRequest('Seleccionar/RiskTypes', 'APIREST', {
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
              Id:      element.Id, 
              Nombre:  element.Nombre, 
              Usuario: element.Usuario, 
              FechaCreacion: element.FechaCreacion,
              FechaModificacion: element.FechaModificacion,
              Estatus: Estatus
            });
          });
          this.Tabla.data = this.Catalogo;
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
export interface ImportElement {
  Numero: number;
  Nombre: string;    
}

@Component({
  selector: 'dialog-catalogo-tipo-riesgo',
  templateUrl: 'dialog-catalogo-tipo-riesgo.html',
  styleUrls: ['./catalogo-tipo-riesgo.component.scss']
})
export class DialogTipoRiesgo implements OnInit{
  // Servicio de api
  ObtenerServicio: any;
  // sesión
  IdUsuario = JSON.parse(sessionStorage['SessionCob']).IdUsuario;
  
  Nombre: string;
  Titulo: string;  
  Progressbar: boolean = false;
  Tipo: boolean = false;
  constructor(public dialogRef: MatDialogRef<DialogTipoRiesgo>, @Inject(MAT_DIALOG_DATA) public data: any, public http: HttpClient, private snackBar: MatSnackBar,) {
      this.Titulo = data.Titulo;
      this.ObtenerServicio = new ServicioService(http);
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(){
    if(this.data.Titulo == 'Modificar'){
      this.Detalle();
      this.Tipo = false;
    }
    else{
     this.Tipo = true;
    }
  }
  Agregar(){
    if(this.Nombre != '' && this.Nombre != undefined){
      this.Progressbar = true;
      this.ObtenerServicio.PostRequest('Insertar/RiskTypes', 'APIREST', 
      {
        Nombre: this.Nombre, 
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
            this.Nombre = '';
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
  Detalle(){
    this.Progressbar = true;
    this.ObtenerServicio.PostRequest('Seleccionar/RiskTypesD', 'APIREST', 
    {
      Id: this.data.Id,
      IdUsuario: this.IdUsuario
    })
    .subscribe((response)=>{   
      this.Progressbar = false;             
      if(response.Success){
        if(response.Data){
          let Resultado = response.Data[0];
          this.Nombre = Resultado.Nombre;
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
      this.ObtenerServicio.PostRequest('Modificar/RiskTypes', 'APIREST', 
      {
        Id: this.data.Id, 
        Nombre: this.Nombre, 
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
}

@Component({
  selector: 'dialog-importar-catalogo-tipo-riesgo',
  templateUrl: 'dialog-importar-catalogo-tipo-riesgo.html',
  styleUrls: ['./catalogo-tipo-riesgo.component.scss']
})
export class DialogImportarTipoRiesgo implements OnInit {
  // Servicio de api
  ObtenerServicio: any;
  // sesión
  IdUsuario = JSON.parse(sessionStorage['SessionCob']).IdUsuario;

  Progressbar: boolean = false;
  Titulo: string;
  Excel: any;

  displayedColumns: string[] = ['Numero', 'Nombre'];
  Tabla = new MatTableDataSource<ImportElement>();
  RegistrosTabla:ImportElement[] = []
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  Catalogo = [{Nombre: ''}];
  constructor(public dialogRef: MatDialogRef<DialogTipoRiesgo>,
              @Inject(MAT_DIALOG_DATA) public data: any, 
              public http: HttpClient, 
              private snackBar: MatSnackBar,
              private excelService:ExcelService) {
    this.Titulo = data.Titulo;
    this.Tabla = new MatTableDataSource(this.RegistrosTabla);
    this.ObtenerServicio = new ServicioService(http);
  }
  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.Catalogo, 'PlantillaTiposRiesgos');
    }
  ngOnInit() {
    this.Tabla.paginator = this.paginator;

    this.Excel = (<HTMLInputElement>document.getElementById('Excel'));
    const schema = {
      'Nombre': {
        prop: 'Nombre',
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
            this.RegistrosTabla.push({Numero: index+1, Nombre: element.Nombre});            
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
    let Nombres = [];
    this.RegistrosTabla.forEach(element => {
      Nombres.push(element.Nombre);
    });
      this.ObtenerServicio.PostRequest('Importar/RiskTypes', 'APIREST', {
        Nombres: JSON.stringify(Nombres), 
        IdUsuario: this.IdUsuario
      })
      .subscribe((response)=>{   
        this.Progressbar = false;             
        if(response.Success){
          if(response.Data > 0){
            this.snackBar.open('Registros guardados correctamente','',{
              duration: 3000,
              panelClass: ['mensaje-success']
            });            
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