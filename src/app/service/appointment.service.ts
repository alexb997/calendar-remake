import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
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
    console.log(this.appointments$);
  }

  deleteAppointment(date: string, id: number): void {
    if (this.appointments[date]) {
      this.appointments[date] = this.appointments[date].filter(
        (appointment) => appointment.id !== id
      );
    }
  }

  getAppointmentsForDate(date: string): Appointment[] {
    return this.appointments[date] || [];
  }

  updateAppointment(oldDate: string, updatedAppointment: Appointment, newDate: string): void {

    console.log(newDate + "NewDate") 
    console.log(updatedAppointment.time + " " + updatedAppointment.description +" " + "Edited Appointment");
    console.log(oldDate + "TEST")
    this.deleteAppointment(oldDate, updatedAppointment.id);
    this.addAppointment(newDate, updatedAppointment.time, updatedAppointment.description);
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


  updateAppointments(date: string, appointments: Appointment[]): void {
    this.appointments[date] = appointments;
  }
}
