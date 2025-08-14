import { Controller, Post, Body, Get } from '@nestjs/common';
import { ShippingService } from './shipping.service';

export interface ShippingMethod {
  id: string;
  name: string;
  fee: number;
  delivery_time: string;
  description?: string;
}

interface CalculateShippingDto {
  province: string;
  district: string;
  ward: string;
  weight?: number;
  value?: number;
}

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('calculate')
  async calculateShipping(@Body() dto: CalculateShippingDto): Promise<ShippingMethod[]> {
    return this.shippingService.calculateShipping(dto);
  }

  @Get('methods')
  async getShippingMethods(): Promise<ShippingMethod[]> {
    return this.shippingService.getShippingMethods();
  }

  @Get('test-ghn')
  async testGHNConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const isConnected = await this.shippingService.testGHNConnection();
      return {
        success: isConnected,
        message: isConnected ? 'GHN API connection successful' : 'GHN API connection failed'
      };
    } catch (error) {
      return {
        success: false,
        message: `GHN API test error: ${error.message}`
      };
    }
  }
} 