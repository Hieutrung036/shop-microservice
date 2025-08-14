import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scale } from './scale.entity';

@Injectable()
export class ScaleService {
  constructor(
    @InjectRepository(Scale)
    private scaleRepository: Repository<Scale>,
  ) {}

  async create(scale: Partial<Scale>) {
    // Chống trùng scale trong cùng category
    const exists = await this.scaleRepository.findOne({ where: { scale: scale.scale, category_id: scale.category_id } });
    if (exists) {
      throw new BadRequestException('Tỉ lệ này đã tồn tại trong loại sản phẩm này!');
    }
    return this.scaleRepository.save(scale);
  }

  async findAll() {
    return this.scaleRepository.find({ relations: ['category'] });
  }

  async findOne(id: number) {
    return this.scaleRepository.findOne({ where: { id }, relations: ['category'] });
  }

  async update(id: number, data: Partial<Scale>) {
    // Chống trùng scale trong cùng category khi update
    if (data.scale && data.category_id) {
      const exists = await this.scaleRepository.findOne({ where: { scale: data.scale, category_id: data.category_id } });
      if (exists && exists.id !== id) {
        throw new BadRequestException('Tỉ lệ này đã tồn tại trong loại sản phẩm này!');
      }
    }
    await this.scaleRepository.update(id, data);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.scaleRepository.delete(id);
  }

  async findByCategory(category_id: number) {
    return this.scaleRepository.find({ where: { category_id } });
  }
}
