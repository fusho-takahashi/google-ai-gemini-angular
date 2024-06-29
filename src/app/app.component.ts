import { Component, OnInit, model } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  ModelParams,
} from '@google/generative-ai';
import { environment } from '../environments/environment.development';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  genAI = new GoogleGenerativeAI(environment.API_KEY);
  generationConfig: ModelParams = {
    model: 'gemini-pro',
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
    ],
    generationConfig: {
      temperature: 0.9,
      topP: 1,
      topK: 32,
      maxOutputTokens: 100,
    },
  };

  geminiModel = this.genAI.getGenerativeModel(this.generationConfig);

  chat = this.geminiModel.startChat({
    generationConfig: {
      temperature: 0.9,
      topP: 1,
      topK: 32,
      maxOutputTokens: 100,
    },
  });

  messages: string[] = [];
  message = model('');

  async sendMessage(): Promise<void> {
    const userInputText = this.message();
    if (userInputText === '') {
      return;
    }

    this.messages.push(`USER: ${userInputText}`);

    const result = await this.chat.sendMessage(userInputText);
    const response = await result.response;
    this.messages.push(`Gemini: ${response.text()}`);
    this.message.set('');
  }
}
