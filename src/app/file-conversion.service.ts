import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileConversionService {
  private readonly http = inject(HttpClient);

  async convertToBase64(
    filePath: string
  ): Promise<string | ArrayBuffer | null> {
    const blob = await firstValueFrom(
      this.http.get(filePath, { responseType: 'blob' })
    );

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data.substring(base64data.indexOf(',') + 1));
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  }
}
