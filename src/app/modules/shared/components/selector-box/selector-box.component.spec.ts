import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorBoxComponent } from './selector-box.component';

describe('SelectorBoxComponent', () => {
  let component: SelectorBoxComponent;
  let fixture: ComponentFixture<SelectorBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectorBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectorBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
