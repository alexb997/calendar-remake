import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Appointment } from '../form-appointment/appointment.model';
import { AppointmentService } from '../service/appointment.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-appointment',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './edit-appointment.component.html',
  styleUrls: ['./edit-appointment.component.css'],
  providers: [ DatePipe ]
})

export class EditAppointmentComponent {
  @Input() appointment: Appointment | null = null;
  @Input() selectedDate: string | null = null;
  @Input() newDate: string | null =null;
  @Output() appointmentUpdated = new EventEmitter<void>();
  @Output() editCancelled = new EventEmitter<void>();

  appointmentForm: FormGroup;

  constructor(private fb: FormBuilder, private appointmentService: AppointmentService,private datePipe: DatePipe) {
    console.log(this.selectedDate);
    this.appointmentForm = this.fb.group({
      time: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  ngOnChanges() {
    if (this.appointment) {
      this.appointmentForm.patchValue({
        time: this.appointment.time,
        description: this.appointment.description,
        date: this.selectedDate
      });
    }
  }

  formatDateToYYYYMMDD(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-M-d') || '';
  }

  save() {
    if (this.appointment && this.selectedDate) {
      const newDate = this.formatDateToYYYYMMDD(this.appointmentForm.get('date')?.value);
      const updatedAppointment: Appointment = {
        id: this.appointment.id,
        time: this.appointmentForm.get('time')?.value,
        description: this.appointmentForm.get('description')?.value,
      };

      this.appointmentService.updateAppointment(this.selectedDate, updatedAppointment,newDate);
      console.log(updatedAppointment)
    }
  }

  cancel() {
    this.editCancelled.emit();
  }
}
