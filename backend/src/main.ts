import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://quynhdemo.click',
    'https://quynhdemo.click',
    'http://api.quynhdemo.click',
    'https://api.quynhdemo.click',
    'http://192.168.100.157:3000',
    'http://192.168.100.157:3001',
    'http://1.54.243.244',
    'http://1.54.243.244:3000',
    'http://1.54.243.244:3001',
  ],
  credentials: true,
});


  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads/' });

  await app.listen(3001, '0.0.0.0');
}
bootstrap();
