import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuranService } from '../../core/services/quran.service';
import { AudioService } from '../../core/services/audio.service';
import { SettingsService } from '../../core/services/settings.service';
import { UserDataService } from '../../core/services/user-data.service';
import { SurahDetail } from '../../core/models/quran.model';
import { StateBlockComponent } from '../../shared/state-block.component';

@Component({
  selector: 'app-quran-reader',
  standalone: true,
  imports: [RouterLink, FormsModule, StateBlockComponent],
  templateUrl: './quran-reader.component.html',
  styleUrl: './quran-reader.component.scss'
})
export class QuranReaderComponent implements OnInit {
  private route = inject(ActivatedRoute);
  readonly quran = inject(QuranService);
  readonly audio = inject(AudioService);
  readonly settings = inject(SettingsService);
  readonly user = inject(UserDataService);

  surah = signal<SurahDetail | null>(null);
  translation = signal<SurahDetail | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  jump = 1;
  note = '';
  showTools = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((p) => {
      const id = Number(p.get('id') || 1);
      void this.load(id);
    });
  }

  async load(id: number): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.quran.getSurah(id);
      this.surah.set(data);
      this.user.saveReading(id, 1);
      if (this.settings.settings().showTranslation) {
        this.translation.set(await this.quran.getSurah(id, this.settings.settings().translationEdition));
      }
    } catch {
      this.error.set('تعذر تحميل السورة. يلزم اتصال بالشبكة في أول مرة.');
    } finally {
      this.loading.set(false);
    }
  }

  font(): number {
    return this.settings.settings().quranFontSize;
  }

  changeFont(delta: number): void {
    this.settings.patch({ quranFontSize: Math.min(48, Math.max(18, this.font() + delta)) });
  }

  playAyah(n: number): void {
    const s = this.surah();
    if (!s) {
      return;
    }
    this.audio.playAyah(n, s.number);
    const ayah = s.ayahs.find((a) => a.number === n);
    if (ayah) {
      this.user.saveReading(s.number, ayah.numberInSurah);
    }
  }

  playSurah(): void {
    const s = this.surah();
    if (!s?.ayahs.length) {
      return;
    }
    this.audio.playSurah(s.number, s.ayahs[0].number, s.ayahs[s.ayahs.length - 1].number);
  }

  jumpTo(): void {
    const el = document.getElementById('ayah-' + this.jump);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  copy(text: string, surah: number, ayah: number): void {
    void navigator.clipboard.writeText(`${text}  [${surah}:${ayah}]`);
  }

  share(text: string, surah: number, ayah: number): void {
    const payload = `${text}  [${surah}:${ayah}]`;
    if (navigator.share) {
      void navigator.share({ text: payload });
    } else {
      this.copy(text, surah, ayah);
    }
  }

  saveNote(surah: number, ayah: number): void {
    if (this.note.trim()) {
      this.user.saveNote(surah, ayah, this.note.trim());
      this.note = '';
    }
  }

  trans(i: number): string {
    return this.translation()?.ayahs[i]?.text ?? '';
  }

  bismillah(s: SurahDetail): boolean {
    return s.number !== 1 && s.number !== 9;
  }
}
