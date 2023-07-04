import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportMagicStrategy } from './passport.magic-strategy';
@Module({
  imports: [HttpModule, ConfigModule, PassportModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, PassportMagicStrategy],
  exports: [AuthService],
})
export class AuthModule {}
