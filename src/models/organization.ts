// entities/Organization.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { economicActivity } from './economicActivity';
import { ProductService } from './productService';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', unique: true, length: 12 })
  inn: string;

  @Column({ type: 'varchar', nullable: true, length: 9 })
  kpp: string | null;

  @Column({ type: 'varchar', nullable: true, length: 500 })
  fullName: string | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'text', nullable: true })
  actualAddress: string | null;

  @Column({ type: 'varchar', nullable: true, length: 20 })
  phone: string | null;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  email: string | null;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  bankName: string | null;

  @Column({ type: 'varchar', nullable: true, length: 20 })
  bankAccount: string | null;

  @Column({ type: 'varchar', nullable: true, length: 20 })
  corrAccount: string | null;

  @Column({ type: 'varchar', nullable: true, length: 9 })
  bik: string | null;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  discount: number;

  @ManyToOne(() => ProductService, { nullable: true })
  defaultProductService: ProductService | null;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({ type: 'boolean', default: false })
  isMyOrganization: boolean;

  @Column({ type: 'boolean', default: false })
  isDefaultOrganization: boolean;

  @Column({ type: 'text', nullable: true })
  photo: string | null;

  //@OneToMany(() => economicActivity, economicActivity => economicActivity.counterparty)
  //economicActivities: economicActivity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}