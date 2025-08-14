import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImageService } from './image.service';
import { Express } from 'express';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  // 1. Upload file (FormData)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      }
    })
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/${file.filename}` };
  }

  // 2. Lưu DB (JSON)
  @Post()
  async createImage(@Body() body: { product_id: number; url: string; type: 'main' | 'extra' }) {
    return this.imageService.createImage(body.product_id, body.url, body.type);
  }

  // 3. Lấy danh sách ảnh theo product_id
  @Get()
  async getImages(@Query('product_id') product_id: string) {
    if (product_id) {
      const id = Number(product_id);
      if (!product_id || isNaN(id)) {
        return [];
      }
      return this.imageService.getImagesByProductId(id);
    }
    // Nếu không có product_id, trả về tất cả ảnh
    return this.imageService.getAllImages();
  }

  @Delete(':id')
  async deleteImage(@Param('id') id: number) {
    return this.imageService.deleteImage(Number(id));
  }
}
