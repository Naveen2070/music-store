import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Song } from '../../src/songs/entity/song.entity';
import { SongsModule } from '../../src/songs/songs.module';
import { CreateSongDTO } from '../../src/songs/dto/create-songs-dto';
import { UpdateSongDTO } from '../../src/songs/dto/update-songs-dto';

describe('Songs - /songs', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: 'postgres://postgres:naveen2007@localhost:5432/spotifyClone',
          synchronize: true,
          entities: [Song],
          dropSchema: true,
        }),
        SongsModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    // Fetch all the entities
    const songRepository = app.get('SongRepository');
    await songRepository.clear();
  });

  const createSong = (createSongDTO: CreateSongDTO): Promise<Song> => {
    const song = new Song();
    song.title = createSongDTO.title;
    const songRepo = app.get('SongRepository');
    return songRepo.save(song);
  };

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

  it('/POST songs', async () => {
    const createSongDTO = { title: 'Animals' };
    const results = await request(app.getHttpServer())
      .post(`/songs`)
      .send(createSongDTO as CreateSongDTO);
    expect(results.status).toBe(201);
    expect(results.body.title).toBe('Animals');
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
