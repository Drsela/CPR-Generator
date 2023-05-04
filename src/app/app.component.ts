import { Component, OnInit, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public cprForm = new FormGroup({
    day: new FormControl(new Date().getDate(), [
      Validators.required,
      Validators.pattern(/^(?:[1-9]|[12]\d|3[01])$/),
    ]),
    month: new FormControl(new Date().getMonth() + 1, [
      Validators.required,
      Validators.pattern(/^(?:[1-9]|1[0-2])$/),
    ]),
    year: new FormControl(new Date().getFullYear(), [
      Validators.required,
      Validators.pattern(/^\d{4}$/),
    ]),
  });
  public validCprs = signal<string[]>([]);
  public maleCprs = computed(() =>
    this.validCprs().filter(
      (cpr) => !this.isEven(parseInt(cpr[cpr.length - 1]))
    )
  );
  public femaleCprs = computed(() =>
    this.validCprs().filter((cpr) => this.isEven(parseInt(cpr[cpr.length - 1])))
  );

  randomize() {
    this.cprForm.controls.day.setValue(Math.floor(Math.random() * 31) + 1);
    this.cprForm.controls.month.setValue(Math.floor(Math.random() * +12) + 1);
    this.cprForm.controls.year.setValue(
      Math.floor(Math.random() * (200 + 1)) + 1900
    );
    this.generateCPRNumbers();
  }

  reset() {
    this.cprForm.reset();
    this.cprForm.markAllAsTouched();
    this.validCprs.set([]);
  }

  isEven(lastNum: number) {
    return lastNum % 2 == 0;
  }

  generateCPRNumbers(): void {
    if (this.cprForm.invalid) {
      return;
    }
    this.validCprs.set([]);
    let cprNumbers = [];

    // Generate a random day, month, and year
    const day = this.cprForm.value.day as number;
    const month = this.cprForm.value.month as number;
    const year = this.cprForm.value.year as number;
    const weights = [4, 3, 2, 7, 6, 5, 4, 3, 2, 1];

    for (let personalId = 0; personalId < 10000; personalId++) {
      // Combine the day, month, year, and personal identification number
      let cprNumber = '';
      cprNumber += day.toString().padStart(2, '0');
      cprNumber += month.toString().padStart(2, '0');
      cprNumber += year.toString().slice(-2);
      cprNumber += personalId.toString().padStart(4, '0');

      // Calculate the check digit
      let sum = 0;
      for (let i = 0; i < cprNumber.length; i++) {
        const digit = parseInt(cprNumber[i]);
        const weight = weights[i];
        sum += digit * weight;
      }
      const remainder = sum % 11;
      const valid = remainder === 0;
      if (valid) {
        cprNumbers.push(
          `${cprNumber.slice(0, cprNumber.length - 4)}-${cprNumber.slice(
            cprNumber.length - 4
          )}`
        );
      }
    }
    this.validCprs.set(cprNumbers);
  }
}
