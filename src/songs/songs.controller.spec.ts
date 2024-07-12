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
              return { id: 'a uuid', ...createSongDTO };
            }),
            findAll: jest.fn().mockImplementation(() => {
              return [{ id: 1, title: 'Dancing Feat' }];
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
    it('should return a new song', async () => {
      const newSongDTO: CreateSongDTO = {
        title: 'Runaway',
        artists: [],
        releasedDate: undefined,
        duration: undefined,
        lyrics: '',
      };
      const song = await controller.create(newSongDTO);
      expect(song.title).toBe('Runaway');
      expect(song).toEqual({ id: 'a uuid', title: 'Runaway' });
    });

    describe('findAll', () => {
      it('should return an array of songs', async () => {
        expect(await controller.findAll()).toEqual([
          { id: 1, title: 'Dancing Feat' },
        ]);
      });
    });

    describe('findOne', () => {
      it('should return a song', async () => {
        expect(await controller.find(1)).toEqual({
          id: 1,
          title: 'Dancing Feat',
        });
      });
    });

    describe('update', () => {
      it('should return an updated song', async () => {
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
      it('should return a removed song', async () => {
        expect(await controller.delete(1)).toEqual({ id: 1 });
      });
    });
  });
});
