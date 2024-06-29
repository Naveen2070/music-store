import { Injectable } from '@nestjs/common';

@Injectable()
export class SongsService {
  private readonly songs: Array<object> = [];

  create(song: object) {
    this.songs.push(song);
    return this.songs;
  }

  findAll() {
    // throw new Error('no found');
    return this.songs;
  }
}
