import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async create(brand: Partial<Brand>) {
    try {
      return await this.brandRepository.save(brand);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === 'SQLITE_CONSTRAINT' || error.message?.includes('duplicate')) {
        throw new BadRequestException('Tên thương hiệu đã tồn tại!');
      }
      throw error;
    }
  }

  async findAll() {
    return this.brandRepository.find();
  }

  async findOne(id: number) {
    return this.brandRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Brand>) {
    try {
      if (data.name) {
        const existing = await this.brandRepository.findOne({ where: { name: data.name } });
        if (existing && existing.id !== id) {
          throw new BadRequestException('Tên thương hiệu đã tồn tại!');
        }
      }
      await this.brandRepository.update(id, data);
      return this.findOne(id);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === 'SQLITE_CONSTRAINT' || error.message?.includes('duplicate')) {
        throw new BadRequestException('Tên thương hiệu đã tồn tại!');
      }
      throw error;
    }
  }

  remove(id: number) {
    return this.brandRepository.delete(id);
  }
}
