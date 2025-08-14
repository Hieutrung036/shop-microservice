import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Image } from '../image/image.entity'; // Đường dẫn đúng tới entity ảnh
import { Brand } from '../brand/brand.entity';
import { Scale } from '../scale/scale.entity';
import { Category } from '../category/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  brand_id: number;

  @Column({ nullable: true })
  scale_id: number;

  @Column({ nullable: true })
  category_id: number;

  @Column({ nullable: true })
  size: string;

  @Column({ nullable: true })
  material: string;

  @Column({ nullable: true })
  discount_id: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discount_price: number;

  @Column({ unique: true, nullable: true })
  slug: string;

  @ManyToOne(() => Brand, { eager: true })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @ManyToOne(() => Scale, { eager: true })
  @JoinColumn({ name: 'scale_id' })
  scale: Scale;

  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => Image, image => image.product)
  images: Image[];

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updated_at: Date;
} 