// entities/ProductService.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { economicActivity } from './economicActivity';

@Entity()
export class ProductService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string; // Наименование товара/услуги

  @Column({ type: "text", nullable: true }) // Добавлен тип text
  description: string; // Описание

  @Column('decimal', { precision: 10, scale: 2 })
  price: number; // Базовая цена

  @Column({ type: "varchar", nullable: true, length: 50 }) // Добавлен тип
  unit: string; // Единица измерения (шт, кг, м и т.д.)

  @Column({ type: "varchar", nullable: true, length: 100 }) // Добавлен тип
  code: string; // Код товара/услуги

  @Column({ type: "int", nullable: true }) // Добавлен тип
  taxRate: number; // Ставка НДС (0, 10, 20 и т.д.)

  @Column('simple-array', { nullable: true })
  tags: string[]; // Тэги для сортировки и фильтрации

  @Column({ type: "boolean", default: true }) // Добавлен тип
  isActive: boolean; // Активен ли товар/услуга

 //@OneToMany(() => economicActivity, economicActivity => economicActivity.productService)
  //economicActivities: economicActivity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}