import { CommonModule } from '@angular/common';
import { Component , EventEmitter, Input, Output} from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-custom-button',
  imports: [CommonModule, RouterModule],
  templateUrl: './custom-button.component.html',
  
})
export class CustomButtonComponent {

  @Input() label: string = '';
  @Input() icon?: string;          
  @Input() btnClass: string = ''; 
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled: boolean = false;

  @Output() clicked = new EventEmitter<void>();

  onClick() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
