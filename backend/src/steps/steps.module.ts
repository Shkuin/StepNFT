import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { StepsController } from './steps.controller';
import { StepsService } from './steps.service';

@Module({
  imports: [HttpModule, UserModule, ConfigModule],
  controllers: [StepsController],
  providers: [StepsService],
})
export class StepsModule {}
