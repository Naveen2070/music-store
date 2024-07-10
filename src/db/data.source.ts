import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables based on NODE_ENV
const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';
dotenv.config({ path: join(__dirname, '..', '..', envFile) });

import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { Artist } from 'src/artists/entity/artist.entity';
import { Playlist } from 'src/playlists/entity/playlist.entity';
import { Song } from 'src/songs/entity/song.entity';
import { User } from 'src/users/entity/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    const dbHost = configService.get<string>('DBHOST');
    const dbPort = configService.get<number>('DBPORT');
    const dbUser = configService.get<string>('DBUSER');
    const dbPassword = configService.get<string>('DBPASSWORD');
    const dbName = configService.get<string>('DBNAME');

    return {
      type: 'postgres',
      host: dbHost,
      port: dbPort,
      username: dbUser,
      password: dbPassword,
      database: dbName,
      entities: [User, Playlist, Artist, Song],
      synchronize: false,
      migrations: ['dist/db/migrations/*.js'],
    };
  },
};

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DBHOST,
  port: parseInt(process.env.DBPORT),
  username: process.env.DBUSER,
  database: process.env.DBNAME,
  password: process.env.DBPASSWORD,
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions); //4
export default dataSource;
