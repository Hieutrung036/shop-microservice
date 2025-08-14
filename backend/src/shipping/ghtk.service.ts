import { Injectable } from '@nestjs/common';

interface GHTKRequest {
  pick_province: string;
  pick_district: string;
  pick_ward: string;
  province: string;
  district: string;
  ward: string;
  weight: number;
  value: number;
}

interface GHTKResponse {
  fee: number;
  estimated_delivery_time: string;
  service_id: string;
  service_name: string;
}

@Injectable()
export class GHTKService {
  private readonly API_URL = 'https://services.giaohangtietkiem.vn/services/shipment/fee';
  private readonly API_KEY = process.env.GHTK_API_KEY || 'YOUR_GHTK_API_KEY'; // Lấy từ environment variable

  async calculateShipping(request: GHTKRequest): Promise<GHTKResponse> {
    try {
      console.log('🚚 Calling GHTK API with:', request);
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Token': this.API_KEY,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`GHTK API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 GHTK API response:', data);
      
      return {
        fee: data.fee || 0,
        estimated_delivery_time: data.estimated_delivery_time || '2-3 ngày',
        service_id: data.service_id || 'ghtk',
        service_name: data.service_name || 'Giao Hàng Tiết Kiệm',
      };
    } catch (error) {
      console.error('❌ GHTK API error:', error);
      // Fallback nếu API lỗi
      return {
        fee: 15000,
        estimated_delivery_time: '2-3 ngày',
        service_id: 'ghtk',
        service_name: 'Giao Hàng Tiết Kiệm',
      };
    }
  }
} 