import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UserService } from '../Services/Query/user';

@Injectable()
export class AuthService {
  private ACCESS_TOKEN_TTL = 60 * 5;              // 5 minutes
  private REFRESH_TOKEN_TTL = 60 * 60 * 24 * 7;   // 7 days

  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /** Generate Access Token */
  private getAccessToken(payload: any) {
    const options: JwtSignOptions = {
      secret: process.env.JWT_ACCESS_SECRET || 'ACCESS_SECRET_DEV',
      expiresIn: this.ACCESS_TOKEN_TTL,
    };
    return this.jwtService.sign(payload, options);
  }

  /** Generate Refresh Token */
  private getRefreshToken(payload: any) {
    const options: JwtSignOptions = {
      secret: process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET_DEV',
      expiresIn: this.REFRESH_TOKEN_TTL,
    };
    return this.jwtService.sign(payload, options);
  }

  /** Validate user credentials */
  async validateUser(email: string, pass: string) {
    return this.usersService.findUser(email, pass);
  }

  /** Login */
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      accessToken: this.getAccessToken(payload),
      refreshToken: this.getRefreshToken(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  /** Refresh Token */
  async refreshTokens(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET_DEV',
      });
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const newPayload = { sub: user.id, email: user.email, role: user.role };

    return {
      accessToken: this.getAccessToken(newPayload),
      refreshToken: this.getRefreshToken(newPayload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
