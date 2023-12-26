import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorsObjectComponent } from './moderators-object.component';

describe('ModeratorsObjectComponent', () => {
  let component: ModeratorsObjectComponent;
  let fixture: ComponentFixture<ModeratorsObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeratorsObjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeratorsObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
