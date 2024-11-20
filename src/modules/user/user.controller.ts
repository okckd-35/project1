import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('User')
@Controller('users')
@UseGuards(RolesGuard, JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '회원 생성' })
  @ApiResponse({ status: 201, description: '회원 생성 성공' })
  @Post()
  @Roles('admin')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @ApiOperation({ summary: '회원 조회' })
  @ApiResponse({ status: 200, description: '회원 조회 성공' })
  @ApiResponse({ status: 404, description: '회원이 존재하지 않음' })
  @Get(':id')
  @Roles('user', 'admin')
  async findById(@Param('id') id: number) {
    return this.userService.findUserById(id);
  }
}
