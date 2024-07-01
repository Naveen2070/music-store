import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { Song } from './song.entity';
import { CreateSongDTO } from 'src/dto/create-songs-dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
  ) {}

  private readonly songs: Array<object> = [];

  create(songDTO: CreateSongDTO): Promise<Song> {
    const song = new Song();
    song.title = songDTO.title;
    song.artists = songDTO.artists;
    song.releasedDate = songDTO.releaseDate;
    song.duration = songDTO.duration;
    song.lyrics = songDTO.lyrics;

    return this.songsRepository.save(song);
  }

  findAll(): Promise<Song[]> {
    return this.songsRepository.find();
  }

  findOne(id: number): Promise<Song> {
    return this.songsRepository.findOneBy({ id });
  }

  remove(id: number): Promise<DeleteResult> {
    return this.songsRepository.delete(id);
  }

  async update(id: number, songDTO: CreateSongDTO): Promise<Song> {
    const song = await this.findOne(id);
    song.title = songDTO.title;
    song.artists = songDTO.artists;
    song.releasedDate = songDTO.releaseDate;
    song.duration = songDTO.duration;
    song.lyrics = songDTO.lyrics;
    return this.songsRepository.save(song);
  }
}
