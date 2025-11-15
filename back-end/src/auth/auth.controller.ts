import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private get cookieOptions() {
    const isProd =
      process.env.RENDER === 'true' ||
      process.env.NODE_ENV === 'production';

    return {
      httpOnly: true,
      secure: isProd,               
      sameSite: isProd ? 'none' : 'lax', 
      path: '/',                    
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    } as const;
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(body.email, body.password);

    res.cookie('refresh_token', refreshToken, this.cookieOptions);

    return { accessToken, user };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    const {
      accessToken,
      refreshToken: rotatedToken,
      user,
    } = await this.authService.refreshTokens(refreshToken);

    res.cookie('refresh_token', rotatedToken, this.cookieOptions);

    return { accessToken, user };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    const isProd =
      process.env.RENDER === 'true' ||
      process.env.NODE_ENV === 'production';

    res.clearCookie('refresh_token', {
      path: '/',
      sameSite: isProd ? 'none' : 'lax',
      secure: isProd,
    });

    return { success: true };
  }
}
