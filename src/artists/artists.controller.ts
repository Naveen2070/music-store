import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDTO } from './dto/create-artists.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('artists')
@ApiTags('Artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post()
  createArtist(@Body() createArtistDto: CreateArtistDTO) {
    return this.artistsService.createArtist(createArtistDto);
  }

  @Get()
  findAll() {
    return this.artistsService.findAll();
  }

  @Get(':userId')
  findArtist(@Param('userId') userId: number) {
    return this.artistsService.findArtist(userId);
  }
}
