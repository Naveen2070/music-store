import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';

async function seedRunner(
  app: INestApplication<any>,
  mode: string,
): Promise<string | void> {
  const seedService = app.get(SeedService);
  if (mode === 'seed') {
    await seedService.seed();
  }
  if (mode === 'purge') {
    await seedService.purge();
  }
  if (mode === 'production') {
    console.log('Production mode');
    return 'In production mode';
  }
  if (mode === 'development') {
    console.log('Development mode');
    return 'In development mode';
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await seedRunner(app, 'development');
  await app.listen(3002);
}
bootstrap();
