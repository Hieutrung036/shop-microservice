import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order_item.entity';
import { Address } from '../address/address.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async createFullOrder(data: {
    user_id: number;
    address: Partial<Address>;
    total_price: number;
    status: string;
    payment_method: string;
    note?: string;
    items: Array<{ product_id: number; quantity: number; price: number }>;
  }) {
    // 1. Lưu address
    const address = await this.addressRepository.save({ ...data.address, user_id: data.user_id });
    // 2. Lưu order
    const order = await this.orderRepository.save({
      user_id: data.user_id,
      address_id: address.id,
      total_price: data.total_price,
      status: data.status,
      payment_method: data.payment_method,
      note: data.note,
    });
    // 3. Lưu order_items
    for (const item of data.items) {
      await this.orderItemRepository.save({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      });
    }
    return order;
  }

  async createOrder(orderData: {
    user_id: number;
    address_id: number;
    total_price: number;
    note?: string;
    items: { product_id: number; quantity: number; price: number }[];
    payment_method: string;
    shipping_method?: string;

    expected_delivery_date?: string;
  }): Promise<Order> {
    console.log('📦 Creating order with shipping info:', {
      shipping_method: orderData.shipping_method,
      expected_delivery_date: orderData.expected_delivery_date
    });
    
    // Xác định trạng thái dựa trên phương thức thanh toán
    let initialStatus = 'pending_confirmation';
    if (orderData.payment_method === 'cod') {
      initialStatus = 'pending_confirmation'; // Chờ xác nhận (COD)
    } else if (orderData.payment_method === 'vnpay' || 
        orderData.payment_method === 'momo' || 
        orderData.payment_method === 'zalopay' || 
        orderData.payment_method === 'bank_transfer') {
      initialStatus = 'pending_payment'; // Chờ thanh toán (sẽ chuyển thành paid khi callback thành công)
    }
    
    // 1. Tạo order trước
    const order = this.orderRepository.create({
      user_id: orderData.user_id,
      address_id: orderData.address_id,
      total_price: orderData.total_price,
      note: orderData.note,
      status: initialStatus,
      payment_method: orderData.payment_method,
      shipping_method: orderData.shipping_method,
  
      expected_delivery_date: orderData.expected_delivery_date ? new Date(orderData.expected_delivery_date) : null,
    });
    
    // 2. Lưu order để có ID
    const savedOrder = await this.orderRepository.save(order);
    
    console.log('📦 Order created with ID:', savedOrder.id);
    
    // 3. Lưu order_items với order_id đã có
    for (const item of orderData.items) {
      await this.orderItemRepository.save({
        order_id: savedOrder.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      });
    }
    
    return savedOrder;
  }

  async updateOrder(id: number, data: Partial<Order>) {
    await this.orderRepository.update(id, data);
    return this.orderRepository.findOne({ where: { id } });
  }

  async getOrderById(id: number) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) return null;
    // Việt hóa trạng thái
    let statusVN = order.status;
    if (statusVN === 'pending') statusVN = 'Chờ xác nhận';
    else if (statusVN === 'confirmed') statusVN = 'Đã xác nhận';
    else if (statusVN === 'paid') statusVN = 'Đã thanh toán';
    else if (statusVN === 'cancelled') statusVN = 'Đã hủy';
    // Lấy địa chỉ nhận hàng
    let address: Address | null = null;
    if (order.address_id) {
      address = await this.addressRepository.findOne({ where: { id: Number(order.address_id) } });
    }
    const items = await this.orderItemRepository.find({ where: { order_id: id } });
    // Lấy thêm tên sản phẩm và ảnh chính cho từng item
    const productRepo = this.orderItemRepository.manager.getRepository('Product');
    const imageRepo = this.orderItemRepository.manager.getRepository('Image');
    const itemsWithInfo = await Promise.all(items.map(async (item) => {
      const product = await productRepo.findOne({ where: { id: item.product_id }, relations: ['brand', 'scale', 'category'] });
      let image_url = null;
      if (product) {
        const mainImage = await imageRepo.findOne({ where: { product_id: product.id, type: 'main' } });
        image_url = mainImage ? mainImage.url : null;
      }
      return {
        ...item,
        product_name: product ? product.name : item.product_id,
        image_url,
        scale: product && product.scale ? product.scale.scale : undefined,
        brand: product && product.brand ? product.brand.name : undefined,
        category: product && product.category ? product.category.name : undefined,
      };
    }));
    return { ...order, status: statusVN, address, items: itemsWithInfo };
  }

  getOrdersByUser(user_id: number) {
    return this.orderRepository.find({ where: { user_id } });
  }

  getAllOrders() {
    return this.orderRepository.find();
  }

  async getPaginatedOrders(params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    payment_method?: string;
    date?: string;
  }) {
    const { page, limit, search, status, payment_method, date } = params;
    
    // Validate parameters
    if (page < 1) throw new Error('Page must be greater than 0');
    if (limit < 1 || limit > 100) throw new Error('Limit must be between 1 and 100');
    
    // Build query builder
    const queryBuilder = this.orderRepository.createQueryBuilder('order');
    
    // Add search conditions
    if (search && search.trim()) {
      const searchTerm = search.trim();
      // Check if search is a number (order ID)
      if (!isNaN(Number(searchTerm))) {
        queryBuilder.andWhere('order.id = :searchId', { searchId: parseInt(searchTerm) });
      } else {
        // Search by user_id (assuming it's a number)
        if (!isNaN(Number(searchTerm))) {
          queryBuilder.andWhere('order.user_id = :searchUserId', { searchUserId: parseInt(searchTerm) });
        }
      }
    }
    
    // Add status filter
    if (status && status.trim()) {
      queryBuilder.andWhere('order.status = :status', { status: status.trim() });
    }
    
    // Add payment method filter
    if (payment_method && payment_method.trim()) {
      queryBuilder.andWhere('order.payment_method = :payment_method', { payment_method: payment_method.trim() });
    }
    
    // Add date filter
    if (date && date.trim()) {
      const dateObj = new Date(date);
      if (!isNaN(dateObj.getTime())) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        queryBuilder.andWhere('order.created_at BETWEEN :startDate AND :endDate', {
          startDate: startOfDay,
          endDate: endOfDay,
        });
      }
    }
    
    // Get total count
    const total = await queryBuilder.getCount();
    
    // Add pagination
    const offset = (page - 1) * limit;
    queryBuilder
      .orderBy('order.created_at', 'DESC')
      .skip(offset)
      .take(limit);
    
    // Execute query
    const orders = await queryBuilder.getMany();
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    
    return {
      orders,
      total,
      page,
      limit,
      totalPages,
    };
  }
} 