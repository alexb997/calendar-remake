import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../service/appointment.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-form-appointment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
  ],
  templateUrl: './form-appointment.component.html',
  styleUrls: ['./form-appointment.component.css']
})
export class FormAppointmentComponent {
  @Input() selectedDate: string | null = null;
  appointmentForm: FormGroup;

  constructor(private fb: FormBuilder, private appointmentService: AppointmentService) {
    this.appointmentForm = this.fb.group({
      time: ['', Validators.required],
      description: ['', Validators.required],
      // repetition: ['none'], 
      // repeatUntil: [null]
    });
  }

  addAppointment() {
    if (this.selectedDate && this.appointmentForm.valid) {
      const { time, description, date } = this.appointmentForm.value;
      // const { time, description, date, repetition, repeatUntil } = this.appointmentForm.value;
      const newDate = this.formatDate(date);
      // if(repetition != 'none'){
      //   this.createRepeatedAppointments(newDate, time, description, repetition, repeatUntil);
      // }
      // else{
        this.appointmentService.addAppointment(this.selectedDate, time, description);
        this.appointmentForm.reset();
      // }
      
    }
  }

  createRepeatedAppointments(startDate: string, time: string, description: string, repetition: string, repeatUntil: Date): void {
    let currentDate = new Date(startDate);

    while (currentDate <= repeatUntil) {
      this.appointmentService.addAppointment(this.formatDate(currentDate), time, description);

      switch (repetition) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        default:
          return;
      }
    }
  }
  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}
