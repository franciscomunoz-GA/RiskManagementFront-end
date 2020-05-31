import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class PermisosSeccionesService {
  private CatalogoArea          = new BehaviorSubject<boolean>(false);
  private CatalogoCriterioLegal = new BehaviorSubject<boolean>(false);
  private CatalogoDimension     = new BehaviorSubject<boolean>(false);
  private CatalogoRiesgos       = new BehaviorSubject<boolean>(false);
  private CatalogoTipoRiesgo    = new BehaviorSubject<boolean>(false);

  private EncuestaRiesgosPuntosInteres = new BehaviorSubject<boolean>(false);
  private EncuestaRiesgosAreas         = new BehaviorSubject<boolean>(false);
  private EncuestaClientesRiesgosAreas = new BehaviorSubject<boolean>(false);

  constructor() { }
  get ValorCatalogoArea(){
    return this.CatalogoArea.asObservable();
  }
  get ValorCatalogoCriterioLegal(){
    return this.CatalogoCriterioLegal.asObservable();
  }
  get ValorCatalogoDimension(){
    return this.CatalogoDimension.asObservable();
  }
  get ValorCatalogoRiesgos(){
    return this.CatalogoRiesgos.asObservable();
  }
  get ValorCatalogoTipoRiesgo(){
    return this.CatalogoTipoRiesgo.asObservable();
  }
  get ValorEncuestaRiesgosPuntosInteres(){
    return this.EncuestaRiesgosPuntosInteres.asObservable();
  }
  get ValorEncuestaRiesgosAreas(){
    return this.EncuestaRiesgosAreas.asObservable();
  }
  get ValorEncuestaClientesRiesgosAreas(){
    return this.EncuestaClientesRiesgosAreas.asObservable();
  }
  AccesoCatalogoArea(){    
    let Permiso: boolean = this.ValidarPermisoSeccion('ver area');
    this.CatalogoArea.next(Permiso);
  }
  AccesoCatalogoCriterioLegal(){    
    let Permiso: boolean = this.ValidarPermisoSeccion('ver estandares legales');
    this.CatalogoCriterioLegal.next(Permiso);
  }
  AccesoCatalogoDimension(){    
    let Permiso: boolean = this.ValidarPermisoSeccion('ver dimensiones');
    this.CatalogoDimension.next(Permiso);
  }
  AccesoCatalogoRiesgos(){    
    let Permiso: boolean = this.ValidarPermisoSeccion('ver riesgos');
    this.CatalogoRiesgos.next(Permiso);
  }
  AccesoCatalogoTipoRiesgo(){    
    let Permiso: boolean = this.ValidarPermisoSeccion('ver tipos riesgos');
    this.CatalogoTipoRiesgo.next(Permiso);
  }
  AccesoEncuestaRiesgosPuntosInteres(){    
    let Permiso: boolean = this.ValidarPermisoSeccion('ver relacion riesgo sitio interes');
    this.EncuestaRiesgosPuntosInteres.next(Permiso);
  }
  AccesoEncuestaRiesgosAreas(){    
    let Permiso: boolean = this.ValidarPermisoSeccion('ver relacion area riesgo');
    this.EncuestaRiesgosAreas.next(Permiso);
  }
  AccesoEncuestaClientesRiesgosAreas(){    
    let Permiso: boolean = this.ValidarPermisoSeccion('ver relacion cliente riesgo area1');
    this.EncuestaClientesRiesgosAreas.next(Permiso);
  }
  private ValidarPermisoSeccion(Seccion): boolean{
    let Permiso: boolean = false;
    let Permisos = JSON.parse(sessionStorage['SessionCob']).Permisos;
    Permisos.forEach(element => {
      if(element === Seccion){
        Permiso = true;
      }
    });
    return Permiso;
  }
}
