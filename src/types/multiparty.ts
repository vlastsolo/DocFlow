// src/types/multiparty.d.ts
declare module 'multiparty' {
  import { IncomingMessage } from 'http';
  
  export interface File {
    fieldName: string;
    originalFilename: string;
    path: string;
    headers: Record<string, string>;
    size: number;
  }
  
  export interface Fields {
    [key: string]: string[];
  }
  
  export interface Files {
    [key: string]: File[];
  }
  
  export interface FormOptions {
    encoding?: string;
    uploadDir?: string;
    keepExtensions?: boolean;
    maxFieldsSize?: number;
    maxFields?: number;
    maxFilesSize?: number;
    autoFields?: boolean;
    autoFiles?: boolean;
  }

  export class Form {
    constructor(options?: FormOptions);
    parse(req: IncomingMessage, callback: (err: Error | null, fields: Fields, files: Files) => void): void;
  }
}