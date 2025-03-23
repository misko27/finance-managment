import { Component, OnInit, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddExpenseFormComponent } from './add-expense-form/add-expense-form.component';
import { TransactionService } from '../services/transaction.service';
import { CategoryService } from '../services/category.service';
import { Transaction } from '../models/transaction.model';
import { ExpenseCategory } from '../models/expense-category.model';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.page.html',
  styleUrls: ['./expenses.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class ExpensesPage implements OnInit {
  expenses: Transaction[] = [];
  categories: ExpenseCategory[] = [];
  categoryMap: Map<string, ExpenseCategory> = new Map();
  groupedExpenses: { date: string; items: Transaction[] }[] = [];
  Math = Math; // Sprístupnenie Math objektu pre šablónu

  // Použitie inject() namiesto konštruktora
  private modalController = inject(ModalController);
  private transactionService = inject(TransactionService);
  private categoryService = inject(CategoryService);

  ngOnInit() {
    this.loadCategories();
    this.loadExpenses();

    // Subscribe to transaction changes s explicitným typom
    this.transactionService.transactions.subscribe(
      (transactions: Transaction[]) => {
        // Filter for expenses only (negative amounts)
        this.expenses = transactions.filter((t: Transaction) => t.amount < 0);
        this.groupExpensesByDate();
      }
    );
  }

  loadCategories() {
    this.categories = this.categoryService.getDefaultCategories();

    // Create a map for easier lookup
    this.categories.forEach((category) => {
      this.categoryMap.set(category.id, category);
    });
  }

  async loadExpenses() {
    // Get current month's expenses
    const now = new Date();
    const transactions = await this.transactionService.getMonthlyTransactions(
      now.getFullYear(),
      now.getMonth()
    );

    // Filter for expenses only (negative amounts)
    this.expenses = transactions.filter((t: Transaction) => t.amount < 0);
    this.groupExpensesByDate();
  }

  groupExpensesByDate() {
    // Group expenses by date
    const groupedByDate: { [date: string]: Transaction[] } = {};

    this.expenses.forEach((expense) => {
      const dateStr = new Date(expense.date).toISOString().split('T')[0];

      if (!groupedByDate[dateStr]) {
        groupedByDate[dateStr] = [];
      }

      groupedByDate[dateStr].push(expense);
    });

    // Convert to array and sort by date (newest first)
    this.groupedExpenses = Object.keys(groupedByDate)
      .map((date) => ({
        date,
        items: groupedByDate[date].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getCategoryName(categoryId: string): string {
    return this.categoryMap.get(categoryId)?.name || 'Neznáma kategória';
  }

  getCategoryColor(categoryId: string): string {
    return this.categoryMap.get(categoryId)?.color || '#cccccc';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('sk-SK', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }

  async openAddExpenseModal() {
    const modal = await this.modalController.create({
      component: AddExpenseFormComponent,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.success) {
      // Reload expenses (though this should happen automatically via subscription)
      this.loadExpenses();
    }
  }

  async deleteExpense(id: string) {
    await this.transactionService.deleteTransaction(id);
  }
}
