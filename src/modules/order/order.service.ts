import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const user = await this.userRepository.findOne({ where: { id: createOrderDto.userId } });
    const product = await this.productRepository.findOne({ where: { id: createOrderDto.productId } });

    if (!user || !product) {
      throw new Error('유효하지 않은 사용자 또는 상품입니다.');
    }

    const totalPrice = product.price * createOrderDto.quantity;

    const order = this.orderRepository.create({
      user,
      product,
      quantity: createOrderDto.quantity,
      totalPrice,
    });

    return this.orderRepository.save(order);
  }

  async findAllOrders(page: number, limit: number) {
    const [orders, total] = await this.orderRepository.findAndCount({
      relations: ['user', 'product'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: orders,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOrderById(id: number) {
    return this.orderRepository.findOne({ where: { id }, relations: ['user', 'product'] });
  }
}

