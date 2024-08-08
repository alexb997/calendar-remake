import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Appointment } from '../services/appointment.service';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css'],
})
export class AppointmentFormComponent {
  @Input() selectedDate: string | undefined;
  @Output() appointmentAdded = new EventEmitter<Appointment>();
  @Output() appointmentEdited = new EventEmitter<Appointment>();
  
  appointmentForm: FormGroup;
  isEditing = false;
  editingAppointmentId: number | null = null;

  constructor(private fb: FormBuilder) {
    this.appointmentForm = this.fb.group({
      time: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  addOrEditAppointment() {
    if (this.appointmentForm.valid) {
      const { time, description } = this.appointmentForm.value;
      const appointment: Appointment = {
        id: this.isEditing ? (this.editingAppointmentId ? this.editingAppointmentId : new Date().getTime()) : new Date().getTime(),
        time,
        description,
        views: 0
      };

      if (this.isEditing) {
        this.appointmentEdited.emit(appointment);
        this.isEditing = false;
        this.editingAppointmentId = null;
      } else {
        this.appointmentAdded.emit(appointment);
      }
      this.appointmentForm.reset();
    }
  }
}
