import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideoEntity } from './entities/video.entity';
import { VideoService } from './video.service';
import { UpdateVideoDto } from './dto/update-video.dto';

const videoEntityList: CreateVideoDto[] = [
  new VideoEntity({
    id: '1',
    titulo: 'titulo 1',
    descricao: 'descricao 1',
    url: 'http://url1.com',
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
