// entities/EconomicActivity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Organization } from './organization';
import { ProductService } from './productService';
import { ActivityStatus } from './activityStatus';
import { PaymentStatus } from './paymentStatus';

@Entity()
export class economicActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Organization, organization => organization.economicActivities)
  counterparty: Organization; // Организация-контрагент

  @ManyToOne(() => ProductService, productService => productService.economicActivities)
  productService: ProductService; // Товар/услуга

  @ManyToOne(() => ActivityStatus, { eager: true }) // eager loading для удобства
  activityStatus: ActivityStatus; // Статус факта

  @ManyToOne(() => PaymentStatus, { eager: true }) // eager loading для удобства
  paymentStatus: PaymentStatus; // Статус оплаты

  @Column({ type: 'int' })
  quantity: number; // Количество

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number; // Цена за единицу

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number; // Общая сумма

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discountAmount: number; // Сумма скидки

  @Column('decimal', { precision: 10, scale: 2 })
  finalAmount: number; // Итоговая сумма к оплате

  @Column({ type: 'boolean', default: false })
  isInvoiceCreated: boolean; // Счет создан

  @Column({ type: 'boolean', default: false })
  isUpdCreated: boolean; // УПД создан

  // Поля для печатных форм
  @Column({ type: 'varchar', nullable: true, length: 50 })
  invoiceNumber: string; // Номер счета

  @Column({ type: 'datetime', nullable: true })
  invoiceDate: Date; // Дата счета

  @Column({ type: 'varchar', nullable: true, length: 50 })
  updNumber: string; // Номер УПД

  @Column({ type: 'datetime', nullable: true })
  updDate: Date; // Дата УПД

  @Column({ type: 'datetime', nullable: true })
  dueDate: Date; // Срок оплаты

  @Column({ type: 'datetime', nullable: true })
  paymentDate: Date; // Дата оплаты

  @Column({ type: 'text', nullable: true })
  notes: string; // Примечания

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Метод для расчета итоговой суммы
  calculateTotal(): void {
    const baseAmount = this.quantity * this.unitPrice;
    const discount = this.counterparty ? this.counterparty.discount : 0;
    this.discountAmount = baseAmount * (discount / 100);
    this.totalAmount = baseAmount;
    this.finalAmount = baseAmount - this.discountAmount;
  }
}