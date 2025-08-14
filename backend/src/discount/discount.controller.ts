import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { DiscountService } from './discount.service';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  create(@Body() body: any) {
    return this.discountService.create(body);
  }

  @Get()
  findAll() {
    return this.discountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.discountService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: any) {
    return this.discountService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.discountService.remove(Number(id));
  }
}
