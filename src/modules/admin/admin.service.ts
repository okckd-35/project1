import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  async getDashboardStats() {
    // Mock stats for now
    return {
      newUsers: 10,
      ordersToday: 25,
      revenue: 500000,
      popularProduct: 'Example Product',
    };
  }

  async getDeliveryStatus() {
    // Mock delivery status for now
    return [
      { orderId: 1, status: '배송중' },
      { orderId: 2, status: '배송완료' },
    ];
  }
}
