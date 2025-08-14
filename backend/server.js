const express = require('express');
const app = express();
const port = 3001;

const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');

app.post('/api/create-qr', async(req, res) => {
  const vnpay = new VNPay({
    tmnCode: 'Z0IVL4IG',
    secureSecret: 'ZO1H25QVH2S9NOTU2EJTKOXOO4O8UEZL',
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true, // tùy chọn
    hashAlgorithm: 'SHA512', // tùy chọn
    loggerFn: ignoreLogger, // tùy chọn
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const vnpayResponse = await vnpay.buildPaymentUrl({
    vnp_Amount: 50000, //
    vnp_IpAddr: '127.0.0.1', //
    vnp_TxnRef: '123456',
    vnp_OrderInfo: '123456',
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: 'http://192.168.31.38:3000/checkout/vnpay_return', //
    vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
    vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là hiện tại
    vnp_ExpireDate: dateFormat(tomorrow), // tùy chọn
  });

  return res.status(201).json(vnpayResponse);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
}); 