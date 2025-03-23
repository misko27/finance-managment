import { Injectable, inject } from '@angular/core';
import { ExpenseCategory } from '../models/expense-category.model';
import { StorageService } from './storage.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private CATEGORIES_KEY = 'financial-app-categories';
  private _categories = new BehaviorSubject<ExpenseCategory[]>([]);

  // Použitie inject() namiesto konštruktora
  private storageService = inject(StorageService);

  private defaultCategories: ExpenseCategory[] = [
    // Základné životné potreby
    {
      id: 'byvanie',
      name: 'Bývanie',
      icon: 'home',
      color: '#3880ff',
      budgetLimit: 500,
    },
    {
      id: 'potraviny',
      name: 'Potraviny',
      icon: 'nutrition',
      color: '#5260ff',
      budgetLimit: 300,
    },
    {
      id: 'energie',
      name: 'Energie',
      icon: 'flash',
      color: '#2dd36f',
      budgetLimit: 120,
    },
    {
      id: 'internet_telefon',
      name: 'Internet a telefón',
      icon: 'wifi',
      color: '#ffc409',
      budgetLimit: 50,
    },

    // Doprava
    {
      id: 'pohonne_hmoty',
      name: 'Pohonné hmoty',
      icon: 'car',
      color: '#eb445a',
      budgetLimit: 100,
    },
    { id: 'mhd', name: 'MHD', icon: 'bus', color: '#92949c', budgetLimit: 30 },
    {
      id: 'auto_udrzba',
      name: 'Údržba auta',
      icon: 'construct',
      color: '#222428',
      budgetLimit: 50,
    },

    // Zdravie a osobná starostlivosť
    {
      id: 'zdravie',
      name: 'Zdravie',
      icon: 'medkit',
      color: '#3dc2ff',
      budgetLimit: 50,
    },
    {
      id: 'oblecenie',
      name: 'Oblečenie',
      icon: 'shirt',
      color: '#5260ff',
      budgetLimit: 80,
    },
    {
      id: 'kozmetika',
      name: 'Kozmetika',
      icon: 'color-palette',
      color: '#ffc409',
      budgetLimit: 40,
    },

    // Zábava a voľný čas
    {
      id: 'restauracie',
      name: 'Reštaurácie',
      icon: 'restaurant',
      color: '#eb445a',
      budgetLimit: 100,
    },
    {
      id: 'zabava',
      name: 'Zábava',
      icon: 'film',
      color: '#222428',
      budgetLimit: 80,
    },
    {
      id: 'sport',
      name: 'Šport',
      icon: 'football',
      color: '#2dd36f',
      budgetLimit: 50,
    },
    {
      id: 'dovolenka',
      name: 'Dovolenka',
      icon: 'airplane',
      color: '#3880ff',
      budgetLimit: 150,
    },

    // Finančné výdavky
    {
      id: 'danova_povinnost',
      name: 'Dane',
      icon: 'document-text',
      color: '#eb445a',
      budgetLimit: 0,
    },
    {
      id: 'poistenie',
      name: 'Poistenie',
      icon: 'shield',
      color: '#3880ff',
      budgetLimit: 50,
    },
    {
      id: 'uvery_splatky',
      name: 'Úvery a splátky',
      icon: 'card',
      color: '#eb445a',
      budgetLimit: 200,
    },

    // Ostatné
    {
      id: 'dary',
      name: 'Dary',
      icon: 'gift',
      color: '#5260ff',
      budgetLimit: 30,
    },
    {
      id: 'vzdelavanie',
      name: 'Vzdelávanie',
      icon: 'school',
      color: '#2dd36f',
      budgetLimit: 50,
    },
    {
      id: 'detske_potreby',
      name: 'Detské potreby',
      icon: 'happy',
      color: '#ffc409',
      budgetLimit: 80,
    },
    {
      id: 'ine',
      name: 'Iné',
      icon: 'ellipsis-horizontal',
      color: '#92949c',
      budgetLimit: 50,
    },
  ];

  constructor() {
    this.loadCategories();
  }

  get categories(): Observable<ExpenseCategory[]> {
    return this._categories.asObservable();
  }

  private async loadCategories() {
    // Najprv skúsiť načítať používateľské kategórie
    let storedCategories = await this.storageService.get(this.CATEGORIES_KEY);

    // Ak neexistujú, použiť predvolené
    if (!storedCategories || storedCategories.length === 0) {
      storedCategories = this.defaultCategories;
      await this.storageService.set(this.CATEGORIES_KEY, storedCategories);
    }

    this._categories.next(storedCategories);
  }

  getDefaultCategories(): ExpenseCategory[] {
    return this._categories.value.length > 0
      ? this._categories.value
      : this.defaultCategories;
  }

  async addCategory(category: Omit<ExpenseCategory, 'id'>) {
    const currentCategories = this._categories.value;

    // Vytvorenie ID z názvu (lowercase, bez diakritiky, medzery nahradené _)
    const id = category.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');

    const newCategory: ExpenseCategory = {
      ...category,
      id,
    };

    const updatedCategories = [...currentCategories, newCategory];
    await this.storageService.set(this.CATEGORIES_KEY, updatedCategories);
    this._categories.next(updatedCategories);

    return newCategory;
  }

  async updateCategory(updatedCategory: ExpenseCategory) {
    const currentCategories = this._categories.value;
    const index = currentCategories.findIndex(
      (c) => c.id === updatedCategory.id
    );

    if (index !== -1) {
      currentCategories[index] = updatedCategory;
      await this.storageService.set(this.CATEGORIES_KEY, currentCategories);
      this._categories.next(currentCategories);
      return updatedCategory;
    }

    throw new Error('Category not found');
  }

  async deleteCategory(id: string) {
    const currentCategories = this._categories.value;

    // Nepovoliť vymazanie, ak ide o predvolenú kategóriu
    if (this.defaultCategories.some((c) => c.id === id)) {
      throw new Error('Cannot delete default category');
    }

    const updatedCategories = currentCategories.filter((c) => c.id !== id);
    await this.storageService.set(this.CATEGORIES_KEY, updatedCategories);
    this._categories.next(updatedCategories);
  }

  async updateBudgetLimit(categoryId: string, limit: number) {
    const currentCategories = this._categories.value;
    const index = currentCategories.findIndex((c) => c.id === categoryId);

    if (index !== -1) {
      currentCategories[index] = {
        ...currentCategories[index],
        budgetLimit: limit,
      };

      await this.storageService.set(this.CATEGORIES_KEY, currentCategories);
      this._categories.next(currentCategories);
      return currentCategories[index];
    }

    throw new Error('Category not found');
  }
}
