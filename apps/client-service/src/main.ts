import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');

  // enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Enable CORS
  app.enableCors();

  // swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Eurocamp Client Service')
    .setDescription(`
      A NestJS client service that consumes the Eurocamp API.
      This service handles these failures gracefully with automatic retries.
    `)
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Eurocamp Client Service API',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  });

  await app.listen(port);

  Logger.log(`🚀 Eurocamp Client Service is running on: http://localhost:${port}`);
  Logger.log(`📚 Swagger documentation available at: http://localhost:${port}/api`);
}

bootstrap();
