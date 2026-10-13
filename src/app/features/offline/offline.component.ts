import { Component, inject } from '@angular/core';
import { UserDataService } from '../../core/services/user-data.service';

@Component({
  selector: 'app-offline',
  standalone: true,
  template: `
    <section class="page">
      <h1 class="page-title">العمل دون اتصال</h1>
      <p>الحالة الحالية: {{ user.online() ? 'متصل' : 'غير متصل' }}</p>
      <ul>
        <li>متاح محليًا: الواجهة، الإعدادات، المفضلة، المسبحة، تقدم الأذكار، آخر موضع قراءة، آخر مواقيت حُفظت.</li>
        <li>يحتاج شبكة: أول تحميل للسور، التلاوات، البحث في القرآن، تحديث المواقيت.</li>
      </ul>
    </section>
  `
})
export class OfflineComponent {
  readonly user = inject(UserDataService);
}
