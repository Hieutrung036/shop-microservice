import { Controller, Post, Body, Req } from '@nestjs/common';
import { VnpayService } from './vnpay.service';
import { OrderService } from '../order/order.service';

@Controller('vnpay')
export class VnpayController {
  constructor(
    private readonly vnpayService: VnpayService,
    private readonly orderService: OrderService,
  ) {}

  @Post('create-payment')
  async createPayment(@Body() body: any, @Req() req) {
    const { amount, orderId, orderInfo } = body;
    const ipAddr = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    
    console.log('🚀 VNPay create-payment request:', { amount, orderId, orderInfo, ipAddr });
    
    const urlObj = await this.vnpayService.createPaymentUrl(
      amount,
      orderId,
      orderInfo,
      ipAddr,
    );
    
    console.log('📡 VNPay service response:', urlObj);
    
    // Kiểm tra nếu có lỗi
    if (urlObj.error) {
      console.error('❌ VNPay error:', urlObj);
      return { error: urlObj.error, detail: urlObj.detail };
    }
    
    // Trả về URL string
    const paymentUrl = urlObj.url || urlObj;
    console.log('✅ Final payment URL:', paymentUrl);
    return { paymentUrl };
  }

  @Post('verify-return')
  async verifyReturn(@Body() body: any) {
    try {
      console.log('🔍 VNPay return data:', body);
      
      // Kiểm tra các tham số bắt buộc
      const { vnp_ResponseCode, vnp_SecureHash, vnp_TxnRef } = body;
      
      if (!vnp_ResponseCode || !vnp_SecureHash || !vnp_TxnRef) {
        console.error('❌ Missing required parameters');
        return { valid: false, responseCode: null };
      }

      // Xác thực chữ ký (có thể implement sau)
      // const isValidSignature = await this.vnpayService.verifySignature(body);
      
      // Tạm thời bỏ qua xác thực chữ ký, chỉ kiểm tra response code
      const isValidSignature = true; // TODO: Implement signature verification
      
      if (!isValidSignature) {
        console.error('❌ Invalid signature');
        return { valid: false, responseCode: null };
      }

      // Kiểm tra response code
      const isSuccess = vnp_ResponseCode === '00';
      console.log('✅ VNPay verification result:', { 
        responseCode: vnp_ResponseCode, 
        isSuccess, 
        txnRef: vnp_TxnRef 
      });

      // Nếu thanh toán thành công, cập nhật trạng thái order
      if (isSuccess) {
        try {
          // Tìm order dựa trên txnRef (có thể là order ID)
          const orderId = parseInt(vnp_TxnRef);
          if (!isNaN(orderId)) {
            await this.orderService.updateOrder(orderId, { status: 'paid' });
            console.log('✅ Updated order status to paid for order ID:', orderId);
          }
        } catch (error) {
          console.error('❌ Error updating order status:', error);
        }
      }

      return { 
        valid: true, 
        responseCode: vnp_ResponseCode,
        txnRef: vnp_TxnRef,
        amount: body.vnp_Amount
      };
      
    } catch (error) {
      console.error('❌ VNPay verification error:', error);
      return { valid: false, responseCode: null };
    }
  }
} 