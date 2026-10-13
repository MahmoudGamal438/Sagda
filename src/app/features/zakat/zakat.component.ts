import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-zakat',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  template: `
    <section class="page">
      <h1 class="page-title">حاسبة الزكاة</h1>
      <p class="page-sub">أداة تقديرية للنصاب النقدي فقط (2.5%). ليست فتوى. قيّم الذهب والفضة وعروض التجارة بنفسك، واستفتِ عالمًا لحالتك.</p>
      <form class="card pad">
        <label>المال الزكوي (نقد وما في حكمه)
          <input type="number" min="0" [(ngModel)]="wealth" name="wealth" />
        </label>
        <label>النصاب المعتمد لديك (قيمة 85 غرام ذهب تقريبًا)
          <input type="number" min="0" [(ngModel)]="nisab" name="nisab" />
        </label>
        @if (wealth >= nisab && nisab > 0) {
          <p>التقدير: <strong>{{ (wealth * 0.025) | number:'1.0-2' }}</strong></p>
        } @else {
          <p>لم يبلغ النصاب حسب القيم المدخلة، أو أدخل قيمًا صحيحة.</p>
        }
      </form>
    </section>
  `,
  styles: [`.pad { padding: 1rem; display: grid; gap: 0.7rem; }`]
})
export class ZakatComponent {
  wealth = 0;
  nisab = 0;
}
