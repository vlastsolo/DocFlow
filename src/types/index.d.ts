
import { Organization } from '../../entities/Organization';

declare global {
  namespace Express {
    interface Request {
      organizations?: Organization[];
    }
  }
}

export {};