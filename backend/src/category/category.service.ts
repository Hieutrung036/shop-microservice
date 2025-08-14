import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(category: Partial<Category>) {
    try {
      return await this.categoryRepository.save(category);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === 'SQLITE_CONSTRAINT' || error.message?.includes('duplicate')) {
        throw new BadRequestException('Tên danh mục đã tồn tại!');
      }
      throw error;
    }
  }

  async findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: number) {
    return this.categoryRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Category>) {
    try {
      // Kiểm tra nếu đổi tên trùng với tên đã có
      if (data.name) {
        const existing = await this.categoryRepository.findOne({ where: { name: data.name } });
        if (existing && existing.id !== id) {
          throw new BadRequestException('Tên danh mục đã tồn tại!');
        }
      }
      await this.categoryRepository.update(id, data);
      return this.findOne(id);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === 'SQLITE_CONSTRAINT' || error.message?.includes('duplicate')) {
        throw new BadRequestException('Tên danh mục đã tồn tại!');
      }
      throw error;
    }
  }

  remove(id: number) {
    return this.categoryRepository.delete(id);
  }
} 