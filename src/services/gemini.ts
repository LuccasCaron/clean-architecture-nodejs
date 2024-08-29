import {
  FileMetadataResponse,
  GoogleAIFileManager,
} from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface IGeminiReader {
  uploadImage(
    imagePath: string,
    mimeType: string,
    displayName: string
  ): Promise<FileMetadataResponse>;

  getFileMetadata(filename: string): Promise<FileMetadataResponse>;

  generateContent(fileUri: string, prompt: string): Promise<string>;
}

export class GeminiReader implements IGeminiReader {
  private fileManager: GoogleAIFileManager;
  private generativeAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.fileManager = new GoogleAIFileManager(apiKey);
    this.generativeAI = new GoogleGenerativeAI(apiKey);
  }

  public async uploadImage(
    imagePath: string,
    mimeType: string,
    displayName: string
  ) {
    try {
      const uploadResponse = await this.fileManager.uploadFile(imagePath, {
        mimeType,
        displayName,
      });
      return uploadResponse.file;
    } catch (error: any) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  public async getFileMetadata(fileName: string) {
    try {
      const fileMetadata = await this.fileManager.getFile(fileName);
      return fileMetadata;
    } catch (error: any) {
      throw new Error(`Failed to get file metadata: ${error.message}`);
    }
  }

  public async generateContent(fileUri: string, prompt: string) {
    try {
      const model = this.generativeAI.getGenerativeModel({
        model: "gemini-1.5-pro",
      });
      const result = await model.generateContent([
        {
          fileData: {
            mimeType: "image/jpeg",
            fileUri,
          },
        },
        { text: prompt },
      ]);
      return result.response.text();
    } catch (error: any) {
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }
}
