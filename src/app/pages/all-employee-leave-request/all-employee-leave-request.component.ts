import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CustomButtonComponent } from 'src/app/shared/custom-button/custom-button.component';

@Component({
  selector: 'app-all-employee-leave-request',
  standalone: true,
  imports: [CommonModule, DatePipe, CustomButtonComponent],
  templateUrl: './all-employee-leave-request.component.html',
  // styleUrls: ['./all-employee-leave-request.component.css']
})
export class AllEmployeeLeaveRequestComponent {

  @Input() uniqueEmployees: any[] = [];
  @Input() selectedEmployeeRequests: any[] = [];
  @Input() selectedEmployeeName = '';

  @Output() openEmployee = new EventEmitter<number>();
  @Output() goBack = new EventEmitter<void>();
}
