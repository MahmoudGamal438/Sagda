import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InstallService } from '../../core/services/install.service';
import { NAV_GROUPS } from '../../core/data/nav.data';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-more',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <section class="page">
      <h1 class="page-title">المزيد</h1>
      <p class="page-sub">كل أقسام سجدة في مكان واحد.</p>

      @for (group of groups; track group.title) {
        <section class="grp">
          <h2><app-icon [name]="group.icon" /> {{ group.title }}</h2>
          <div class="grid">
            @for (item of group.items; track item.path) {
              <a class="card item" [routerLink]="item.path">
                <app-icon [name]="item.icon" />
                <span>{{ item.label }}</span>
              </a>
            }
          </div>
        </section>
      }

      @if (!install.installed()) {
        <button class="btn btn-gold install" type="button" (click)="install.openFromSettings()">
          <app-icon name="gps" /> تثبيت سجدة
        </button>
      }
    </section>
  `,
  styles: [
    `
      .grp { margin-bottom: 1.3rem; }
      .grp h2 { display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; color: var(--color-gold); margin: 0 0 0.6rem; }
      .grp h2 app-icon { width: 1.1rem; height: 1.1rem; }
      .grid { grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); }
      .item { display: flex; align-items: center; gap: 0.6rem; padding: 0.9rem 1rem; font-weight: 600; }
      .item app-icon { color: var(--color-gold); }
      .install { margin-top: 0.5rem; }
    `
  ]
})
export class MoreComponent {
  readonly install = inject(InstallService);
  readonly groups = NAV_GROUPS;
}
