import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../service/appointment.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-form-appointment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
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
      description: ['', Validators.required]
    });
  }

  addAppointment() {
    if (this.selectedDate && this.appointmentForm.valid) {
      const { time, description } = this.appointmentForm.value;
      this.appointmentService.addAppointment(this.selectedDate, time, description);
      this.appointmentForm.reset();
    }
  }
}
