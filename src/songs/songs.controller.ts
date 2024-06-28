import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from 'src/dto/create-songs-dto';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  findAll() {
    return this.songsService.findAll();
  }

  @Post()
  create(@Body() createSongDTO: CreateSongDTO) {
    return this.songsService.create(createSongDTO);
  }

  @Get(':id')
  find() {
    return 'This action returns a single song';
  }

  @Put(':id')
  update() {
    return 'This action updates a song';
  }

  @Delete(':id')
  remove() {
    return 'This action removes a song';
  }
}
