import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';     // 👈 LƯU Ý path
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminController {
  @Roles('admin')
  @Get('secret')
  getAdminStuff() {
    return { secret: 'for admin only' };
  }
}
