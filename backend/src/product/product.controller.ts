import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() body: { name: string; price: number; description?: string; brand_id?: number; scale_id?: number; category_id?: number; size?: string; material?: string }) {
    return this.productService.create(body);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('paginated')
  getPaginatedProducts(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
    @Query('price_min') priceMin: string,
    @Query('price_max') priceMax: string,
    @Query('brand_id') brandId: string,
    @Query('category_id') categoryId: string,
    @Query('scale_id') scaleId: string,
    @Query('material') material: string,
    @Query('discount') discount: string,
  ) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    
    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return { products: [], total: 0, page: 1, limit: 20, totalPages: 0 };
    }

    return this.productService.getPaginatedProducts({
      page: pageNum,
      limit: limitNum,
      search,
      priceMin,
      priceMax,
      brandId,
      categoryId,
      scaleId,
      material,
      discount,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productService.findOne(Number(id));
  }

  @Get(':id')
  async getProductById(@Param('id') id: number) {
    return this.productService.getProductById(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: { name?: string; price?: number; description?: string; brand_id?: number; scale_id?: number; category_id?: number; size?: string; material?: string }) {
    return this.productService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productService.remove(Number(id));
  }
} 