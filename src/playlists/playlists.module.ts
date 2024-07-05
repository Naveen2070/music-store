import { Module } from '@nestjs/common';
import { PlayListsController } from './playlists.controller';
import { PlayListsService } from './playlists.service';
import { Song } from 'src/entity/song.entity';
import { Playlist } from '../entity/playlist.entity';
import { User } from 'src/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, Song, User])],
  controllers: [PlayListsController],
  providers: [PlayListsService],
})
export class PlaylistsModule {}
