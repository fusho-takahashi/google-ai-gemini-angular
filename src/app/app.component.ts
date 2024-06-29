import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  GenerateContentRequest,
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  ModelParams,
  RequestOptions,
} from '@google/generative-ai';
import { environment } from '../environments/environment.development';
import { FileConversionService } from './file-conversion.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly fileConversionService = inject(FileConversionService);

  ngOnInit(): void {
    // 試したい方を uncomment
    // this.TestGeminiPro();
    // this.TestGeminiProVisionImages();
    // this.TestGeminiProChat();
  }

  async TestGeminiPro() {
    const genAI = new GoogleGenerativeAI(environment.API_KEY);
    const generationConfig: ModelParams = {
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

    const model = genAI.getGenerativeModel(generationConfig);

    const prompt = 'What is the largest number with a name ?';
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log(response.text());
  }

  async TestGeminiProVisionImages() {
    const genAI = new GoogleGenerativeAI(environment.API_KEY);
    const generationConfig: ModelParams = {
      model: 'gemini-pro-vision',
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

    const model = genAI.getGenerativeModel(generationConfig);

    try {
      let imageBase64 = await this.fileConversionService.convertToBase64(
        'assets/angular_gradient.png'
      );

      if (typeof imageBase64 !== 'string') {
        throw new Error('Image conversion to Base64 failed.');
      }

      const prompt: GenerateContentRequest = {
        contents: [
          {
            role: 'USER',
            parts: [
              {
                inlineData: {
                  mimeType: 'image/png',
                  data: imageBase64,
                },
              },
              { text: 'What logo is this?' },
            ],
          },
        ],
      };

      const result = await model.generateContent(prompt);
      const response = await result.response;
      console.log(response.text());
    } catch (e) {}
  }

  async TestGeminiProChat() {
    const genAI = new GoogleGenerativeAI(environment.API_KEY);
    const generationConfig: ModelParams = {
      model: 'gemini-pro',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
      ],
    };

    const model = genAI.getGenerativeModel(generationConfig);

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'Hi there!' }],
        },
        {
          role: 'model',
          parts: [{ text: 'Great to meet you. What would you like to know?' }],
        },
      ],
      generationConfig: {
        temperature: 0.9,
        topP: 1,
        topK: 32,
        maxOutputTokens: 100,
      },
    });

    const prompt = 'What is the largest number with a name? Brief answer.';
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    console.log(response.candidates?.[0].content.parts[0].text);
    console.log(response.text());
  }
}
