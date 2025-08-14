import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { BrandService } from './brand.service';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  create(@Body() body: { name: string; manufacturer?: string }) {
    return this.brandService.create(body);
  }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.brandService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: any) {
    return this.brandService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.brandService.remove(Number(id));
  }
}
