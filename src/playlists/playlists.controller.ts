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
import { CreatePlayListDto } from 'src/dto/playlists/create-playlist.dto';
import { Playlist } from 'src/entity/playlist.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

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
}
