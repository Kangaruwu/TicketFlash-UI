import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClass" [style.padding]="padding">
      <ng-content />
    </div>
  `
})
export class UiCardComponent {
  @Input() hover = false;
  @Input() padding = '0';

  get cardClass(): string {
    return this.hover ? 'tf-card tf-card-hover' : 'tf-card';
  }
}
