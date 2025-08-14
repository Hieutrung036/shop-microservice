import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async createImage(product_id: number, url: string, type: 'main' | 'extra') {
    const image = this.imageRepository.create({ product_id, url, type });
    const saved = await this.imageRepository.save(image);
    console.log('Saved image:', saved);
    return saved;
  }

  async getImagesByProductId(product_id: number) {
    return this.imageRepository.find({ where: { product_id } });
  }

  async getAllImages() {
    return this.imageRepository.find();
  }

  async deleteImage(id: number) {
    const image = await this.imageRepository.findOne({ where: { id } });
    if (image) {
      // Xóa file vật lý
      const fileName = image.url.split('/').pop();
      if (fileName) {
        const filePath = join(process.cwd(), 'uploads', fileName);
        try {
          await unlink(filePath);
        } catch (e) {
          // Nếu file không tồn tại cũng bỏ qua
        }
      }
      // Xóa DB
      await this.imageRepository.delete(id);
      return { success: true };
    }
    return { success: false, message: 'Image not found' };
  }
}
