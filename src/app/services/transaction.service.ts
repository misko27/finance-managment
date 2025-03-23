import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { Transaction } from '../models/transaction.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid'; // Budete musieť nainštalovať: npm install uuid

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private TRANSACTIONS_KEY = 'financial-app-transactions';
  private _transactions = new BehaviorSubject<Transaction[]>([]);

  // Použitie inject() namiesto konštruktora
  private storageService = inject(StorageService);

  constructor() {
    this.loadTransactions();
  }

  get transactions(): Observable<Transaction[]> {
    return this._transactions.asObservable();
  }

  private async loadTransactions() {
    const storedTransactions =
      (await this.storageService.get(this.TRANSACTIONS_KEY)) || [];
    this._transactions.next(storedTransactions);
  }

  private async saveTransactions(transactions: Transaction[]) {
    await this.storageService.set(this.TRANSACTIONS_KEY, transactions);
    this._transactions.next(transactions);
  }

  async addTransaction(transaction: Omit<Transaction, 'id'>) {
    const currentTransactions = this._transactions.value;
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
    };

    const updatedTransactions = [...currentTransactions, newTransaction];
    await this.saveTransactions(updatedTransactions);
    return newTransaction;
  }

  async updateTransaction(updatedTransaction: Transaction) {
    const currentTransactions = this._transactions.value;
    const index = currentTransactions.findIndex(
      (t) => t.id === updatedTransaction.id
    );

    if (index !== -1) {
      currentTransactions[index] = updatedTransaction;
      await this.saveTransactions(currentTransactions);
      return updatedTransaction;
    }

    throw new Error('Transaction not found');
  }

  async deleteTransaction(id: string) {
    const currentTransactions = this._transactions.value;
    const updatedTransactions = currentTransactions.filter((t) => t.id !== id);

    await this.saveTransactions(updatedTransactions);
  }

  async getTransactionsByCategory(categoryId: string): Promise<Transaction[]> {
    const currentTransactions = this._transactions.value;
    return currentTransactions.filter((t) => t.categoryId === categoryId);
  }

  async getTransactionsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    const currentTransactions = this._transactions.value;
    return currentTransactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }

  async getMonthlyTransactions(
    year: number,
    month: number
  ): Promise<Transaction[]> {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);
    return this.getTransactionsByDateRange(startDate, endDate);
  }

  async getTotalExpensesByCategory(
    year: number,
    month: number
  ): Promise<Record<string, number>> {
    const monthlyTransactions = await this.getMonthlyTransactions(year, month);

    // Zoskupiť podľa kategórie a sčítať výdavky
    const expensesByCategory: Record<string, number> = {};

    monthlyTransactions.forEach((transaction) => {
      if (transaction.amount < 0) {
        // Výdavky sú záporné
        const categoryId = transaction.categoryId;
        if (!expensesByCategory[categoryId]) {
          expensesByCategory[categoryId] = 0;
        }
        expensesByCategory[categoryId] += Math.abs(transaction.amount);
      }
    });

    return expensesByCategory;
  }

  async getMonthlyBalance(
    year: number,
    month: number
  ): Promise<{ income: number; expenses: number; balance: number }> {
    const monthlyTransactions = await this.getMonthlyTransactions(year, month);

    let income = 0;
    let expenses = 0;

    monthlyTransactions.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      } else {
        expenses += Math.abs(transaction.amount);
      }
    });

    return {
      income,
      expenses,
      balance: income - expenses,
    };
  }
}
