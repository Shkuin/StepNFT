import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configDotenv } from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = configDotenv();
  console.log(`Starting NestJS App on ${config.parsed.PORT}`);
  await app.listen(config.parsed.PORT || 3001);
}
bootstrap();
