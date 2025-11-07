import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  app.enableCors();
  
  const config = new DocumentBuilder()
    .setTitle('PregnaTrack API')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Insira o token JWT retornado pelo login',
        in: 'header',
      },
      'JWT-auth'
    )
    .addTag('🔐 Autenticação', 'Endpoints para login e verificação de perfil')
    .addTag('👨‍⚕️ Doctors', 'CRUD completo de médicos')
    .addTag('🤰 Patients', 'CRUD completo de pacientes')
    .addTag('🔔 Notifications', 'Gerenciamento de notificações')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'PregnaTrack API Docs',
    customfavIcon: '🤰',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #e91e63; }
      .swagger-ui .info .description { margin-top: 20px; }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 15px; border-radius: 5px; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  });
  
  console.log('📚 Swagger docs available at: http://localhost:3000/api');
  
  await app.listen(3000);
}
bootstrap();
