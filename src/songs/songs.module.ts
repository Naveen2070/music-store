import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './entity/song.entity';
import { Artist } from '../artists/entity/artist.entity';
import { User } from '../users/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Song, Artist, User])],
  controllers: [SongsController],
  providers: [SongsService],
  exports: [SongsService, TypeOrmModule],
})
export class SongsModule {}
