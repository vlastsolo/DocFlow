// types/yandex-vision.ts
export interface YandexVisionVertex {
  x?: string;
  y?: string;
}

export interface YandexVisionBoundingBox {
  vertices?: YandexVisionVertex[];
}

export interface YandexVisionWord {
  boundingBox?: YandexVisionBoundingBox;
  text?: string;
  entityIndex?: string;
  textSegments?: Array<{ startIndex: string; length: string }>;
}

export interface YandexVisionLine {
  boundingBox?: YandexVisionBoundingBox;
  text?: string;
  words?: YandexVisionWord[];
  textSegments?: Array<{ startIndex: string; length: string }>;
  orientation?: string;
}

export interface YandexVisionBlock {
  boundingBox?: YandexVisionBoundingBox;
  lines?: YandexVisionLine[];
  languages?: Array<{ languageCode: string }>;
  textSegments?: Array<{ startIndex: string; length: string }>;
  layoutType?: string;
}

export interface YandexVisionPage {
  blocks?: YandexVisionBlock[];
  fullText?: string;
}

export interface YandexVisionTextAnnotation {
  width?: string;
  height?: string;
  blocks?: YandexVisionBlock[];
  entities?: any[];
  tables?: any[];
  fullText?: string;
  rotate?: string;
  markdown?: string;
  pictures?: any[];
  pages?: YandexVisionPage[];
}

export interface YandexVisionResult {
  textAnnotation?: YandexVisionTextAnnotation;
  page?: string;
}

export interface YandexVisionResponse {
  result?: YandexVisionResult;
}