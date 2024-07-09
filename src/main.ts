import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';
import { ConfigService } from '@nestjs/config';

declare const module: any;

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
    return 'In production mode';
  }
  if (mode === 'development') {
    return 'In development mode';
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
  app.useGlobalPipes(new ValidationPipe());
  await seedRunner(app, 'development');
  await app.listen(port);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
