import { Component,inject } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { DatabaseService } from '../database-service';


@Component({
  selector: 'app-memeadd',
  imports: [Navbar, FormsModule],
  providers: [CookieService],
  templateUrl: './memeadd.html',
  styleUrl: './memeadd.css',
})
export class Memeadd {
  selectedFileBase64: String | null = null;
  title = ""
  category = ""
  cookieService = inject(CookieService)
  router = inject(Router)
  data = inject(DatabaseService)

  platformId = inject(PLATFORM_ID)

  async ngOnInit() {
    
    if (isPlatformBrowser(this.platformId)) {
    const user = this.getCookie('user');
    console.log("user")
    if (!user) {
      this.router.navigate(['/login']);
    }
    }
  }
  getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
  }
  

   onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.convertToBase64(file);
    } else {
      this.selectedFileBase64 = null;
    }
  }

  private convertToBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      // wynik to pełny Base64, np. "data:image/png;base64,iVBORw0KG..."
      this.selectedFileBase64 = e.target?.result as string;
    };
    reader.onerror = (error) => {
      console.error('Błąd konwersji:', error);
      this.selectedFileBase64 = null;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (!this.selectedFileBase64) {
      console.warn('Nie wybrano obrazu');
      return;
    }

    // Przygotuj obiekt do wysyłki (JSON)
    const payload = {
      title: this.title,
      category: this.category,
      image: this.selectedFileBase64   // pole z Base64
    };

    // Wyślij do serwisu
    this.data.addMeme(payload);
  }



}
