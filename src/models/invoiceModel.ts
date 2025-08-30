import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index
} from 'typeorm';
import { Organization } from './orgModel';
import { Service } from './serviceModel';
import { Status } from './statusModel';

@Entity('invoices')
@Index(['invoiceNumber', 'organization'], { unique: true })
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  invoiceNumber: string;

  @Column({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalAmount: number;

  @Column({ type: 'varchar', length: 3, default: 'RUB' })
  currency: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxRate: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  terms: string;

  @Column({ type: 'date', nullable: true })
  paidDate: Date;

  // Relations
  @ManyToOne(() => Organization, (organization) => organization.invoices, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column()
  organizationId: string;

  @ManyToOne(() => Organization, (organization) => organization.receivedInvoices, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'clientOrganizationId' })
  clientOrganization: Organization;

  @Column()
  clientOrganizationId: string;

  @ManyToOne(() => Status, (status) => status.invoices, {
    onDelete: 'RESTRICT',
    eager: true // Автоматически подгружаем статус при загрузке инвойса
  })
  @JoinColumn({ name: 'statusId' })
  status!: Status;

  @Column()
  statusId!: string;

  @OneToMany(() => Service, (service) => service.invoice, {
    cascade: true
  })
  services: Service[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties (not stored in database)
  get daysUntilDue(): number {
    const today = new Date();
    const due = new Date(this.dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get isOverdue(): boolean {
    return this.status.name === 'pending' && new Date() > new Date(this.dueDate);
  }

  get isPaid(): boolean {
    return this.status.name === 'paid';
  }

  get isDraft(): boolean {
    return this.status.name === 'draft';
  }
}