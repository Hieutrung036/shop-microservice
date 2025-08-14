import { Controller, Get, Param, Post, Body, Delete, Put } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @Get(':id')
  getAddressById(@Param('id') id: number) {
    return this.addressService.findById(Number(id));
  }

  @Post()
  async createAddress(@Body() body: any) {
    return this.addressService.create(body);
  }

  @Delete(':id')
  async deleteAddress(@Param('id') id: number) {
    return this.addressService.delete(Number(id));
  }

  @Put(':id')
  async updateAddress(@Param('id') id: number, @Body() body: any) {
    return this.addressService.update(Number(id), body);
  }
}
