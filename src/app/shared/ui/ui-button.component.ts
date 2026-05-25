import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [attr.type]="type"
      [disabled]="disabled"
      [class]="buttonClass"
      (click)="pressed.emit()">
      <ng-content />
    </button>
  `
})
export class UiButtonComponent {
  @Input() variant: 'ink' | 'ghost' = 'ink';
  @Input() size: 'md' | 'sm' = 'md';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;

  @Output() pressed = new EventEmitter<void>();

  get buttonClass(): string {
    const classes = ['tf-btn'];
    classes.push(this.variant === 'ghost' ? 'tf-btn-ghost' : 'tf-btn-ink');
    if (this.size === 'sm') {
      classes.push('tf-btn-sm');
    }
    return classes.join(' ');
  }
}
