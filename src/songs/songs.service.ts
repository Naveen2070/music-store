import { Injectable } from '@nestjs/common';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { Song } from '../entity/song.entity';
import { CreateSongDTO } from 'src/dto/songs/create-songs-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSongDTO } from 'src/dto/songs/update-songs-dto';
import {
  Pagination,
  IPaginationOptions,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Artist } from '../entity/artist.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) {}

  private readonly songs: Array<object> = [];

  async create(songDTO: CreateSongDTO): Promise<Song> {
    const song = new Song();
    song.title = songDTO.title;
    song.artists = songDTO.artists;
    song.releasedDate = songDTO.releasedDate;
    song.duration = songDTO.duration;
    song.lyrics = songDTO.lyrics;

    const artists = await this.artistsRepository.findBy({
      id: In(songDTO.artists),
    });

    song.artists = artists;
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

  update(id: number, updateSongDTO: UpdateSongDTO): Promise<UpdateResult> {
    return this.songsRepository.update(id, updateSongDTO);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    const queryBuilder = this.songsRepository.createQueryBuilder('song');
    queryBuilder.orderBy('song.releasedDate', 'DESC');
    return paginate<Song>(queryBuilder, options);
  }
}
