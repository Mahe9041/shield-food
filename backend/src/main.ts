import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // All routes will be prefixed with /api
  // So /auth/login becomes /api/auth/login
  app.setGlobalPrefix('api');

  // Allow React (port 3000) to call this API
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // ValidationPipe activates our DTO decorators (@IsEmail, @IsString etc.)
  // whitelist: true — strips any fields not in the DTO (security)
  // transform: true — converts plain JSON to DTO class instances
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Our custom error filter for consistent error responses
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(3001);
  console.log('🚀 SHIELD Food API running on http://localhost:3001');
}
bootstrap();
