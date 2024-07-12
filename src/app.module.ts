import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { DevConfigService } from './common/providers/devConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistsModule } from './playlists/playlists.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ArtistsModule } from './artists/artists.module';
import { typeOrmAsyncConfig } from './db/data.source';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import nestConfiguration from './config/nest.configuration';
import { validate } from './config/config.validator';

const devConfig = { port: 3000 };
const prodConfig = { port: 4000 };

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `${process.cwd()}/.env.${process.env.NODE_ENV || 'development'}`,
      ],
      load: [nestConfiguration],
      validate: validate,
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    SongsModule,
    PlaylistsModule,
    UsersModule,
    AuthModule,
    ArtistsModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: DevConfigService,
      useClass: DevConfigService,
    },
    {
      provide: 'CONFIG',
      useFactory: () =>
        process.env.NODE_ENV === 'development' ? devConfig : prodConfig,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(SongsController);
  }
}
