// entities/PaymentStatus.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { economicActivity } from './economicActivity';

@Entity()
export class PaymentStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", unique: true, length: 50 })
  code: string; // Уникальный код статуса

  @Column({ type: "varchar", length: 100 })
  name: string; // Наименование статуса

  @Column({ type: "text", nullable: true })
  description: string; // Описание статуса

  @Column({ type: "int", default: 0 })
  order: number; // Порядок отображения

  @OneToMany(() => economicActivity, economicActivity => economicActivity.paymentStatus)
  economicActivities: economicActivity[];

  // Статические методы для получения стандартных статусов
  static getDefaultStatuses(): Partial<PaymentStatus>[] {
    return [
      { code: 'unpaid', name: 'Не оплачено', description: 'Оплата не произведена', order: 1 },
      { code: 'paid', name: 'Оплачено', description: 'Оплата произведена', order: 2 },
      { code: 'overdue', name: 'Просрочено', description: 'Оплата просрочена', order: 3 }
    ];
  }
}