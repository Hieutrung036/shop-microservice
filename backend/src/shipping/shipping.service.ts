import { Injectable } from '@nestjs/common';
import { ShippingMethod } from './shipping.controller';
import { GHNService } from './ghn.service';

interface CalculateShippingDto {
  province: string;
  district: string;
  ward: string;
  weight?: number;
  value?: number;
}

@Injectable()
export class ShippingService {
  constructor(private readonly ghnService: GHNService) {}

  // Địa chỉ cửa hàng (điểm xuất phát)
  private readonly STORE_ADDRESS = {
    province: 'Thành phố Hồ Chí Minh',
    district: 'Quận 7',
    ward: 'Phường Tân Hưng'
  };

  async calculateShipping(dto: CalculateShippingDto): Promise<ShippingMethod[]> {
    const { province, district, ward, weight = 500, value = 1000000 } = dto;

    console.log('🚚 Shipping API called with:', { province, district, ward, weight, value });

    try {
      // Lấy ward_code và district_id cho địa chỉ đích
      const toWardCode = await this.ghnService.getWardCode(province, district, ward);
      const toDistrictId = await this.ghnService.getDistrictId(province, district);
      
      console.log('📍 Location codes:', {
        from_district_id: 2027, // Quận 7, TP.HCM
        to_district_id: toDistrictId,
        to_ward_code: toWardCode,
        province,
        district,
        ward
      });
      
      // Gọi GHN API thực tế
      const ghnRequest = {
        service_type_id: 2, // Standard delivery
        insurance_value: value,
        to_ward_code: toWardCode,
        to_district_id: toDistrictId,
        from_district_id: 2027, // Quận 7, TP.HCM
        height: 10, // cm
        length: 20, // cm
        weight: weight, // gram
        width: 15, // cm
      };

      console.log('🚚 GHN Request:', ghnRequest);

      const ghnResponse = await this.ghnService.calculateShipping(ghnRequest);

      console.log('📦 GHN real data:', ghnResponse);

      return [
        {
          id: 'ghn',
          name: ghnResponse.service_name,
          fee: ghnResponse.total_fee,
          delivery_time: ghnResponse.estimated_delivery_time,
          description: 'Giao hàng nhanh - dữ liệu thực tế từ GHN'
        },
        {
          id: 'standard',
          name: 'Giao hàng tiêu chuẩn',
          fee: Math.round(ghnResponse.total_fee * 0.8), // Giảm 20% so với GHN
          delivery_time: this.addDaysToDeliveryTime(ghnResponse.estimated_delivery_time, 1),
          description: 'Giao hàng tiêu chuẩn'
        },
        {
          id: 'express',
          name: 'Giao hàng siêu tốc',
          fee: Math.round(ghnResponse.total_fee * 1.5), // Tăng 50% so với GHN
          delivery_time: this.reduceDaysFromDeliveryTime(ghnResponse.estimated_delivery_time, 1),
          description: 'Giao hàng siêu tốc'
        }
      ];
    } catch (error) {
      console.error('❌ Error calling GHN API:', error);
      console.log('🔄 Using fallback shipping methods...');
      // Fallback nếu API lỗi
      return this.getFallbackShippingMethods(dto);
    }
  }

  private addDaysToDeliveryTime(deliveryTime: string, days: number): string {
    // Logic thêm ngày vào delivery_time
    if (deliveryTime.includes('1-2')) return '2-3 ngày';
    if (deliveryTime.includes('2-3')) return '3-4 ngày';
    if (deliveryTime.includes('3-5')) return '4-6 ngày';
    return deliveryTime;
  }

  private reduceDaysFromDeliveryTime(deliveryTime: string, days: number): string {
    // Logic giảm ngày từ delivery_time
    if (deliveryTime.includes('1-2')) return '1 ngày';
    if (deliveryTime.includes('2-3')) return '1-2 ngày';
    if (deliveryTime.includes('3-5')) return '2-3 ngày';
    return deliveryTime;
  }

  private getFallbackShippingMethods(dto: CalculateShippingDto): ShippingMethod[] {
    // Fallback data nếu API lỗi
    return [
      {
        id: 'standard',
        name: 'Giao hàng tiêu chuẩn',
        fee: 20000,
        delivery_time: '2-3 ngày',
        description: 'Giao hàng tiêu chuẩn'
      },
      {
        id: 'express',
        name: 'Giao hàng nhanh',
        fee: 35000,
        delivery_time: '1-2 ngày',
        description: 'Giao hàng nhanh'
      }
    ];
  }

  async getShippingMethods(): Promise<ShippingMethod[]> {
    // Trả về danh sách phương thức giao hàng mặc định
    return [
      {
        id: 'standard',
        name: 'Giao hàng tiêu chuẩn',
        fee: 20000,
        delivery_time: '2-3 ngày',
        description: 'Giao hàng tiêu chuẩn'
      },
      {
        id: 'express',
        name: 'Giao hàng nhanh',
        fee: 35000,
        delivery_time: '1-2 ngày',
        description: 'Giao hàng nhanh'
      },
      {
        id: 'ghn',
        name: 'Giao Hàng Nhanh',
        fee: 25000,
        delivery_time: '1-2 ngày',
        description: 'Giao hàng nhanh - dữ liệu thực tế từ GHN'
      }
    ];
  }

  async testGHNConnection(): Promise<boolean> {
    return this.ghnService.testConnection();
  }
} 