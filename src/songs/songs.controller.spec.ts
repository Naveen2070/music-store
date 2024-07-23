import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/create-songs-dto';
import { UpdateSongDTO } from './dto/update-songs-dto';

describe('SongController', () => {
  let controller: SongsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [
        SongsService,
        {
          provide: SongsService,
          useValue: {
            create: jest.fn().mockImplementation((createSongDTO) => {
              return { id: 1, ...createSongDTO };
            }),
            paginate: jest.fn().mockImplementation(({ page, limit }) => {
              const data = [{ id: 1, title: 'Dancing Feat' }];
              return {
                data,
                page,
                limit,
                totalCount: data.length,
              };
            }),
            findOne: jest.fn().mockImplementation((id) => {
              return { id, title: 'Dancing Feat' };
            }),
            update: jest.fn().mockImplementation((id, updateSongDTO) => {
              return { id, ...updateSongDTO };
            }),
            remove: jest.fn().mockImplementation((id) => {
              return { id };
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<SongsController>(SongsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return a new created song', async () => {
      const newSongDTO: CreateSongDTO = {
        title: 'Runaway',
        artists: [],
        releasedDate: undefined,
        duration: undefined,
        lyrics: '',
      };
      const song = await controller.create(newSongDTO);
      expect(song.title).toBe('Runaway');
      expect(song).toEqual({ id: 1, ...newSongDTO });
    });
  });

  describe('findAll', () => {
    it('should return a paginated result of songs', async () => {
      const page = 1;
      const limit = 10;
      const result = await controller.findAll(page, limit);
      expect(result).toEqual({
        data: [{ id: 1, title: 'Dancing Feat' }],
        page,
        limit,
        totalCount: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return a song by id', async () => {
      expect(await controller.findOne(1)).toEqual({
        id: 1,
        title: 'Dancing Feat',
      });
    });
  });

  describe('update', () => {
    it('should return an updated song by id', async () => {
      const updateSongDTO: UpdateSongDTO = {
        title: 'Dancing Feat',
        artists: [],
        releasedDate: undefined,
        duration: undefined,
        lyrics: '',
      };
      expect(await controller.update(1, updateSongDTO)).toEqual({
        id: 1,
        ...updateSongDTO,
      });
    });
  });

  describe('remove', () => {
    it('should return a removed song by id', async () => {
      expect(await controller.remove(1)).toEqual({ id: 1 });
    });
  });
});
