import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { DevConfigService } from './common/providers/devConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Song } from './songs/entity/song.entity';
import { Artist } from './artists/entity/artist.entity';
import { User } from './users/entity/user.entity';
import { PlaylistsModule } from './playlists/playlists.module';
import { UsersModule } from './users/users.module';
import { Playlist } from './playlists/entity/playlist.entity';
import { AuthModule } from './auth/auth.module';
import { ArtistsModule } from './artists/artists.module';

const devConfig = { port: 3000 };
const prodConfig = { port: 4000 };

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'naveen2007',
      database: 'spotifyClone',
      entities: [Song, Artist, User, Playlist],
      synchronize: true,
    }),
    SongsModule,
    PlaylistsModule,
    UsersModule,
    AuthModule,
    ArtistsModule,
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
  constructor(private dataSource: DataSource) {
    console.log(dataSource.driver.database);
  }
}
