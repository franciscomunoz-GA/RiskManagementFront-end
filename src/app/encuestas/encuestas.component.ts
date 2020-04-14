import {NestedTreeControl} from '@angular/cdk/tree';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ThemePalette} from '@angular/material/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatTreeNestedDataSource} from '@angular/material/tree';

export interface EstructuraEncuesta{
  Id:      number;
  Nombre:  string;
  Usuario: string;
  Fecha:   string;
}

@Component({
  selector: 'app-encuestas',
  templateUrl: './encuestas.component.html',
  styleUrls: ['./encuestas.component.scss']
})
export class EncuestasComponent implements OnInit {
  displayedColumns: string[] = ['Nombre', 'Usuario', 'Fecha', 'Visualizar', 'Editar', 'Deshabilitar', 'Eliminar'];
  TalblaEncuestas: MatTableDataSource<EstructuraEncuesta>;

  Encuestas: EstructuraEncuesta[] = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(public dialog: MatDialog) {
    this.TalblaEncuestas = new MatTableDataSource(this.Encuestas);
    
  }
  
  ngOnInit() {
    this.TalblaEncuestas.paginator = this.paginator;
    this.TalblaEncuestas.sort = this.sort;
    this.TraerInformacion();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.TalblaEncuestas.filter = filterValue.trim().toLowerCase();

    if (this.TalblaEncuestas.paginator) {
      this.TalblaEncuestas.paginator.firstPage();
    }
  }
  DialogAgregar(){
    const dialogRef = this.dialog.open(DialogAgregarEncuesta, {
      width: '100vw',
      data:   null,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');      
    });
  }
  TraerInformacion(){        
    this.Encuestas.push({ Id: 1, Nombre: 'Encuesta 1', Usuario: "Francisco", Fecha: '2020-04-01'});
    this.TalblaEncuestas.data = this.Encuestas;        
    this.TalblaEncuestas.filter = "";
    
  }
}
@Component({
  selector: 'dialog-agregar-encuesta',
  templateUrl: 'dialog-agregar-encuesta.html',
  styleUrls: ['./encuestas.component.scss']
})
export class DialogAgregarEncuesta {
  TREE_DATA = [
    {
      name: 'Fruit',
      children: [
        {name: 'Apple'},
        {name: 'Banana'},
        {name: 'Fruit loops'},
      ]
    }, {
      name: 'Vegetables',
      children: [
        {
          name: 'Green',
          children: [
            {name: 'Broccoli'},
            {name: 'Brussels sprouts'},
          ]
        }, {
          name: 'Orange',
          children: [
            {name: 'Pumpkins'},
            {name: 'Carrots'},
          ]
        },
      ]
    },
  ];
  treeControl = new NestedTreeControl<any>(node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();
  PreguntaN1: boolean = false;
  PreguntaN2: boolean = false;
  PreguntaN3: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<DialogAgregarEncuesta>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.dataSource.data = this.TREE_DATA;
  }
  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;
  onNoClick(): void {
    this.dialogRef.close();
  }
  AgregarPreguntaN1(){

  }
  AgregarPreguntaN2(){
    this.PreguntaN1 = true;
    this.PreguntaN2 = false;
  }
  AgregarPreguntaN3(){
    this.PreguntaN3 = false;
  }
}