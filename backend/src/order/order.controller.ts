import { Controller, Post, Get, Body, Param, Put, Query } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Body() body: any) {
    // Nếu có address_id thì dùng luôn, không tạo mới address
    if (body.address_id) {
      return this.orderService.createOrder(body);
    }
    // Nếu có address object thì tạo mới address
    return this.orderService.createFullOrder(body);
  }

  @Get('user/:userId')
  getOrdersByUser(@Param('userId') userId: number) {
    return this.orderService.getOrdersByUser(Number(userId));
  }

  @Get('all')
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Get('paginated')
  async getPaginatedOrders(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('payment_method') payment_method?: string,
    @Query('date') date?: string,
  ) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    
    // Validate parameters
    if (pageNum < 1) throw new Error('Page must be greater than 0');
    if (limitNum < 1 || limitNum > 100) throw new Error('Limit must be between 1 and 100');
    
    return this.orderService.getPaginatedOrders({
      page: pageNum,
      limit: limitNum,
      search: search?.trim(),
      status: status?.trim(),
      payment_method: payment_method?.trim(),
      date: date?.trim(),
    });
  }

  @Get(':id')
  getOrderById(@Param('id') id: number) {
    return this.orderService.getOrderById(Number(id));
  }

  @Put(':id')
  updateOrder(@Param('id') id: number, @Body() body: any) {
    return this.orderService.updateOrder(Number(id), body);
  }
} 