import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddExpenseFormComponent } from './add-expense-form.component';

describe('AddExpenseFormComponent', () => {
  let component: AddExpenseFormComponent;
  let fixture: ComponentFixture<AddExpenseFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AddExpenseFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddExpenseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
