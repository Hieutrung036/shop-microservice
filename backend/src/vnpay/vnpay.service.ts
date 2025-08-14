import { Injectable } from '@nestjs/common';
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');

@Injectable()
export class VnpayService {
  async createPaymentUrl(amount: number, txnRef: string, orderInfo: string, ipAddr: string) {
    try {
      const vnpay = new VNPay({
        tmnCode: 'Z0IVL4IG',
        secureSecret: 'ZO1H25QVH2S9NOTU2EJTKOXOO4O8UEZL',
        vnpayHost: 'https://sandbox.vnpayment.vn',
        testMode: true,
        hashAlgorithm: 'SHA512',
        loggerFn: ignoreLogger,
      });

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const vnpayResponse = await vnpay.buildPaymentUrl({
        vnp_Amount: amount, // Bỏ nhân 100, gửi trực tiếp
        vnp_IpAddr: ipAddr || '127.0.0.1',
        vnp_TxnRef: txnRef,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: 'billpayment', // Sửa lại đúng chuẩn
        vnp_ReturnUrl: 'http://192.168.31.38:3000/checkout/vnpay_return',
        vnp_Locale: VnpLocale.VN,
        vnp_CreateDate: dateFormat(new Date()),
        vnp_ExpireDate: dateFormat(tomorrow),
      });
      return vnpayResponse; // trả về object có url
    } catch (err) {
      console.error('VNPay error:', err);
      return { error: 'VNPay error', detail: err?.message || err };
    }
  }
} 