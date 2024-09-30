import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdeuctCategoryComponent } from './prodeuct-category.component';

describe('ProdeuctCategoryComponent', () => {
  let component: ProdeuctCategoryComponent;
  let fixture: ComponentFixture<ProdeuctCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProdeuctCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProdeuctCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
