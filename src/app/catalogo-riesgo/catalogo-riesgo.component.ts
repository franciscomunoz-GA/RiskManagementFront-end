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

export interface EstructuraCatalogo{
  Id:      number;
  Nombre:  string;
  Usuario: string;
  Fecha:   string;
}
@Component({
  selector: 'app-catalogo-riesgo',
  templateUrl: './catalogo-riesgo.component.html',
  styleUrls: ['./catalogo-riesgo.component.scss']
})
export class CatalogoRiesgoComponent implements OnInit {
  displayedColumns: string[] = ['Nombre', 'Usuario', 'Fecha', 'Editar', 'Deshabilitar', 'Eliminar'];
  Tabla: MatTableDataSource<EstructuraCatalogo>;
  Catalogo: EstructuraCatalogo[] = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(public dialog: MatDialog, private Menu: ValidarNavbarService, private excelService:ExcelService, private snackBar: MatSnackBar) {
    this.Menu.OcultarProgress();
    this.Tabla = new MatTableDataSource(this.Catalogo);
  }
  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.Catalogo, 'CatalogoDeRiesgos');
  }
  ngOnInit(): void {
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
  Deshabilitar(){    
        
  }
  Eliminar(){
    this.snackBar.open('¿Seguro de eliminar el registro?', 'Eliminar', {
      duration: 5000,
    }).onAction().subscribe(()=>{
      this.EliminarRegistro();
    });
  }
  EliminarRegistro(){

  }
  DialogAgregar(){
    const dialogRef = this.dialog.open(DialogRiesgo, {
      width: '50vw',
      data:   {Titulo: 'Agregar'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');      
    });
  }
  DialogModificar(Id){
    const dialogRef = this.dialog.open(DialogRiesgo, {
      width: '50vw',
      data:   {Titulo: 'Modificar'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');      
    });
  }
  DialogImportar(){
    const dialogRef = this.dialog.open(DialogImportarRiesgo, {
      width: '80vw',
      data:   {Titulo: 'Importar'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');      
    });
  }
  TraerInformacion(){        
    this.Catalogo.push({ Id: 1, Nombre: 'Encuesta 1', Usuario: "Francisco", Fecha: '2020-04-01'},{ Id: 2, Nombre: 'Encuesta 2', Usuario: "Carlos", Fecha: '2020-04-01'});
    this.Tabla.data = this.Catalogo;        
    this.Tabla.filter = "";
    
  }
}
export interface ImportElement {
  Numero: number;
  Nombre: string;    
}

@Component({
  selector: 'dialog-catalogo-riesgo',
  templateUrl: 'dialog-catalogo-riesgo.html',
  styleUrls: ['./catalogo-riesgo.component.scss']
})
export class DialogRiesgo {
  // Servicio de api
  ObtenerServicio: any;

  Nombre: string;
  Titulo: string;  
  
  constructor(public dialogRef: MatDialogRef<DialogRiesgo>, @Inject(MAT_DIALOG_DATA) public data: any, public http: HttpClient, private snackBar: MatSnackBar,) {
      this.Titulo = data.Titulo;
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
  Agregar(){
    this.ObtenerServicio.PostRequest('validarUsuario', 'APIREST', {})
    .subscribe((response)=>{      
      if(response.Success){        
      }
      else{                
        this.snackBar.open('','',{
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
    this.ObtenerServicio.PostRequest('validarUsuario', 'APIREST', {})
    .subscribe((response)=>{      
      if(response.Success){        
      }
      else{                
        this.snackBar.open('','',{
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

@Component({
  selector: 'dialog-importar-catalogo-riesgo',
  templateUrl: 'dialog-importar-catalogo-riesgo.html',
  styleUrls: ['./catalogo-riesgo.component.scss']
})
export class DialogImportarRiesgo implements OnInit {
  Titulo: string;
  Excel: any;

  displayedColumns: string[] = ['Numero', 'Nombre'];
  dataSource = new MatTableDataSource<ImportElement>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(public dialogRef: MatDialogRef<DialogRiesgo>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.Titulo = data.Titulo;
  } 
  ngOnInit() {
    this.dataSource.paginator = this.paginator;

    this.Excel = (<HTMLInputElement>document.getElementById('Excel'));
    const schema = {
      'Nombre': {
        prop: 'Nombre',
        type: String,
        required: true
      }
    }
    this.Excel.addEventListener('change', () => {      
      readXlsxFile(this.Excel.files[0], { schema }).then(({ rows, errors }) => {
        // `errors` have shape `{ row, column, error, value }`.
        // errors.length === 0
        if(rows.length > 0){          
          rows.forEach((element, index) => {                        
            this.dataSource.data.push({Numero: index+1, Nombre: element.Nombre});
            this.dataSource.paginator = this.paginator;
          });
        }
      });     
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}