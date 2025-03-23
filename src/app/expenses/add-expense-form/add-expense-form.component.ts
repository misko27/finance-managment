import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { TransactionService } from '../../services/transaction.service';
import { ExpenseCategory } from '../../models/expense-category.model';
import { Transaction } from 'src/app/models/transaction.model';
import { RecurrenceType } from 'src/app/models/recurrence.model';

@Component({
  selector: 'app-add-expense-form',
  templateUrl: './add-expense-form.component.html',
  styleUrls: ['./add-expense-form.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class AddExpenseFormComponent implements OnInit {
  expenseForm: FormGroup;
  categories: ExpenseCategory[] = [];
  showRecurringOptions = false;

  // Použitie inject() namiesto konštruktora
  private formBuilder = inject(FormBuilder);
  private modalController = inject(ModalController);
  private categoryService = inject(CategoryService);
  private transactionService = inject(TransactionService);

  constructor() {
    this.expenseForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required],
      date: [new Date().toISOString(), Validators.required],
      categoryId: ['', Validators.required],
      isRecurring: [false],
      recurrenceType: [''],
      interval: [1],
      endDate: [''],
      paymentMethod: [''],
      location: [''],
    });
  }

  ngOnInit() {
    this.categories = this.categoryService.getDefaultCategories();

    // Sledovanie zmien v poli isRecurring
    this.expenseForm.get('isRecurring')?.valueChanges.subscribe((value) => {
      this.showRecurringOptions = value;

      if (value) {
        this.expenseForm
          .get('recurrenceType')
          ?.setValidators(Validators.required);
        this.expenseForm
          .get('interval')
          ?.setValidators([Validators.required, Validators.min(1)]);
      } else {
        this.expenseForm.get('recurrenceType')?.clearValidators();
        this.expenseForm.get('interval')?.clearValidators();
      }

      this.expenseForm.get('recurrenceType')?.updateValueAndValidity();
      this.expenseForm.get('interval')?.updateValueAndValidity();
    });
  }

  async onSubmit() {
    if (this.expenseForm.invalid) {
      return;
    }

    const formValue = this.expenseForm.value;

    // Výdavky ukladáme so zápornou hodnotou
    const amount = -Math.abs(formValue.amount);

    let transactionData: Partial<Transaction> = {
      amount,
      description: formValue.description,
      date: new Date(formValue.date),
      categoryId: formValue.categoryId,
      paymentMethod: formValue.paymentMethod,
      location: formValue.location,
      isRecurring: formValue.isRecurring,
    };

    if (formValue.isRecurring) {
      transactionData.recurrencePattern = {
        type: formValue.recurrenceType as RecurrenceType,
        interval: formValue.interval,
        endDate: formValue.endDate ? new Date(formValue.endDate) : undefined,
      };
    }

    await this.transactionService.addTransaction(
      transactionData as Omit<Transaction, 'id'>
    );
    this.dismissModal(true);
  }

  dismissModal(success = false) {
    this.modalController.dismiss({
      success,
    });
  }
}
