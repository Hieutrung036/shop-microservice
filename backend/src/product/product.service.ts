import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { BadRequestException } from '@nestjs/common';
import { Image } from '../image/image.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  async create(data: Partial<Product> & { images?: { url: string; type: 'main' | 'extra' }[] }) {
    // Kiểm tra trùng tên sản phẩm
    const exists = await this.productRepository.findOne({ where: { name: data.name } });
    if (exists) {
      throw new BadRequestException('Tên sản phẩm đã tồn tại!');
    }
    const { images, ...productData } = data;
    const product = await this.productRepository.save(productData);
    // Lưu images nếu có
    if (images && images.length > 0) {
      for (const img of images) {
        await this.imageRepository.save({
          product_id: product.id,
          url: img.url,
          type: img.type,
        });
      }
    }
    return product;
  }

  findAll() {
    return this.productRepository.find();
  }

  findOne(id: number) {
    return this.productRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Product>) {
    if (data.name) {
      const exists = await this.productRepository.findOne({ where: { name: data.name } });
      if (exists && exists.id !== id) {
        throw new BadRequestException('Tên sản phẩm đã tồn tại!');
      }
    }
    await this.productRepository.update(id, data);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }

  async getProductById(id: number) {
    return this.productRepository.findOne({
      where: { id },
      relations: ['images'], // nếu có relations brand, category, scale thì thêm vào đây
    });
  }

  async getPaginatedProducts(params: {
    page: number;
    limit: number;
    search?: string;
    priceMin?: string;
    priceMax?: string;
    brandId?: string;
    categoryId?: string;
    scaleId?: string;
    material?: string;
    discount?: string;
  }) {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    // Apply search filter
    if (params.search && params.search.trim()) {
      const searchTerm = params.search.trim();
      if (!isNaN(Number(searchTerm))) {
        // If search is a number, search by product ID
        queryBuilder.andWhere('product.id = :searchId', { searchId: parseInt(searchTerm) });
      } else {
        // If search is text, search by product name
        queryBuilder.andWhere('product.name LIKE :searchTerm', { searchTerm: `%${searchTerm}%` });
      }
    }

    // Apply price filters
    if (params.priceMin && params.priceMin.trim()) {
      const priceMin = parseFloat(params.priceMin);
      if (!isNaN(priceMin)) {
        queryBuilder.andWhere('product.price >= :priceMin', { priceMin });
      }
    }

    if (params.priceMax && params.priceMax.trim()) {
      const priceMax = parseFloat(params.priceMax);
      if (!isNaN(priceMax)) {
        queryBuilder.andWhere('product.price <= :priceMax', { priceMax });
      }
    }

    // Apply brand filter
    if (params.brandId && params.brandId.trim()) {
      const brandId = parseInt(params.brandId);
      if (!isNaN(brandId)) {
        queryBuilder.andWhere('product.brand_id = :brandId', { brandId });
      }
    }

    // Apply category filter
    if (params.categoryId && params.categoryId.trim()) {
      const categoryId = parseInt(params.categoryId);
      if (!isNaN(categoryId)) {
        queryBuilder.andWhere('product.category_id = :categoryId', { categoryId });
      }
    }

    // Apply scale filter
    if (params.scaleId && params.scaleId.trim()) {
      const scaleId = parseInt(params.scaleId);
      if (!isNaN(scaleId)) {
        queryBuilder.andWhere('product.scale_id = :scaleId', { scaleId });
      }
    }

    // Apply material filter
    if (params.material && params.material.trim()) {
      queryBuilder.andWhere('product.material LIKE :material', { material: `%${params.material.trim()}%` });
    }

    // Apply discount filter
    if (params.discount && params.discount.trim()) {
      const discount = parseFloat(params.discount);
      if (!isNaN(discount)) {
        queryBuilder.andWhere('product.discount >= :discount', { discount });
      }
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination
    const skip = (params.page - 1) * params.limit;
    const products = await queryBuilder
      .orderBy('product.id', 'DESC')
      .skip(skip)
      .take(params.limit)
      .getMany();

    const totalPages = Math.ceil(total / params.limit);

    return {
      products,
      total,
      page: params.page,
      limit: params.limit,
      totalPages,
    };
  }
} 