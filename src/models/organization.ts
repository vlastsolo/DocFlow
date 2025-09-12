// entities/Organization.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { economicActivity } from './economicActivity';
import { ProductService } from './productService';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, length: 12 })
  inn: string; // ИНН

  @Column({ type: 'varchar', nullable: true, length: 9 })
  kpp: string; // КПП

  @Column({ type: 'varchar', length: 255 })
  name: string; // Название организации

  @Column({ type: 'varchar', nullable: true, length: 500 })
  fullName: string; // Полное наименование

  @Column({ type: 'text', nullable: true })
  address: string; // Юридический адрес

  @Column({ type: 'text', nullable: true })
  actualAddress: string; // Фактический адрес

  @Column({ type: 'varchar', nullable: true, length: 20 })
  phone: string; // Телефон

  @Column({ type: 'varchar', nullable: true, length: 100 })
  email: string; // Email

  @Column({ type: 'varchar', nullable: true, length: 255 })
  bankName: string; // Наименование банка

  @Column({ type: 'varchar', nullable: true, length: 20 })
  bankAccount: string; // Расчетный счет

  @Column({ type: 'varchar', nullable: true, length: 20 })
  corrAccount: string; // Корреспондентский счет

  @Column({ type: 'varchar', nullable: true, length: 9 })
  bik: string; // БИК

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  discount: number; // Размер скидки от базовой цены (в процентах)

  @ManyToOne(() => ProductService, { nullable: true })
  defaultProductService: ProductService; // Товар/услуга по умолчанию

  @Column('simple-array', { nullable: true })
  tags: string[]; // Тэги для сортировки и фильтрации

  @Column({ type: 'boolean', default: false })
  isMyOrganization: boolean; // Моя организация

  @Column({ type: 'boolean', default: false })
  isDefaultOrganization: boolean; // Организация по умолчанию

  @Column({ type: 'text', nullable: true })
  photo: string; // Путь к фото или base64 строка

  @OneToMany(() => economicActivity, economicActivity => economicActivity.counterparty)
  economicActivities: economicActivity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}