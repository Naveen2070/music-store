import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PlayListsService } from './playlists.service';
import { CreatePlayListDto } from 'src/playlists/dto/create-playlist.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Playlist } from './entity/playlist.entity';
import { Song } from 'src/songs/entity/song.entity';

@Controller('playlists')
export class PlayListsController {
  constructor(private playListService: PlayListsService) {}
  @Post()
  create(
    @Body()
    playlistDTO: CreatePlayListDto,
  ): Promise<Playlist> {
    return this.playListService.create(playlistDTO);
  }

  @Get()
  findAll(): Promise<Playlist[]> {
    return this.playListService.findAll();
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<Playlist> {
    return this.playListService.findOne(id);
  }

  @Delete(':id')
  remove(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<DeleteResult> {
    return this.playListService.remove(id);
  }

  @Put(':id')
  update(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
    @Body() playlistDTO: CreatePlayListDto,
  ): Promise<UpdateResult> {
    return this.playListService.update(id, playlistDTO);
  }

  @Get(':id/songs')
  getSongsByPlaylist(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<Song[]> {
    return this.playListService.getSongsByPlaylist(id);
  }
}
