import { Controller, Post, Get, Body, Param, Query, UseGuards} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Order')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: '주문 생성' })
  @ApiResponse({ status: 201, description: '주문 생성 성공' })
  @ApiResponse({ status: 400, description: '유효하지 않은 입력값' })
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @ApiOperation({ summary: '모든 주문 조회' })
  @ApiResponse({ status: 200, description: '주문 목록 반환' })
  @Get()
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.orderService.findAllOrders(page, limit);
  }

  @ApiOperation({ summary: '주문 상세 조회' })
  @ApiResponse({ status: 200, description: '주문 상세 정보 반환' })
  @ApiResponse({ status: 404, description: '주문이 존재하지 않음' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.orderService.findOrderById(id);
  }
}
