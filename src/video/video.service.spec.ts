import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideoEntity } from './entities/video.entity';
import { VideoService } from './video.service';
import { UpdateVideoDto } from './dto/update-video.dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { CategoriaEntity } from '../categoria/entities/categoria.entity';
import { CategoriaService } from '../categoria/categoria.service';
import { UsuarioEntity } from '../usuario/entities/usuario.entity';

describe('VideoService', () => {
  let videoService: VideoService;
  let videoRepository: Repository<VideoEntity>;
  let categoriaRepository: Repository<CategoriaEntity>;
  let usuarioRepository: Repository<UsuarioEntity>;
  jest.setTimeout(30000);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'sqlite',
            database: ':memory:',
            entities: [VideoEntity, CategoriaEntity, UsuarioEntity],
            synchronize: true,
          }),
        }),
        TypeOrmModule.forFeature([VideoEntity, CategoriaEntity, UsuarioEntity]),
      ],
      providers: [VideoService, CategoriaService],
    }).compile();

    videoService = module.get<VideoService>(VideoService);
    videoRepository = module.get<Repository<VideoEntity>>(
      getRepositoryToken(VideoEntity),
    );
    categoriaRepository = module.get<Repository<CategoriaEntity>>(
      getRepositoryToken(CategoriaEntity),
    );
    usuarioRepository = module.get<Repository<UsuarioEntity>>(
      getRepositoryToken(UsuarioEntity),
    );
    await categoriaRepository.save([
      {
        id: '1',
        titulo: 'categoria 1',
        cor: '#000000',
      },
      {
        id: '2',
        titulo: 'categoria 2',
        cor: '#000000',
      },
    ]);
    await videoRepository.save([
      {
        id: '1',
        titulo: 'titulo 1',
        descricao: 'descricao 1',
        url: 'http://url1.com',
        categoriaId: '2',
        free: true,
      },
      {
        id: '2',
        titulo: 'titulo 2',
        descricao: 'descricao 2',
        url: 'http://url1.com',
      },
      {
        id: '3',
        titulo: 'titulo 3',
        descricao: 'descricao 1',
        url: 'http://url1.com',
      },
      {
        id: '4',
        titulo: 'titulo 4',
        descricao: 'descricao 2',
        url: 'http://url1.com',
      },
      {
        id: '5',
        titulo: 'titulo 5',
        descricao: 'descricao 3',
        url: 'http://url1.com',
      },
      {
        id: '6',
        titulo: 'titulo 6',
        descricao: 'descricao 4',
        url: 'http://url1.com',
      },
    ]);
  });

  it('should be defined', () => {
    expect(videoService).toBeDefined();
    expect(videoRepository).toBeDefined();
    expect(categoriaRepository).toBeDefined();
    expect(usuarioRepository).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma video', async () => {
      const dados: CreateVideoDto = {
        // arrange
        id: '10',
        titulo: 'titulo 1',
        descricao: 'descricao 1',
        url: 'http://url1.com',
        categoriaId: '1',
        free: false,
      };
      // act
      const result = await videoService.create(dados);
      // assert
      expect(result).toEqual(expect.objectContaining(dados));
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
        limit: 5,
        page: 1,
      };
      const result: Pagination<VideoEntity> =
        await videoService.findFree(options);
      expect(result.items).toHaveLength(1);
      expect(result.items).toEqual(
        expect.arrayContaining([
          {
            titulo: 'titulo 1',
            descricao: 'descricao 1',
            url: 'http://url1.com',
          },
        ]),
      );
    });
  });
  it('Deve retornar um erro', async () => {
    jest.spyOn(videoRepository, 'createQueryBuilder').mockImplementation(() => {
      throw new Error();
    });
    expect(
      videoService.findFree({
        page: 1,
        limit: 10,
      }),
    ).rejects.toThrow();
  });

  describe('findAllPaginate', () => {
    it('deve retornar uma lista de videos paginada com 5 videos', async () => {
      // arrange
      const options: IPaginationOptions = {
        limit: 5,
        page: 1,
      };

      // act
      const result: Pagination<VideoEntity> =
        await videoService.findAllPaginate(options);
      // assert
      expect(result.items).toHaveLength(5);
      expect(result.items[0]).toEqual(
        expect.objectContaining({
          titulo: 'titulo 1',
          descricao: 'descricao 1',
          url: 'http://url1.com',
        }),
      );
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

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(6);
      expect(result[0]).toEqual(
        expect.objectContaining({
          titulo: 'titulo 1',
          descricao: 'descricao 1',
          url: 'http://url1.com',
        }),
      );
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
      expect(result).toEqual(
        expect.objectContaining({
          titulo: 'titulo 1',
          descricao: 'descricao 1',
          url: 'http://url1.com',
        }),
      );
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
      expect(result).toEqual([
        expect.objectContaining({
          titulo: 'titulo 1',
          descricao: 'descricao 1',
          url: 'http://url1.com',
        }),
      ]);
    });
    it('deve lançar um erro', () => {
      jest.spyOn(videoRepository, 'find').mockRejectedValueOnce(new Error());
      expect(videoService.findVidoesByTitulo('titulo 1')).rejects.toThrow();
    });
  });

  describe('findVidoesByCategoria', () => {
    it('deve retornar uma lista de videos buscados por categoria', async () => {
      // act
      const result = await videoService.findVidoesByCategoria('2');
      // assert
      expect(result).toEqual([
        expect.objectContaining({
          id: '1',
          titulo: 'titulo 1',
          descricao: 'descricao 1',
          url: 'http://url1.com',
          categoriaId: '2',
          free: true,
        }),
      ]);
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
        titulo: 'titulo 7',
        descricao: 'descricao 1',
        url: 'http://url1.com',
      };
      // act
      const result = await videoService.update('3', body);
      // assert
      expect(result.titulo).toEqual('titulo 7');
    });
    it('deve lançar um erro', () => {
      jest.spyOn(videoRepository, 'save').mockRejectedValueOnce(new Error());
      expect(videoService.update('3', {} as UpdateVideoDto)).rejects.toThrow();
    });
  });
  describe('remove', () => {
    it('deve remover uma video', async () => {
      // act
      const result = await videoService.remove('3');

      // assert
      expect(result).toEqual({
        message: 'Video removido com sucesso',
      });
    });
    it('deve lançar um erro', () => {
      jest.spyOn(videoRepository, 'delete').mockRejectedValueOnce(new Error());
      expect(videoService.remove('3')).rejects.toThrow();
    });
  });
});
