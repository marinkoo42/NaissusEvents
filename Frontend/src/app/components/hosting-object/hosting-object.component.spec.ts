import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostingObjectComponent } from './hosting-object.component';

describe('HostingObjectComponent', () => {
  let component: HostingObjectComponent;
  let fixture: ComponentFixture<HostingObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostingObjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostingObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
