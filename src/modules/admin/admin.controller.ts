import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AdminGuard) 
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: '관리자 페이지 조회' })
  @ApiResponse({
    status: 200,
    description: '관리자페이지 통계 (신규 가입자 수, 오늘 주문 수, 매출 합계, 인기 상품)',
  })
  @Get('dashboard')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }


  @ApiOperation({ summary: '배송 상태 조회' })
  @ApiResponse({
    status: 200,
    description: '배송 상태 목록 반환 (배송중, 배송완료 등)',
  })
  @Get('delivery-status')
  async getDeliveryStatus() {
    return this.adminService.getDeliveryStatus();
  }
}
