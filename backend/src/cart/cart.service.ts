import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart_item.entity';
import { Product } from '../product/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async getUserCart(userId: number) {
    let cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: [
        'items',
        'items.product',
        'items.product.images',
        'items.product.brand',
        'items.product.scale',
        'items.product.category',
      ],
    });
    if (!cart) {
      cart = this.cartRepo.create({ user: { id: userId }, items: [] });
      await this.cartRepo.save(cart);
    }
    return cart;
  }

  async addOrUpdateItem(userId: number, productId: number, quantity: number) {
    let cart = await this.getUserCart(userId);
    let item = cart.items.find(i => i.product.id === productId);
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new Error('Product not found');
    const price = product.discount_id ? product.discount_price : product.price;
    if (item) {
      item.quantity += quantity;
      item.price_at_time = price;
      await this.cartItemRepo.save(item);
    } else {
      item = this.cartItemRepo.create({ cart, product, quantity, price_at_time: price });
      await this.cartItemRepo.save(item);
    }
    return this.getUserCart(userId);
  }

  async updateItemQuantity(userId: number, itemId: number, quantity: number) {
    let cart = await this.getUserCart(userId);
    let item = cart.items.find(i => i.id === itemId);
    if (!item) throw new Error('Item not found');
    item.quantity = quantity;
    const price = item.product.discount_id ? item.product.discount_price : item.product.price;
    item.price_at_time = price;
    await this.cartItemRepo.save(item);
    return this.getUserCart(userId);
  }

  async removeItem(userId: number, itemId: number) {
    let cart = await this.getUserCart(userId);
    let item = cart.items.find(i => i.id === itemId);
    if (!item) throw new Error('Item not found');
    await this.cartItemRepo.remove(item);
    return this.getUserCart(userId);
  }

  async clearCart(userId: number) {
    let cart = await this.getUserCart(userId);
    await this.cartItemRepo.remove(cart.items);
    await this.cartRepo.remove(cart);
    return { message: 'Cart cleared' };
  }
} 