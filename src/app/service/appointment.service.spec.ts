import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Appointment } from '../form-appointment/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private appointmentsSubject = new BehaviorSubject<{ [date: string]: Appointment[] }>({});
  appointments$ = this.appointmentsSubject.asObservable();

  private appointments = this.appointmentsSubject.getValue();

  addAppointment(date: string, time: string, description: string): void {
    const id = new Date().getTime();
    const appointment: Appointment = { id, time, description };
    if (!this.appointments[date]) {
      this.appointments[date] = [];
    }
    this.appointments[date].push(appointment);
    this.appointmentsSubject.next(this.appointments);
  }

  deleteAppointment(date: string, id: number): void {
    if (this.appointments[date]) {
      this.appointments[date] = this.appointments[date].filter(
        (appointment) => appointment.id !== id
      );
      this.appointmentsSubject.next(this.appointments);
    }
  }

  getAppointmentsForDate(date: string): Appointment[] {
    return this.appointments[date] || [];
  }

  updateAppointment(oldDate: string, updatedAppointment: Appointment, newDate: string): void {
    this.deleteAppointment(oldDate, updatedAppointment.id);
    this.addAppointment(newDate, updatedAppointment.time, updatedAppointment.description);
  }

  updateAppointments(date: string, appointments: Appointment[]): void {
    this.appointments[date] = appointments;
    this.appointmentsSubject.next(this.appointments);
  }
}
