import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
constructor(public loader: LoaderService){

}
}
