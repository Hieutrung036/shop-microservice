import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}



  @Get('me')
  async getMyCart(@Req() req) {
    // Giả sử req.user.id có userId
    return this.cartService.getUserCart(req.user.id);
  }

  @Get('count')
  async getCartCount(@Req() req) {
    const cart = await this.cartService.getUserCart(req.user.id);
    return { count: cart.items.length };
  }

  @Post('add')
  async addToCart(@Req() req, @Body() body) {
    const { productId, quantity } = body;
    return this.cartService.addOrUpdateItem(req.user.id, productId, quantity);
  }

  @Patch('item/:id')
  async updateItem(@Req() req, @Param('id') id: number, @Body() body) {
    const { quantity } = body;
    return this.cartService.updateItemQuantity(req.user.id, Number(id), quantity);
  }

  @Delete('item/:id')
  async removeItem(@Req() req, @Param('id') id: number) {
    return this.cartService.removeItem(req.user.id, Number(id));
  }

  @Delete('clear')
  async clearCart(@Req() req) {
    return this.cartService.clearCart(req.user.id);
  }
} 