import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { COOKIE_DOMAIN } from '../config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  generateToken(@Body() body: UserLoginDto, @Res() res: Response): any {
    return this.authService.login(body).then((response) => {
      const days_90 = 90 * 24 * 60 * 60 * 1000;
      res
        .status(200)
        .cookie('token', response.token, {
          expires: new Date(Date.now() + days_90),
          httpOnly: true,
          secure: true,
          domain: COOKIE_DOMAIN,
        })
        .json({
          success: true,
          message: 'LogIn Successfully',
        });
    });
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    await this, this.authService.logout(res);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'LogOut Successfully',
    });
  }
}
