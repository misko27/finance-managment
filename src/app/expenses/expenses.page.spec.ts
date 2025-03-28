import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpensesPage } from './expenses.page';

describe('ExpensesPage', () => {
  let component: ExpensesPage;
  let fixture: ComponentFixture<ExpensesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ExpensesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
