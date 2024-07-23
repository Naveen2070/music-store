import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { SongsModule } from '../../src/songs/songs.module';
import { Song } from '../../src/songs/entity/song.entity';
import { Artist } from '../../src/artists/entity/artist.entity';
import { User } from '../../src/users/entity/user.entity';
import { Playlist } from '../../src/playlists/entity/playlist.entity';
import { CreateSongDTO } from '../../src/songs/dto/create-songs-dto';
import { UpdateSongDTO } from '../../src/songs/dto/update-songs-dto';

describe('Songs - /songs', () => {
  let app: INestApplication;
  let songRepository;
  let artistRepository;

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

    songRepository = app.get('SongRepository');
    artistRepository = app.get('ArtistRepository');
  }, 60000);

  afterEach(async () => {
    await songRepository.query('TRUNCATE TABLE "song" CASCADE');
    await artistRepository.query('TRUNCATE TABLE "artist" CASCADE');
    // Similarly, truncate other related tables if necessary
  });

  afterAll(async () => {
    await app.close();
  });

  const createSong = async (createSongDTO: CreateSongDTO): Promise<Song> => {
    const artists = await artistRepository.findByIds(createSongDTO.artists);
    const song = new Song();
    song.title = createSongDTO.title;
    song.releasedDate = createSongDTO.releasedDate;
    song.duration = createSongDTO.duration;
    song.lyrics = createSongDTO.lyrics;
    song.artists = artists;
    return songRepository.save(song);
  };

  it('/POST songs', async () => {
    const createSongDTO: CreateSongDTO = {
      title: 'Hey Jude',
      releasedDate: new Date('1968-08-26'),
      duration: new Date('07:11'),
      lyrics: "Hey Jude, don't make it bad",
      artists: [],
    };

    const result = await request(app.getHttpServer())
      .post('/songs')
      .send(createSongDTO);

    expect(result.status).toBe(201);
    expect(result.body.title).toBe('Hey Jude');
  });

  it('/GET songs', async () => {
    const newSong = await createSong({
      title: 'Animals',
      releasedDate: new Date(),
      duration: new Date(),
      lyrics: 'test',
      artists: [],
    });

    const result = await request(app.getHttpServer()).get('/songs');

    expect(result.status).toBe(200);
    expect(result.body.items).toHaveLength(1);
    expect(result.body.items[0].title).toBe(newSong.title);
  });

  it('/GET songs/:id', async () => {
    const newSong = await createSong({
      title: 'Animals',
      releasedDate: new Date(),
      duration: new Date(),
      lyrics: 'test',
      artists: [],
    });

    const result = await request(app.getHttpServer()).get(
      `/songs/${newSong.id}`,
    );

    expect(result.status).toBe(200);
    expect(result.body.title).toBe(newSong.title);
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
      lyrics: 'updated lyrics',
      artists: [],
    };

    const result = await request(app.getHttpServer())
      .put(`/songs/${newSong.id}`)
      .send(updateSongDTO);

    expect(result.status).toBe(200);
    expect(result.body.affected).toEqual(1);
  });

  it('/DELETE songs/:id', async () => {
    const newSong = await createSong({
      title: 'Animals',
      releasedDate: new Date(),
      duration: new Date(),
      lyrics: 'test',
      artists: [],
    });

    const result = await request(app.getHttpServer()).delete(
      `/songs/${newSong.id}`,
    );

    expect(result.status).toBe(200);
    expect(result.body.affected).toBe(1);
  });
});
