import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Appointment, AppointmentService } from '../services/appointment.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    DragDropModule,
    RouterModule,
  ]
})
export class CalendarComponent implements OnInit {
  currentMonth: number;
  currentYear: number;
  daysOfWeek: string[];
  calendarDates: (number | null)[] = [];
  monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  selectedDate: string | null = null;
  appointmentForm: FormGroup;
  isEditing: boolean = false;
  editingAppointmentId: number | null = null;

  constructor(private fb: FormBuilder, private appointmentService: AppointmentService) {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    this.appointmentForm = this.fb.group({
      time: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    
    this.calendarDates = Array(firstDay).fill(null).concat(
      Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );
  }

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  selectDate(date: number | null) {
    if (date === null) {
      this.selectedDate = null;
      return;
    }
    this.selectedDate = `${this.currentYear}-${this.currentMonth + 1}-${date}`;
    this.isEditing = false;
    this.editingAppointmentId = null;
    this.appointmentForm.reset();
  }

  getAppointmentsForDate(date: string): Appointment[] {
    return this.appointmentService.getAppointments(date);
  }

  addAppointment() {
    if (this.selectedDate && this.appointmentForm.valid) {
      const { time, description, period } = this.appointmentForm.value;
      const id = this.isEditing && this.editingAppointmentId !== null ? this.editingAppointmentId : new Date().getTime();
      const selectedDateObj = new Date(this.selectedDate);
      
      const addSingleAppointment = (date: Date) => {
        this.appointmentService.addAppointment(date.toISOString().split('T')[0], { id, time, description, views: 0 });
      };

      if (period === 'none') {
        addSingleAppointment(selectedDateObj);
      } else if (period === 'daily') {
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        for (let day = selectedDateObj.getDate(); day <= daysInMonth; day++) {
          const date = new Date(this.currentYear, this.currentMonth, day);
          addSingleAppointment(date);
        }
      } else if (period === 'weekly') {
        for (let i = 0; i < 4; i++) {
          const date = new Date(selectedDateObj);
          date.setDate(date.getDate() + i * 7);
          if (date.getMonth() === this.currentMonth) {
            addSingleAppointment(date);
          }
        }
      } else if (period === 'monthly') {
        for (let i = 0; i < 3; i++) {
          const date = new Date(selectedDateObj);
          date.setMonth(date.getMonth() + i);
          addSingleAppointment(date);
        }
      }

      this.appointmentForm.reset();
    }
  }


  deleteAppointment(date: string, id: number) {
    this.appointmentService.deleteAppointment(date, id);
  }

  moveAppointment(date: string, id: number, newTime: string) {
    const appointment = this.appointmentService.getAppointment(date, id);
    if (appointment) {
      this.appointmentService.updateAppointment(date, { ...appointment, time: newTime });
    }
  }

  editAppointment(date: string, id: number) {
    const appointment = this.appointmentService.getAppointment(date, id);
    if (appointment) {
      this.isEditing = true;
      this.editingAppointmentId = id;
      this.selectedDate = date;
      this.appointmentForm.setValue({ time: appointment.time, description: appointment.description });
    }
  }
}
