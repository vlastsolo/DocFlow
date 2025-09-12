
import { Organization } from '../../entities/Organization';



declare global {
  namespace Express {
    interface Request {
      organizations?: Organization[];
      fileInfo?: {
        originalName: string;
        fileName: string;
        filePath: string;
        size: number;
        mimetype: string;
      };
      formFields?: any;
    }
  }
}

export {};