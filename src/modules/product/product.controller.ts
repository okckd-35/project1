import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/role.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Product')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: '상품 생성' })
  @ApiResponse({ status: 201, description: '상품 생성 성공' })
  @Post()
  @Roles('admin')
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @ApiOperation({ summary: '모든 상품 조회' })
  @ApiResponse({ status: 200, description: '상품 목록 반환' })
  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: '상품 상세 조회' })
  @ApiResponse({ status: 200, description: '상품 상세 정보 반환' })
  @ApiResponse({ status: 404, description: '상품이 존재하지 않음' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  @ApiOperation({ summary: '상품 수정' })
  @ApiResponse({ status: 200, description: '상품 수정 성공' })
  @ApiResponse({ status: 404, description: '상품이 존재하지 않음' })
  @Put(':id')
  @Roles('admin')
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @ApiOperation({ summary: '상품 삭제' })
  @ApiResponse({ status: 200, description: '상품 삭제 성공' })
  @ApiResponse({ status: 404, description: '상품이 존재하지 않음' })
  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }
}
