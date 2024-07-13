import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from './songs.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateSongDTO } from './dto/create-songs-dto';
import { UpdateSongDTO } from './dto/update-songs-dto';
import { Song } from './entity/song.entity';
import { Artist } from 'src/artists/entity/artist.entity';

describe('SongsService', () => {
  let service: SongsService;
  let songRepo: Repository<Song>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let artistRepo: Repository<Artist>;

  const oneSong = {
    id: 1,
    title: 'Lover',
    artists: [],
    releasedDate: null,
    duration: null,
    lyrics: '',
    playList: undefined,
  };
  const songArray = [
    {
      id: 1,
      title: 'Lover',
      artists: [],
      releasedDate: null,
      duration: null,
      lyrics: '',
      playList: undefined,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          provide: getRepositoryToken(Song),
          useValue: {
            create: jest
              .fn()
              .mockImplementation((createSongDTO: CreateSongDTO) => {
                return { id: 1, ...createSongDTO };
              }),
            find: jest.fn().mockImplementation(() => {
              return songArray;
            }),
            save: jest.fn().mockImplementation(() => {
              return oneSong;
            }),
            findOneBy: jest.fn().mockImplementation((id) => {
              const song = songArray.find((song) => song.id === id.id);
              return song;
            }),
            update: jest
              .fn()
              .mockImplementation((id, updateSongDTO: UpdateSongDTO) => {
                return { id, ...updateSongDTO };
              }),
            delete: jest.fn().mockImplementation((id) => {
              return { id };
            }),
          },
        },
        {
          provide: getRepositoryToken(Artist),
          useValue: {
            findBy: jest.fn().mockImplementation(() => {
              return [];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
    songRepo = module.get<Repository<Song>>(getRepositoryToken(Song));
    artistRepo = module.get<Repository<Artist>>(getRepositoryToken(Artist));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new song', async () => {
    const newSongDTO: CreateSongDTO = {
      title: 'Lover',
      artists: [],
      releasedDate: null,
      duration: null,
      lyrics: '',
    };
    const song = await service.create(newSongDTO);
    const repoSpy = jest.spyOn(songRepo, 'save');
    expect(song).toEqual(oneSong);
    expect(repoSpy).toHaveBeenCalledTimes(1);
    expect(repoSpy).toHaveBeenCalledWith({ ...newSongDTO });
  });

  it('should return an array of songs', async () => {
    const songs = await service.findAll();
    const repoSpy = jest.spyOn(songRepo, 'find');
    expect(songs).toEqual(songArray);
    expect(repoSpy).toHaveBeenCalled();
  });

  it('should return a song by id', async () => {
    const song = await service.findOne(1);
    const repoSpy = jest.spyOn(songRepo, 'findOneBy');
    expect(song).toEqual(oneSong);
    expect(repoSpy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should update a song by id', async () => {
    const updateSongDTO: UpdateSongDTO = {
      title: 'Lover',
      artists: [],
      releasedDate: undefined,
      duration: undefined,
      lyrics: '',
    };
    const song = await service.update(1, updateSongDTO);
    const repoSpy = jest.spyOn(songRepo, 'update');
    expect(song).toEqual({ id: 1, ...updateSongDTO });
    expect(repoSpy).toHaveBeenCalledWith(1, updateSongDTO);
  });

  it('should remove a song by id', async () => {
    const song = await service.remove(1);
    const repoSpy = jest.spyOn(songRepo, 'delete');
    expect(song).toEqual({ id: 1 });
    expect(repoSpy).toHaveBeenCalledWith(1);
  });
});
