import { BrowserModule }           from '@angular/platform-browser';
import { NgModule }                from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, 
         ReactiveFormsModule}      from '@angular/forms';
import { HttpClientModule }        from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//Recaptcha google
import { RecaptchaModule } from 'ng-recaptcha';

// Angular Material
import { MatBottomSheetModule }     from '@angular/material/bottom-sheet';
import { MatButtonModule }          from '@angular/material/button';
import { MatCheckboxModule }        from '@angular/material/checkbox';
import { MatNativeDateModule }      from '@angular/material/core';
import { MatRadioModule }           from '@angular/material/radio';
import { MatPaginatorModule }       from '@angular/material/paginator';
import { MatIconModule }            from '@angular/material/icon';
import { MatCardModule }            from '@angular/material/card';
import { MatMenuModule }            from '@angular/material/menu';
import { MatTabsModule }            from '@angular/material/tabs';
import { MatGridListModule }        from '@angular/material/grid-list';
import { MatToolbarModule }         from '@angular/material/toolbar';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatDatepickerModule }      from '@angular/material/datepicker';
import { MatStepperModule }         from '@angular/material/stepper';
import { MatListModule }            from '@angular/material/list';
import { MatDividerModule }         from '@angular/material/divider';
import { MatAutocompleteModule }    from '@angular/material/autocomplete';
import { MatTableModule }           from '@angular/material/table';
import { MatExpansionModule }       from '@angular/material/expansion';
import { MatSelectModule }          from '@angular/material/select';
import { MatSnackBarModule }        from '@angular/material/snack-bar';
import { MatProgressBarModule }     from '@angular/material/progress-bar';
import { MatDialogModule }          from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule }         from '@angular/material/tooltip';
import { MatBadgeModule }           from '@angular/material/badge';
import { MatSidenavModule }         from '@angular/material/sidenav';
import { MatSortModule }            from '@angular/material/sort';
import { ChartsModule }             from 'ng2-charts';
import { LoginComponent }           from './login/login.component';
import { DashboardComponent }       from './dashboard/dashboard.component';
import { NavbarComponent }          from './navbar/navbar.component';
import { MatSlideToggleModule }     from '@angular/material/slide-toggle';
import { MatTreeModule }            from '@angular/material/tree';
// Servicios
import { ServicioService } from './servicios/servicio.service';
import { SessionValidate } from './servicios/session-validate.service';
import { EncuestasComponent,
         DialogAgregarEncuesta } from './encuestas/encuestas.component';
import { CatalogoRiesgoComponent,
         DialogRiesgo,
         DialogImportarRiesgo } from './catalogo-riesgo/catalogo-riesgo.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    DashboardComponent,
    EncuestasComponent,
    DialogAgregarEncuesta,
    CatalogoRiesgoComponent,
    DialogRiesgo,
    DialogImportarRiesgo
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatBottomSheetModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatTabsModule,
    MatGridListModule,
    MatRadioModule,
    MatDatepickerModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatBadgeModule,
    MatSlideToggleModule,
    MatTreeModule,
    ChartsModule,
    RecaptchaModule
  ],
  entryComponents: [
    DialogAgregarEncuesta,
    DialogRiesgo,
    DialogImportarRiesgo
  ],
  providers: [ServicioService, SessionValidate],
  bootstrap: [AppComponent]
})
export class AppModule { }
