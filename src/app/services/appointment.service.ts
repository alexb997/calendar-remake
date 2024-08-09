import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Appointment {
  id: number;
  time: string;
  description: string;
  views: number;
}

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private appointments: { [date: string]: Appointment[] } = {};
  private appointmentsSubject = new BehaviorSubject<{ [date: string]: Appointment[] }>(this.appointments);

  constructor() {
    this.loadAppointments();
  }

  private saveAppointments() {
    localStorage.setItem('appointments', JSON.stringify(this.appointments));
    this.appointmentsSubject.next(this.appointments);
  }

  private loadAppointments() {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      this.appointments = JSON.parse(savedAppointments);
      this.appointmentsSubject.next(this.appointments);
    }
  }

  getAppointments(date: string): Appointment[] {
    return this.appointments[date] || [];
  }

  getAppointment(date: string, id: number): Appointment | undefined {
    return this.getAppointments(date).find(appointment => appointment.id === id);
  }

  addAppointment(date: string, appointment: Appointment) {
    if (!this.appointments[date]) {
      this.appointments[date] = [];
    }
    this.appointments[date].push(appointment);
    this.saveAppointments();
  }

  updateAppointment(oldDate: string, updatedAppointment: Appointment, newDate: string): Observable<void>
    if (this.appointments[date]) {
      this.appointments[date] = this.appointments[date].map(appointment =>
        appointment.id === updatedAppointment.id ? updatedAppointment : appointment
      );
      this.saveAppointments();
    }
    return this.updateAppointmentWithDate(oldDate, updatedAppointment.id, newDate, {
      time: updatedAppointment.time,
      description: updatedAppointment.description
    });
  }

  updateAppointmentWithDate(oldDate: string, appointmentId: number, newDate: string, updatedFields: Partial<Appointment>): Observable<void> {
    const oldAppointments = this.appointments[oldDate] || [];
    const appointmentIndex = oldAppointments.findIndex(app => app.id === appointmentId);

    if (appointmentIndex !== -1) {
      const [appointment] = oldAppointments.splice(appointmentIndex, 1);

      if (oldAppointments.length === 0) {
        delete this.appointments[oldDate];
      }

      if (!this.appointments[newDate]) {
        this.appointments[newDate] = [];
      }
      this.appointments[newDate].push({ ...appointment, ...updatedFields });

      this.appointmentsSubject.next(this.appointments);
    }

    return of();
  }

  deleteAppointment(date: string, id: number) {
    if (this.appointments[date]) {
      this.appointments[date] = this.appointments[date].filter(appointment => appointment.id !== id);
      this.saveAppointments();
    }
  }
}
