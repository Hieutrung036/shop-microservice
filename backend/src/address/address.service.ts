import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  findAll() {
    return this.addressRepository.find();
  }

  async findById(id: number) {
    return this.addressRepository.findOne({ where: { id } });
  }

  async create(data: Partial<Address>) {
    return this.addressRepository.save(data);
  }

  async delete(id: number) {
    return this.addressRepository.delete(id);
  }

  async update(id: number, data: Partial<Address>) {
    await this.addressRepository.update(id, data);
    return this.addressRepository.findOne({ where: { id } });
  }
}
