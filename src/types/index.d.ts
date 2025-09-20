
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
        extractedText?: string;
        aiAnalysis?: Partial<OrganizationData>;
        createdOrganization?: any;
      };
      formFields?: any;
      organizations?: Organization[];
    }
  }
}

export {};