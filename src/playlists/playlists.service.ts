import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { CreatePlayListDto } from 'src/playlists/dto/create-playlist.dto';
import { UpdatePlayListDto } from 'src/playlists/dto/update-playlist.dto';
import { Playlist } from './entity/playlist.entity';
import { Song } from 'src/songs/entity/song.entity';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class PlayListsService {
  constructor(
    @InjectRepository(Playlist)
    private playListRepo: Repository<Playlist>,

    @InjectRepository(Song)
    private songsRepo: Repository<Song>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(playListDTO: CreatePlayListDto): Promise<Playlist> {
    const playList = new Playlist();
    playList.name = playListDTO.name;

    // songs will be the array of ids that we are getting from the DTO object
    const songs = await this.songsRepo.findBy({ id: In(playListDTO.songs) });
    // set the relation for the songs with playlist entity
    playList.songs = songs;

    // A user will be the id of the user we are getting from the request
    // when we implemented the user authentication this id will become the loggedIn user id
    const user = await this.userRepo.findOneBy({ id: playListDTO.user });
    playList.user = user;

    return this.playListRepo.save(playList);
  }

  findAll(): Promise<Playlist[]> {
    return this.playListRepo.find();
  }

  findOne(id: number): Promise<Playlist> {
    return this.playListRepo.findOneBy({ id });
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.playListRepo.delete(id);
  }

  async update(
    id: number,
    playListDTO: UpdatePlayListDto,
  ): Promise<UpdateResult> {
    const playList = await this.playListRepo.findOneBy({ id });
    playList.name = playListDTO.name;
    return this.playListRepo.update(id, playList);
  }

  async getSongsByPlaylist(id: number): Promise<Song[]> {
    const playList = await this.playListRepo.findOne({
      where: { id },
      relations: ['songs'],
    });
    if (!playList) {
      throw new Error('Playlist not found');
    }
    return playList.songs;
  }
}
