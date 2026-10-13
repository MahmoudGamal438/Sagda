import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-state-block',
  standalone: true,
  template: `
    <div class="card state" [attr.data-kind]="kind">
      <strong>{{ title }}</strong>
      <p>{{ message }}</p>
      <ng-content />
    </div>
  `,
  styles: [
    `
      .state {
        padding: 1.2rem;
        text-align: center;
      }
      p {
        margin: 0.4rem 0 0;
        color: var(--color-muted);
      }
    `
  ]
})
export class StateBlockComponent {
  @Input() kind: 'loading' | 'empty' | 'error' = 'loading';
  @Input() title = '';
  @Input() message = '';
}
