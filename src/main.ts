import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Import Swagger related modules
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './intercepter/response.interceptor';
import * as morgan from 'morgan';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('tiny')); // Use Morgan for request logging
  app.enableCors({
    origin: ['http://localhost:3000'] // Enable CORS for your frontend app
  });

  // Define Swagger documentation options
  const options = new DocumentBuilder()
    .setTitle('Boilerplate')
    .setDescription('The Boiler API description')
    .setVersion('1.0')
    .addTag('Boiler')
    .addBearerAuth() // If your API uses bearer token authentication
    .build();

  // Generate the Swagger document
  const document = SwaggerModule.createDocument(app, options);

  // Set up Swagger UI at the '/api' endpoint
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe()); // Use global validation pipe
  app.useGlobalInterceptors(new ResponseInterceptor()); // Use global response interceptor

  await app.listen(process.env.PORT || 5000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
