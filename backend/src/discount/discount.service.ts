import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discount } from './discount.entity';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private discountRepository: Repository<Discount>,
  ) {}

  async create(data: Partial<Discount>) {
    // Chống trùng voucher chỉ khi voucher có giá trị
    if (data.voucher && data.voucher.trim() !== "") {
      const existsVoucher = await this.discountRepository.findOne({ where: { voucher: data.voucher } });
      if (existsVoucher) {
        throw new BadRequestException('Voucher đã tồn tại!');
      }
    }
    // Chống trùng tên
    const existsName = await this.discountRepository.findOne({ where: { name: data.name } });
    if (existsName) {
      throw new BadRequestException('Tên mã giảm giá đã tồn tại!');
    }
    return this.discountRepository.save(data);
  }

  findAll() {
    return this.discountRepository.find();
  }

  findOne(id: number) {
    return this.discountRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Discount>) {
    if (data.voucher && data.voucher.trim() !== "") {
      const existsVoucher = await this.discountRepository.findOne({ where: { voucher: data.voucher } });
      if (existsVoucher && existsVoucher.id !== id) {
        throw new BadRequestException('Voucher đã tồn tại!');
      }
    }
    if (data.name) {
      const existsName = await this.discountRepository.findOne({ where: { name: data.name } });
      if (existsName && existsName.id !== id) {
        throw new BadRequestException('Tên mã giảm giá đã tồn tại!');
      }
    }
    await this.discountRepository.update(id, data);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.discountRepository.delete(id);
  }
}
