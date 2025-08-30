import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Invoice } from './invoiceModel';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  unit: string;

  // Relations
  @ManyToOne(() => Invoice, (invoice) => invoice.services, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;

  @Column({ type: 'uuid' })
  invoiceId: string;
}