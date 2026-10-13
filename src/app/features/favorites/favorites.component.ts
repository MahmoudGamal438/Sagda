import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserDataService } from '../../core/services/user-data.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page">
      <h1 class="page-title">المفضلة والمحفوظات</h1>
      <h2>الآيات المفضلة</h2>
      @if (!user.favorites().length) {
        <p class="muted">لا توجد آيات مفضلة بعد.</p>
      }
      @for (f of user.favorites(); track f.surah + ':' + f.ayah) {
        <a class="card pad" [routerLink]="['/quran/read', f.surah]">سورة {{ f.surah }} · آية {{ f.ayah }}</a>
      }
      <h2>العلامات</h2>
      @for (b of user.bookmarks(); track b.createdAt) {
        <div class="card pad">
          <a [routerLink]="['/quran/read', b.surah]">{{ b.label }} · {{ b.surah }}:{{ b.ayah }}</a>
          <button class="btn btn-ghost" type="button" (click)="user.removeBookmark(b.createdAt)">حذف</button>
        </div>
      }
      <h2>الملاحظات</h2>
      @for (n of user.notes(); track n.id) {
        <article class="card pad">
          <strong>{{ n.surah }}:{{ n.ayah }}</strong>
          <p>{{ n.text }}</p>
        </article>
      }
    </section>
  `,
  styles: [`
    .pad { display: block; padding: 0.9rem; margin: 0.5rem 0; }
    h2 { margin-top: 1.2rem; }
  `]
})
export class FavoritesComponent {
  readonly user = inject(UserDataService);
}
