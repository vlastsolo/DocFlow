// entities/ActivityStatus.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { economicActivity } from './economicActivity';

@Entity()
export class ActivityStatus {
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

  @OneToMany(() => economicActivity, economicActivity => economicActivity.activityStatus)
  economicActivities: economicActivity[];

  // Статические методы для получения стандартных статусов
  static getDefaultStatuses(): Partial<ActivityStatus>[] {
    return [
      { code: 'ordered', name: 'Заказано', description: 'Товар/услуга заказаны', order: 1 },
      { code: 'completed', name: 'Выполнено', description: 'Товар передан/услуга оказаны', order: 2 },
      { code: 'cancelled', name: 'Отменено', description: 'Заказ товара/услуги отменен', order: 3 }
    ];
  }
}