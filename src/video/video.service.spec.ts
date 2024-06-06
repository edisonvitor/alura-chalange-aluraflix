import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideoEntity } from './entities/video.entity';
import { VideoService } from './video.service';
import { UpdateVideoDto } from './dto/update-video.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

const videoEntityList: CreateVideoDto[] = [
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
  }),
  new VideoEntity({
    id: '2',
    titulo: 'titulo 2',
    descricao: 'descricao 2',
    url: 'http://url2.com',
    categoriaId: '1',
  }),
  new VideoEntity({
    id: '2',
    titulo: 'titulo 2',
    descricao: 'descricao 2',
    url: 'http://url2.com',
    categoriaId: '1',
  }),
  new VideoEntity({
    id: '2',
    titulo: 'titulo 2',
    descricao: 'descricao 2',
    url: 'http://url2.com',
    categoriaId: '1',
  }),
  new VideoEntity({
    id: '2',
    titulo: 'titulo 2',
    descricao: 'descricao 2',
    url: 'http://url2.com',
    categoriaId: '1',
  }),
];

const newVideoEntity: CreateVideoDto = new VideoEntity({
  id: '3',
  titulo: 'titulo 1',
  descricao: 'descricao 1',
  url: 'http://url3.com',
  categoriaId: '1',
});
describe('VideoService', () => {
  let videoService: VideoService;
  let videoRepository: Repository<VideoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoService,
        {
          provide: getRepositoryToken(VideoEntity),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              select: jest.fn().mockResolvedValue(videoEntityList),
              where: jest.fn().mockResolvedValue(videoEntityList),
              orderBy: jest.fn().mockResolvedValue(videoEntityList),
              getMany: jest.fn().mockReturnValue(videoEntityList[0]),
            })),
            save: jest.fn().mockResolvedValue(videoEntityList[0]),
            find: jest.fn().mockResolvedValue(videoEntityList),
            findOne: jest.fn().mockResolvedValue(videoEntityList[0]),
            delete: jest.fn().mockResolvedValue({ message: 'string' }),
          },
        },
      ],
    }).compile();

    videoService = module.get<VideoService>(VideoService);
    videoRepository = module.get<Repository<VideoEntity>>(
      getRepositoryToken(VideoEntity),
    );
  });

  it('should be defined', () => {
    expect(videoService).toBeDefined();
    expect(videoRepository).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma video', async () => {
      const dados: CreateVideoDto = {
        // arrange
        id: '3',
        titulo: 'titulo 1',
        descricao: 'descricao 1',
        url: 'http://url1.com',
        categoriaId: '1',
      };
      // act
      const result = await videoService.create(dados);
      // assert
      expect(result).toEqual(videoEntityList[0]);
      expect(videoRepository.save).toHaveBeenCalled();
    });
    it('deve lançar um erro', () => {
      const dados: CreateVideoDto = {
        // arrange
        id: '3',
        titulo: 'titulo 1',
        descricao: 'descricao 1',
        url: 'http://url1.com',
        categoriaId: '1',
      };
      jest.spyOn(videoRepository, 'save').mockRejectedValueOnce(new Error());
      expect(videoService.create(dados)).rejects.toThrow();
    });
  });

  describe('findFree', () => {
    it('deve retornar uma lista de videos com a coluna free = true', async () => {
      const options: IPaginationOptions = {
        page: 1,
        limit: 5,
      };
      const queryBuilder: any = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(videoEntityList),
      };

      jest
        .spyOn(videoRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);
      (paginate as jest.Mock).mockResolvedValue({
        items: videoEntityList,
        meta: {
          currentPage: 1,
          itemCount: 1,
          itemsPerPage: 5,
          totalItems: 1,
          totalPages: 1,
        },
      });
      // act
      const result = await videoService.findFree(options);
      // assert
      expect(result.items).toEqual(videoEntityList);
      expect(videoRepository.createQueryBuilder).toHaveBeenCalledWith('v');
      expect(queryBuilder.where).toHaveBeenCalledWith('v.free = true');
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('v.titulo', 'ASC');
      expect(queryBuilder.select).toHaveBeenCalledWith([
        'v.titulo',
        'v.descricao',
        'v.url',
      ]);
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('v.titulo', 'ASC');
      expect(paginate).toHaveBeenCalledWith(queryBuilder, options);
    });
    it('deve lançar um erro', () => {
      jest
        .spyOn(videoRepository, 'createQueryBuilder')
        .mockImplementation(() => {
          throw new Error();
        });
      expect(
        videoService.findFree({
          page: 1,
          limit: 10,
        }),
      ).rejects.toThrow();
    });
  });

  describe('findAllPaginate', () => {
    it('deve retornar uma lista de videos paginada com 5 videos', async () => {
      // arrange
      const options: IPaginationOptions = {
        page: 1,
        limit: 5,
      };
      const queryBuilder: any = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(videoEntityList),
      };

      jest
        .spyOn(videoRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);
      (paginate as jest.Mock).mockResolvedValue({
        items: videoEntityList,
        meta: {
          currentPage: 1,
          itemCount: 1,
          itemsPerPage: 5,
          totalItems: 1,
          totalPages: 1,
        },
      });
      // act
      const result = await videoService.findAllPaginate(options);
      // assert
      expect(result.items).toEqual(videoEntityList);
      expect(videoRepository.createQueryBuilder).toHaveBeenCalledWith('v');
      expect(queryBuilder.select).toHaveBeenCalledWith([
        'v.titulo',
        'v.descricao',
        'v.url',
      ]);
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('v.titulo', 'ASC');
      expect(paginate).toHaveBeenCalledWith(queryBuilder, options);
    });
    it('deve lançar um erro', () => {
      jest
        .spyOn(videoRepository, 'createQueryBuilder')
        .mockImplementation(() => {
          throw new Error();
        });
      expect(
        videoService.findAllPaginate({
          page: 1,
          limit: 10,
        }),
      ).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de videos', async () => {
      // act
      const result = await videoService.findAll();
      // assert
      expect(result).toEqual(videoEntityList);
      expect(videoRepository.find).toHaveBeenCalled();
    });
    it('deve lançar um erro', () => {
      jest.spyOn(videoRepository, 'find').mockRejectedValueOnce(new Error());
      expect(videoService.findAll()).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('deve retornar uma video', async () => {
      // act
      const result = await videoService.findOne('1');
      // assert
      expect(result).toEqual(videoEntityList[0]);
      expect(videoRepository.findOne).toHaveBeenCalled();
    });
    it('deve lançar um erro', () => {
      jest.spyOn(videoRepository, 'findOne').mockRejectedValueOnce(new Error());
      expect(videoService.findOne('1')).rejects.toThrow();
    });
  });

  describe('findVidoesByTitulo', () => {
    it('deve retornar uma lista de videos buscados por titulo', async () => {
      // act
      const result = await videoService.findVidoesByTitulo('titulo 1');
      // assert
      expect(result).toEqual(videoEntityList);
      expect(videoRepository.find).toHaveBeenCalled();
    });
    it('deve lançar um erro', () => {
      jest.spyOn(videoRepository, 'find').mockRejectedValueOnce(new Error());
      expect(videoService.findVidoesByTitulo('titulo 1')).rejects.toThrow();
    });
  });

  describe('findVidoesByCategoria', () => {
    it('deve retornar uma lista de videos buscados por categoria', async () => {
      // act
      const result = await videoService.findVidoesByCategoria('1');
      // assert
      expect(result).toEqual(videoEntityList);
      expect(videoRepository.find).toHaveBeenCalled();
    });
    it('deve lançar um erro', () => {
      jest.spyOn(videoRepository, 'find').mockRejectedValueOnce(new Error());
      expect(videoService.findVidoesByCategoria('1')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('deve atualizar uma video', async () => {
      // arrange
      const body: UpdateVideoDto = {
        // arrange
        id: '3',
        titulo: 'titulo 1',
        descricao: 'descricao 1',
        url: 'http://url1.com',
        categoriaId: '1',
      };
      // act
      const result = await videoService.update('1', body);
      // assert
      expect(result).toEqual(videoEntityList[0]);
      expect(videoRepository.save).toHaveBeenCalled();
    });
    it('deve lançar um erro', () => {
      jest.spyOn(videoRepository, 'save').mockRejectedValueOnce(new Error());
      expect(videoService.update('1', newVideoEntity)).rejects.toThrow();
    });
  });
  describe('remove', () => {
    it('deve remover uma video', async () => {
      // act
      const result = await videoService.remove('1');

      // assert
      expect(result).toEqual({
        message: 'Video removido com sucesso',
      });
      expect(videoRepository.delete).toHaveBeenCalled();
    });
    it('deve lançar um erro', () => {
      jest.spyOn(videoRepository, 'delete').mockRejectedValueOnce(new Error());
      expect(videoService.remove('1')).rejects.toThrow();
    });
  });
});
