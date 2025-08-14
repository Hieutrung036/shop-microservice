import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ScaleService } from './scale.service';

@Controller('scale')
export class ScaleController {
  constructor(private readonly scaleService: ScaleService) {}

  @Post()
  create(@Body() body: { scale: string; category_id: number }) {
    return this.scaleService.create(body);
  }

  @Get()
  findAll(@Query('category_id') category_id?: number) {
    if (category_id) {
      return this.scaleService.findByCategory(Number(category_id));
    }
    return this.scaleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.scaleService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: any) {
    return this.scaleService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.scaleService.remove(Number(id));
  }
}
