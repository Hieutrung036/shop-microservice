import { Module } from '@nestjs/common';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';
import { GHNService } from './ghn.service';

@Module({
  controllers: [ShippingController],
  providers: [ShippingService, GHNService],
  exports: [ShippingService],
})
export class ShippingModule {} 