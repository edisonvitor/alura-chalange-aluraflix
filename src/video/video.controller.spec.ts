import { Test, TestingModule } from '@nestjs/testing';
import { VideoEntity } from './entities/video.entity';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { JwtModule, JwtService } from '@nestjs/jwt';

const videoEntityList: VideoEntity[] = [
  new VideoEntity({
    id: '1',
    titulo: 'titulo 1',
    descricao: 'descricao 1',
    url: 'http://url1.com',
    categoriaId: '1',
    free: true,
  }),
  new VideoEntity({
    id: '2',
    titulo: 'titulo 2',
    descricao: 'descricao 2',
    url: 'http://url2.com',
    categoriaId: '1',
    free: false,
  }),
  new VideoEntity({
    id: '2',
    titulo: 'titulo 2',
    descricao: 'descricao 2',
    url: 'http://url2.com',
    categoriaId: '1',
    free: false,
  }),
  new VideoEntity({
    id: '2',
    titulo: 'titulo 2',
    descricao: 'descricao 2',
    url: 'http://url2.com',
    categoriaId: '1',
    free: false,
  }),
  new VideoEntity({
    id: '2',
    titulo: 'titulo 2',
    descricao: 'descricao 2',
    url: 'http://url2.com',
    categoriaId: '1',
    free: false,
  }),
  new VideoEntity({
    id: '2',
    titulo: 'titulo 2',
    descricao: 'descricao 2',
    url: 'http://url2.com',
    categoriaId: '1',
    free: false,
  }),
];

const newVideoEntity: VideoEntity = new VideoEntity({
  id: '3',
  titulo: 'titulo 1',
  descricao: 'descricao 1',
  url: 'http://url3.com',
  categoriaId: '1',
});

describe('videoController', () => {
  let videoController: VideoController;
  let videoService: VideoService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secret' })],
      controllers: [VideoController],
      providers: [
        JwtService,
        {
          provide: VideoService,
          useValue: {
            create: jest.fn().mockReturnValue(newVideoEntity),
            findFree: jest.fn().mockResolvedValue(videoEntityList[0]),
            findAll: jest.fn().mockResolvedValue(videoEntityList),
            findAllPaginate: jest
              .fn()
              .mockResolvedValue(videoEntityList.length === 5),
            findOne: jest.fn().mockResolvedValue(videoEntityList[0]),
            findVidoesByCategoria: jest
              .fn()
              .mockResolvedValue(videoEntityList[0]),
            findVidoesByTitulo: jest.fn().mockResolvedValue(videoEntityList[0]),
            update: jest.fn().mockResolvedValue(newVideoEntity),
            remove: jest.fn().mockResolvedValue(videoEntityList[0]),
          },
        },
      ],
    }).compile();

    (videoController = module.get<VideoController>(VideoController)),
      (videoService = module.get<VideoService>(VideoService));
  });

  it('should be defined', () => {
    expect(videoController).toBeDefined();
    expect(videoService).toBeDefined();
  });

  describe('findFree', () => {
    it('deve retornar os videos com a coluna free = true', async () => {
      // act
      const result = await videoController.findFree();

      // assert
      expect(result).toEqual(videoEntityList[0]);
    });

    it('deve lançar um erro', () => {
      jest.spyOn(videoService, 'findFree').mockRejectedValueOnce(new Error());
      expect(videoController.findFree()).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('deve criar um novo video', async () => {
      const body: CreateVideoDto = {
        // arrange
        id: '3',
        titulo: 'titulo 1',
        descricao: 'descricao 1',
        url: 'http://url3.com',
        categoriaId: '1',
        categoria: '1',
      };

      // act
      const result = await videoController.create(body);

      // assert
      expect(result).toEqual(newVideoEntity);
    });

    it('deve lançar um erro', () => {
      const body: CreateVideoDto = {
        // arrange
        id: '3',
        titulo: 'titulo 1',
        descricao: 'descricao 1',
        url: 'http://url3.com',
        categoria: '1',
        categoriaId: '1',
      };
      jest.spyOn(videoService, 'create').mockRejectedValueOnce(new Error());
      expect(videoController.create(body)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de videos', async () => {
      // act
      const result = await videoController.findAll();

      // assert
      expect(result).toEqual(videoEntityList);
    });

    it('deve lançar um erro', () => {
      jest.spyOn(videoService, 'findAll').mockRejectedValueOnce(new Error());
      expect(videoController.findAll()).rejects.toThrow();
    });
  });

  describe('findAllPaginated', () => {
    it('deve retornar uma lista de videos paginada com 5 videos', async () => {
      // act
      const result = await videoController.findAllPaginated();

      // assert
      expect(result).toEqual(videoEntityList.length === 5);
    });

    it('deve lançar um erro', () => {
      jest
        .spyOn(videoService, 'findAllPaginate')
        .mockRejectedValueOnce(new Error());
      expect(videoController.findAllPaginated()).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('deve retornar um video', async () => {
      // act
      const result = await videoController.findOne('1');

      // assert
      expect(result).toEqual(videoEntityList[0]);
    });

    it('deve lançar um erro', () => {
      jest.spyOn(videoService, 'findOne').mockRejectedValueOnce(new Error());
      expect(videoController.findOne('1')).rejects.toThrow();
    });
  });

  describe('findVidoesByCategoria', () => {
    it('deve retornar uma lista de videos pela categoria', async () => {
      // act
      const result = await videoController.findVidoesByCategoria('1');

      // assert
      expect(result).toEqual(videoEntityList[0]);
    });

    it('deve lançar um erro', () => {
      jest
        .spyOn(videoService, 'findVidoesByCategoria')
        .mockRejectedValueOnce(new Error());
      expect(videoController.findVidoesByCategoria('1')).rejects.toThrow();
    });
  });

  describe('findVidoesByTitulo', () => {
    it('deve retornar uma lista de videos pelo titulo', async () => {
      // act
      const result = await videoController.findVidoesByTitulo('titulo 1');

      // assert
      expect(result).toEqual(videoEntityList[0]);
    });

    it('deve lançar um erro', () => {
      jest
        .spyOn(videoService, 'findVidoesByTitulo')
        .mockRejectedValueOnce(new Error());
      expect(videoController.findVidoesByTitulo('titulo 1')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('deve atualizar um video', async () => {
      // arrange
      const body: UpdateVideoDto = {
        // arrange
        id: '3',
        titulo: 'titulo 1',
        descricao: 'descricao 1',
        url: 'http://url3.com',
        categoria: '1',
      };

      // act
      const result = await videoController.update('1', body);

      // assert
      expect(result).toEqual(newVideoEntity);
    });

    it('deve lançar um erro', () => {
      const body: UpdateVideoDto = {
        // arrange
        id: '3',
        titulo: 'titulo 1',
        descricao: 'descricao 1',
        url: 'http://url3.com',
        categoria: '1',
      };
      jest.spyOn(videoService, 'update').mockRejectedValueOnce(new Error());
      expect(videoController.update('1', body)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('deve remover um video', async () => {
      // act
      const result = await videoController.remove('1');

      // assert
      expect(result).toEqual(videoEntityList[0]);
    });

    it('deve lançar um erro', () => {
      jest.spyOn(videoService, 'remove').mockRejectedValueOnce(new Error());
      expect(videoController.remove('1')).rejects.toThrow();
    });
  });
});
