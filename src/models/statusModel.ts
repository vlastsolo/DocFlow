import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { Invoice } from './invoiceModel';

@Entity('statuses')
export class Status {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 100 })
  description!: string;

  @Column({ type: 'boolean', default: false })
  isActive!: boolean;

  @Column({ type: 'boolean', default: false })
  isFinal!: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @Column({ type: 'varchar', length: 7, nullable: true })
  color!: string;

  // Relations
  @OneToMany(() => Invoice, (invoice) => invoice.status)
  invoices!: Invoice[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}