import { Test, TestingModule } from '@nestjs/testing';
import { VideoService } from './video/video.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { VideoEntity } from './video/entities/video.entity';
import { CreateVideoDto } from './video/dto/create-video.dto';
import { Repository } from 'typeorm';
import { CategoriaEntity } from './categoria/entities/categoria.entity';
import { CreateCategoriaDto } from './categoria/dto/create-categoria.dto';
import { CategoriaService } from './categoria/categoria.service';

describe('VideoService (integração)', () => {
  let videoService: VideoService;
  let videoRepository: Repository<VideoEntity>;
  let categoriaService: CategoriaService;
  let categoriaRepository: Repository<CategoriaEntity>;
  jest.setTimeout(30000);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'sqlite',
            database: ':memory:',
            entities: [VideoEntity, CategoriaEntity],
            synchronize: true,
          }),
        }),
        TypeOrmModule.forFeature([VideoEntity, CategoriaEntity]),
      ],
      providers: [VideoService, CategoriaService],
    }).compile();

    videoService = module.get<VideoService>(VideoService);
    categoriaService = module.get<CategoriaService>(CategoriaService);
    videoRepository = module.get<Repository<VideoEntity>>(
      getRepositoryToken(VideoEntity),
    );
    categoriaRepository = module.get<Repository<CategoriaEntity>>(
      getRepositoryToken(CategoriaEntity),
    );
  });

  it('should be defined', () => {
    expect(videoRepository).toBeDefined();
    expect(videoService).toBeDefined();
    expect(categoriaService).toBeDefined();
  });

  describe('create categoria', () => {
    it('deve criar uma categoria', async () => {
      const dados: CreateCategoriaDto = {
        // arrange
        id: '1',
        titulo: 'titulo 1',
        cor: '#ffffff',
        videos: [],
      };

      // act
      await categoriaService.create(dados);

      // assert
      expect(await categoriaRepository.count()).toBe(1);
      expect(await categoriaService.findOne(dados.id)).toEqual({
        id: '1',
        titulo: 'titulo 1',
        cor: '#ffffff',
        videos: [],
      });
    });
  });

  describe('create video', () => {
    it('deve criar um novo video', async () => {
      const dadosCategoria: CreateCategoriaDto = {
        // arrange
        id: '1',
        titulo: 'titulo 1',
        cor: '#ffffff',
        videos: [],
      };

      // act
      await categoriaService.create(dadosCategoria);
      const dados: CreateVideoDto = {
        // arrange
        id: '1',
        titulo: 'titulo 1',
        descricao: 'descricao 1',
        url: 'https://url1.com',
      };

      // act
      await videoService.create(dados);

      // assert
      expect(await videoRepository.count()).toBe(1);
      expect(await videoService.findOne(dados.id)).toEqual({
        categoriaId: '1',
        descricao: 'descricao 1',
        id: '1',
        titulo: 'titulo 1',
        url: 'https://url1.com',
      });
    });
  });
});
