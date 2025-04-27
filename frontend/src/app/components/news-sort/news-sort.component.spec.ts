import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsSortComponent } from './news-sort.component';

describe('NewsComponentComponent', () => {
  let component: NewsSortComponent;
  let fixture: ComponentFixture<NewsSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsSortComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
