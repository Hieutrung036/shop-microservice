import { Injectable } from '@nestjs/common';
import { CartService } from '../cart/cart.service';

@Injectable()
export class CheckoutService {
  constructor(private readonly cartService: CartService) {}

  async getCheckoutCart(userId: number) {
    const cart = await this.cartService.getUserCart(userId);
    // Có thể xử lý thêm logic ở đây nếu cần
    return cart.items;
  }
}
