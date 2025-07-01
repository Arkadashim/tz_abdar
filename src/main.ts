import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get('port') as number;

  const swaggerSetup = new DocumentBuilder().setTitle('TZ_AbDar').build();

  SwaggerModule.setup('docs', app, () =>
    SwaggerModule.createDocument(app, swaggerSetup),
  );

  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(port);
}

void bootstrap();
