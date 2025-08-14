import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { ScaleModule } from './scale/scale.module';
import { DiscountModule } from './discount/discount.module';
import { AddressModule } from './address/address.module';
import { ImageModule } from './image/image.module';
import { CheckoutModule } from './checkout/checkout.module';
import { ConfigModule } from '@nestjs/config';
import { VnpayModule } from './vnpay/vnpay.module';
import { ShippingModule } from './shipping/shipping.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql', // tên service trong docker-compose
      port: 3306, // port trong container MySQL
      username: 'root',
      password: 'root123', // password từ docker-compose
      database: 'shop', // database thực tế
      autoLoadEntities: true,
      synchronize: true, // chỉ dùng cho dev, production nên để false
    }),
    UserModule,
    AuthModule,
    ProductModule,
    CartModule,
    OrderModule,
    CategoryModule,
    BrandModule,
    ScaleModule,
    DiscountModule,
    AddressModule,
    ImageModule,
    CheckoutModule,
    VnpayModule,
    ShippingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
