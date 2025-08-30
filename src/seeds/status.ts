// src/seeds/status.seed.ts
import { Status } from '../models/statusModel';

export const defaultStatuses: Partial<Status>[] = [
  {
    name: 'draft',
    description: 'Черновик счета',
    isActive: true,
    isFinal: false,
    sortOrder: 1,
    color: '#6B7280'
  },
  {
    name: 'pending',
    description: 'Ожидает оплаты',
    isActive: true,
    isFinal: false,
    sortOrder: 2,
    color: '#F59E0B'
  },
  {
    name: 'partially_paid',
    description: 'Частично оплачен',
    isActive: true,
    isFinal: false,
    sortOrder: 3,
    color: '#8B5CF6'
  },
  {
    name: 'paid',
    description: 'Полностью оплачен',
    isActive: true,
    isFinal: true,
    sortOrder: 4,
    color: '#10B981'
  },
  {
    name: 'overdue',
    description: 'Просрочен',
    isActive: true,
    isFinal: false,
    sortOrder: 5,
    color: '#EF4444'
  },
  {
    name: 'cancelled',
    description: 'Отменен',
    isActive: true,
    isFinal: true,
    sortOrder: 6,
    color: '#9CA3AF'
  }
];