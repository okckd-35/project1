import { IsEmail, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;

  @IsString()
  password: string;
}