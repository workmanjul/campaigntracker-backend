import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserLoginDto } from './dto/user-login.dto';
import crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login(body: UserLoginDto): Promise<AuthLoginResponse> {
    const user = await this.userService.findUserByEmail(body.email);
    if (user == null) {
      throw new HttpException(
        {
          message: 'Invalid email or password',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const userPassword = crypto
      .createHmac('sha256', body.password)
      .digest('hex');
    if (userPassword != user.password) {
      throw new HttpException(
        {
          message: 'Invalid email or password',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = this.jwtService.sign({
      id: user.id,
      username: user.name,
    });
    return {
      id: user.id,
      token: token,
      expires_in: 86400,
      name: user.name,
      email: user.email,
    };
  }
  async logout(res: Response): Promise<void> {
    try {
      res.clearCookie('token');
    } catch (error) {
      throw new HttpException(
        {
          message: 'Somthing is Wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
