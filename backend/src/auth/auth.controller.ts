import { Controller, Headers, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthBodyModel } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(
    @Headers('authorization') magicDidToken: string,
    @Body() body: AuthBodyModel,
  ) {
    return this.authService.login(magicDidToken, body);
  }
}
