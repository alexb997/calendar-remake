import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Appointment, AppointmentService } from '../services/appointment.service';

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
  styleUrls: ['./edit-appointment.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
})
export class EditAppointmentComponent implements OnInit {
  @Input() appointment!: Appointment;
  @Input() selectedDate!: string;
  @Output() appointmentUpdated = new EventEmitter<void>();
  @Output() editCancelled = new EventEmitter<void>();

  appointmentForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      time: [this.appointment.time, Validators.required],
      description: [this.appointment.description, Validators.required],
      date: [new Date(this.selectedDate), Validators.required]
    });
  }

  save(): void {
    if (this.appointmentForm.valid) {
      const { time, description, date } = this.appointmentForm.value;
      const newDate = this.formatDate(date);
      this.appointmentService.updateAppointment(this.selectedDate, {
        ...this.appointment,
        time,
        description
      }, newDate).subscribe(() => {
        this.appointmentUpdated.emit();
      });
    }
  }

  cancel(): void {
    this.editCancelled.emit();
  }

  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}
