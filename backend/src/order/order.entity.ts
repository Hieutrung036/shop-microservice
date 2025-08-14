import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ nullable: true })
  address_id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total_price: number;

  @Column({ length: 20 })
  status: string;

  @Column({ type: 'varchar', length: 50, default: 'cod' })
  payment_method: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  shipping_method: string;



  @Column({ type: 'date', nullable: true })
  expected_delivery_date: Date | null;

  @Column({ type: 'text', nullable: true })
  note: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
} 