// config/api.config.ts
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

// Схемы для валидации
const yandexVisionSchema = z.object({
  apiKey: z.string().min(1, 'YANDEX_VISION_API_KEY is required'),
  folderId: z.string().min(1, 'YANDEX_FOLDER_ID is required'),
  apiUrl: z.string().url().default('https://vision.api.cloud.yandex.net/vision/v1/batchAnalyze')
});

const deepSeekSchema = z.object({
  apiKey: z.string().min(1, 'DEEP_SEEK_API_KEY is required'),
  apiUrl: z.string().url().default('https://vision.api.cloud.yandex.net/vision/v1/batchAnalyze')
});

// Валидируем конфигурацию
export const YANDEX_VISION_CONFIG = yandexVisionSchema.parse({
  apiKey: process.env.YANDEX_VISION_API_KEY,
  folderId: process.env.YANDEX_FOLDER_ID,
  apiUrl: process.env.YANDEX_VISION_API_URL
});

export const DEEP_SEEK_CONFIG = deepSeekSchema.parse({
  apiKey: process.env.DEEP_SEEK_API_KEY,
  apiUrl: process.env.DEEP_SEEK_API_URL
});

export type YandexVisionConfig = z.infer<typeof yandexVisionSchema>;
export type DeepSeekConfig = z.infer<typeof deepSeekSchema>;