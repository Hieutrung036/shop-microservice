import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Get('cart')
  async getCheckoutCart(@Req() req) {
    return this.checkoutService.getCheckoutCart(req.user.id);
  }
}
