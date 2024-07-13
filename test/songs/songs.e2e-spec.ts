import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Song } from '../../src/songs/entity/song.entity';
import { SongsModule } from '../../src/songs/songs.module';
import { CreateSongDTO } from '../../src/songs/dto/create-songs-dto';
import { UpdateSongDTO } from '../../src/songs/dto/update-songs-dto';
import { Artist } from '../../src/artists/entity/artist.entity';
import { User } from '../../src/users/entity/user.entity';
import { Playlist } from '../../src/playlists/entity/playlist.entity';

describe('Songs - /songs', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'naveen2007',
          database: 'spotifyClone',
          synchronize: true,
          entities: [Song, Artist, User, Playlist],
          dropSchema: true,
        }),
        SongsModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  }, 60000);

  afterEach(async () => {
    // Fetch all the entities
    const songRepository = app.get('SongRepository');
    await songRepository.clear();
  }, 10000);

  const createSong = (createSongDTO: CreateSongDTO): Promise<Song> => {
    const song = new Song();
    song.title = createSongDTO.title;
    const songRepo = app.get('SongRepository');
    return songRepo.save(song);
  };

  it('/POST songs', async () => {
    const createSongDTO = {
      title: 'Hey Jude',
      releasedDate: '1968-08-26',
      duration: '07:11',
      lyrics: "Hey Jude, don't make",
    };
    const results = await request(app.getHttpServer())
      .post(`/songs`)
      .send(createSongDTO);
    expect(results.status).toBe(201);
    expect(results.body.title).toBe('Animals');
  });

  it(`/GET songs`, async () => {
    const newSong = await createSong({
      title: 'Animals',
      releasedDate: new Date(),
      duration: new Date(),
      lyrics: 'test',
      artists: [],
    });
    const results = await request(app.getHttpServer()).get('/songs');
    expect(results.statusCode).toBe(200);
    expect(results.body).toHaveLength(1);
    expect(results.body).toEqual([newSong]);
  });

  it('/GET songs/:id', async () => {
    const newSong = await createSong({
      title: 'Animals',
      releasedDate: new Date(),
      duration: new Date(),
      lyrics: 'test',
      artists: [],
    });
    const results = await request(app.getHttpServer()).get(
      `/songs/${newSong.id}`,
    );
    expect(results.statusCode).toBe(200);
    expect(results.body).toEqual(newSong);
  });

  it('/PUT songs/:id', async () => {
    const newSong = await createSong({
      title: 'Animals',
      releasedDate: new Date(),
      duration: new Date(),
      lyrics: 'test',
      artists: [],
    });
    const updateSongDTO: UpdateSongDTO = {
      title: 'Wonderful',
      releasedDate: new Date(),
      duration: new Date(),
      lyrics: 'test',
      artists: [],
    };
    const results = await request(app.getHttpServer())
      .put(`/songs/${newSong.id}`)
      .send(updateSongDTO as UpdateSongDTO);
    expect(results.statusCode).toBe(200);
    expect(results.body.affected).toEqual(1);
  });

  it('/DELETE songs', async () => {
    const createSongDTO: CreateSongDTO = {
      title: 'Animals',
      releasedDate: new Date(),
      duration: new Date(),
      lyrics: 'test',
      artists: [],
    };
    const newSong = await createSong(createSongDTO);
    const results = await request(app.getHttpServer()).delete(
      `/songs/${newSong.id}`,
    );
    expect(results.statusCode).toBe(200);
    expect(results.body.affected).toBe(1);
  });
});
