import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { SyncMoviesCron } from './cron/sync-movies.cron';
 dotenv.config();

async function bootstrap() { 
  
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization, Origin, Accept',
  });

  const config = new DocumentBuilder()
    .setTitle('Movies Api') 
    .setDescription('Api para gestionar los movies')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document,{
    swaggerOptions: {
      persistAuthorization: true,
    },
    customJs: `
    window.onload = function() {
      // Intenta recuperar el token almacenado en localStorage
      const savedToken = localStorage.getItem('swagger_jwt_token');
      if (savedToken) {
        setTimeout(() => {
          document.querySelector('input[placeholder="api_key"]').value = savedToken;
          document.querySelector('.auth-wrapper .btn').click();
        }, 1000);
      }

      // Interceptar cuando el usuario se autentica y almacenar el token
      const originalAuthorize = window.ui.getState().toJS().auth.authorize;
      window.ui.getState().toJS().auth.authorize = function(authData) {
        if (authData.bearerAuth && authData.bearerAuth.value) {
          localStorage.setItem('swagger_jwt_token', authData.bearerAuth.value);
        }
        return originalAuthorize(authData);
      };
    };
  `,
  });


  await app.listen(3000);
}

bootstrap();
