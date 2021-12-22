import { formatDate } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  myDate = new Date();
  currentDate: string;

  constructor() {
    this.currentDate = formatDate(new Date(), 'yyyy', 'en');
  }
}
