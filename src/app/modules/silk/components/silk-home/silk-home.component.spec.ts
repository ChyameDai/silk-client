import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SilkHomeComponent } from './silk-home.component';

describe('SilkHomeComponent', () => {
  let component: SilkHomeComponent;
  let fixture: ComponentFixture<SilkHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SilkHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SilkHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
