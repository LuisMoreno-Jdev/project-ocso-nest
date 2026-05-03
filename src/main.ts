import * as dotenv from 'dotenv';
dotenv.config();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express'; // Importante
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // 1. Especificamos que la app es de tipo NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: process.env.allowedOrigin,
      credentials: true,
    }
  });

  app.useStaticAssets(join(__dirname, '..', 'src/employees/employees-photos'), {
    prefix: '/employees/photos', // Esta será la ruta en la URL
  });

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Ocso API')
    .setDescription('Api for ocso management')
    .setVersion('0.9')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
  }));

  // Tu puerto es el 4000 según el código
  await app.listen(4000);
}
bootstrap();