import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormAppointmentComponent } from '../form-appointment/form-appointment.component';
import { Appointment } from '../form-appointment/appointment.model';
import { AppointmentService } from '../service/appointment.service';
import { EditAppointmentComponent } from '../edit-appointment/edit-appointment.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    FormAppointmentComponent,
    EditAppointmentComponent,
    MatNativeDateModule,
    MatDatepickerModule,
    DragDropModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  selectedDate: string | null = null;
  editingAppointment: Appointment | null = null;
  daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
  monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  calendarDates: (number | null)[] = [];
  hours: string[] = [];

  constructor(private appointmentService: AppointmentService) {
    this.loadCalendar();
    this.generateHours();
  }

  loadCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    this.calendarDates = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  }

  generateHours() {
    this.hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  }

  hasAppointment(hour: string): boolean {
    if (!this.selectedDate) return false;
    return this.getAppointmentsForHour(hour).length > 0;
  }

  getAppointmentsForHour(hour: string): Appointment[] {
    if (!this.selectedDate) return [];
    const appointments = this.appointmentService.getAppointmentsForDate(this.selectedDate);
    console.log(appointments.filter(appointment => appointment.time.startsWith(hour)));
    return appointments.filter(appointment => appointment.time.startsWith(hour));
  }

  selectDate(date: number | null) {
    if (date !== null) {
      this.selectedDate = `${this.currentYear}-${this.currentMonth + 1}-${date}`;
    } else {
      this.selectedDate = null;
    }
  }

  deleteAppointment(date: string, id: number) {
    this.appointmentService.deleteAppointment(date, id);
  }

  getAppointmentsForDate(date: string): Appointment[] {
    return this.appointmentService.getAppointmentsForDate(date);
  }

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.loadCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.loadCalendar();
  }

  drop(event: CdkDragDrop<Appointment[]>) {
    if (this.selectedDate) {
      const appointments = this.getAppointmentsForDate(this.selectedDate);
      moveItemInArray(appointments, event.previousIndex, event.currentIndex);
      this.appointmentService.updateAppointments(this.selectedDate, appointments);
    }
  }

  startEditing(date: string, appointment: Appointment) {
    this.editingAppointment = { ...appointment };
    console.log(appointment);
  }

  handleAppointmentUpdated() {
    this.editingAppointment = null;
  }

  handleEditCancelled() {
    this.editingAppointment = null;
  }

  drop2(event: CdkDragDrop<Appointment[]>, targetHour: string) {
    const appointments = this.getAppointmentsForHour(targetHour);
    
    if (event.previousContainer === event.container) {
      moveItemInArray(appointments, event.previousIndex, event.currentIndex);
    } else {
      const appointment = event.previousContainer.data[event.previousIndex];
      const targetDate = this.selectedDate!;

      this.appointmentService.updateAppointment(
        targetDate, 
        { ...appointment, time: `${targetHour}:${appointment.time.split(':')[1]}` }, 
        targetDate
      );
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }

    this.appointmentService.updateAppointments(this.selectedDate!, appointments);
  }
}
