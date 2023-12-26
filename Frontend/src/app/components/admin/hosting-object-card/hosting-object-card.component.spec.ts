import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostingObjectCardComponent } from './hosting-object-card.component';

describe('HostingObjectCardComponent', () => {
  let component: HostingObjectCardComponent;
  let fixture: ComponentFixture<HostingObjectCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostingObjectCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostingObjectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
