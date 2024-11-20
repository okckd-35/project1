import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dtos/create-auth.dto';
import { LoginAuthDto } from './dtos/login-auth.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // 회원가입
  async register(createAuthDto: CreateAuthDto) {
    const { email, password } = createAuthDto;

    const userExists = await this.userRepository.findOne({ where: { email } });
    if (userExists) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ ...createAuthDto, password: hashedPassword });
    const savedUser = await this.userRepository.save(user);

    // 이메일 인증 코드 생성 및 발송
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    savedUser.verificationCode = verificationCode;
    await this.userRepository.save(savedUser);

    await this.sendVerificationEmail(email, verificationCode);

    return { message: '회원가입이 완료되었습니다. 이메일 인증을 진행해주세요.' };
  }

  // 로그인
  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('잘못된 이메일 또는 비밀번호입니다.');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('이메일 인증이 필요합니다.');
    }

    const payload = { id: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return { accessToken: token };
  }

  // 이메일 인증 
  async verifyEmail(email: string, code: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('사용자를 찾을 수 없습니다.');
    }

    if (user.verificationCode !== code) {
      throw new BadRequestException('인증 코드가 올바르지 않습니다.');
    }

    user.isVerified = true;
    user.verificationCode = null;
    await this.userRepository.save(user);

    return { message: '이메일 인증이 완료되었습니다.' };
  }

  // 이메일 발송 
  private async sendVerificationEmail(email: string, code: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // .env 파일에서 설정된 Gmail 계정
        pass: process.env.GMAIL_PASSWORD, // .env 파일에서 설정된 Gmail 비밀번호
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: '이메일 인증 코드',
      text: `인증 코드: ${code}`,
    };

    await transporter.sendMail(mailOptions);
  }
}

