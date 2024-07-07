import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './entity/artist.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entity/user.entity';
import { Song } from 'src/songs/entity/song.entity';
import { CreateArtistDTO } from './dto/create-artists.dto';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
  ) {}

  async createArtist(artistDto: CreateArtistDTO): Promise<Artist> {
    const { userId, songIds } = artistDto;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    const songs = songIds
      ? await this.songRepository.findBy({ id: In(songIds) })
      : [];

    const artist = this.artistRepository.create({
      user,
      songs,
    });
    await this.artistRepository.save(artist);
    delete artist.user.password;
    return this.findArtist(artist.user.id);
  }

  findArtist(userId: number): Promise<Artist> {
    return this.artistRepository.findOne({
      where: { user: { id: userId } },
    });
  }

  findAll(): Promise<Artist[]> {
    return this.artistRepository.find();
  }
}
