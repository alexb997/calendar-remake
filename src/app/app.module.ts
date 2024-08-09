import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { routes } from './app.routes';
import { EditAppointmentComponent } from './edit-appointment/edit-appointment.component';

@NgModule({
  declarations: [
    AppointmentFormComponent,
  ],
  imports: [
    AppComponent,
  ],
  providers: []
})
export class AppModule { }
