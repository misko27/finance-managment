// test.page.ts
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  template: '<ion-content><h1>Test page works!</h1></ion-content>',
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class TestPage {
  constructor() {
    console.log('TestPage constructor executed');
  }
}
