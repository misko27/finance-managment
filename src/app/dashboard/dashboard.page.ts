import { Component, OnInit, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../services/transaction.service';
import { AddExpenseFormComponent } from '../expenses/add-expense-form/add-expense-form.component';
import { CategoryService } from '../services/category.service';
import { Transaction } from '../models/transaction.model';

interface MonthSummary {
  income: number;
  expenses: number;
  balance: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule],
})
export class DashboardPage implements OnInit {
  currentMonth = new Date().toLocaleDateString('sk-SK', {
    month: 'long',
    year: 'numeric',
  });
  monthlySummary: MonthSummary = { income: 0, expenses: 0, balance: 0 };
  upcomingPayments: any[] = [];
  latestTransactions: any[] = [];
  categoryBudgets: any[] = [];
  Math = Math; // Potrebné pre použitie Math.abs v HTML templatoch

  // Použitie inject namiesto konštruktora
  private transactionService = inject(TransactionService);
  private categoryService = inject(CategoryService);
  private modalController = inject(ModalController);

  ngOnInit() {
    this.loadMonthlySummary();
    this.loadUpcomingPayments();
    this.loadLatestTransactions();
    this.loadCategoryBudgets();

    // Prihlásenie sa na zmeny transakcií
    this.transactionService.transactions.subscribe(
      (transactions: Transaction[]) => {
        this.loadMonthlySummary();
        this.loadLatestTransactions();
        this.loadCategoryBudgets();
      }
    );
  }

  async loadMonthlySummary() {
    const now = new Date();
    const balance = await this.transactionService.getMonthlyBalance(
      now.getFullYear(),
      now.getMonth()
    );

    this.monthlySummary = balance;
  }

  async loadUpcomingPayments() {
    // Tu by sme v reálnej aplikácii načítali opakujúce sa platby
    // Pre demo použijeme simulované dáta
    this.upcomingPayments = [
      { name: 'Nájomné', date: new Date(2025, 3, 1), amount: 450 },
      { name: 'Energie', date: new Date(2025, 3, 15), amount: 85 },
      { name: 'Internet', date: new Date(2025, 3, 20), amount: 25 },
    ];
  }

  async loadLatestTransactions() {
    const now = new Date();
    const transactions = await this.transactionService.getMonthlyTransactions(
      now.getFullYear(),
      now.getMonth()
    );

    // Zoradiť podľa dátumu (najnovšie prvé) a vziať prvých 5
    this.latestTransactions = transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map((transaction) => {
        const category = this.categoryService
          .getDefaultCategories()
          .find((c) => c.id === transaction.categoryId);

        return {
          ...transaction,
          categoryName: category?.name || 'Neznáma kategória',
          categoryColor: category?.color || '#cccccc',
          isExpense: transaction.amount < 0,
        };
      });
  }

  async loadCategoryBudgets() {
    const now = new Date();
    const expensesMap =
      await this.transactionService.getTotalExpensesByCategory(
        now.getFullYear(),
        now.getMonth()
      );

    const categories = this.categoryService.getDefaultCategories();

    this.categoryBudgets = categories
      .filter((category) => category.budgetLimit && category.budgetLimit > 0)
      .map((category) => {
        const spent = expensesMap[category.id] || 0;
        const limit = category.budgetLimit || 0;
        const percentage = limit > 0 ? (spent / limit) * 100 : 0;

        return {
          category,
          spent,
          limit,
          percentage: Math.min(percentage, 100),
          isOverBudget: percentage > 100,
        };
      })
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);
  }

  async openAddExpenseModal() {
    const modal = await this.modalController.create({
      component: AddExpenseFormComponent,
    });

    await modal.present();
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('sk-SK', {
      day: 'numeric',
      month: 'long',
    });
  }
}
