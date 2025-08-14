import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scale } from './scale.entity';
import { ScaleService } from './scale.service';
import { ScaleController } from './scale.controller';
import { Category } from '../category/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Scale, Category])],
  providers: [ScaleService],
  controllers: [ScaleController],
  exports: [ScaleService],
})
export class ScaleModule {}
