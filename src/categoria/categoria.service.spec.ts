import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaService } from './categoria.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriaEntity } from './entities/categoria.entity';
import { Repository } from 'typeorm';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

const categoriaEntityList: CreateCategoriaDto[] = [
  new CategoriaEntity({
    id: '1',
    titulo: 'titulo 1',
    cor: 'cor 1',
    videos: [],
  }),
  new CategoriaEntity({
    id: '2',
    titulo: 'titulo 2',
    cor: 'cor 2',
    videos: [],
  }),
];

const newCategoriaEntity: CategoriaEntity = new CategoriaEntity({
  id: '3',
  titulo: 'titulo ',
  cor: '#ffffff',
  videos: [],
});

describe('CategoriaService', () => {
  let categoriaService: CategoriaService;
  let categoriaRepository: Repository<CategoriaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaService,
        {
          provide: getRepositoryToken(CategoriaEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(categoriaEntityList[0]),
            find: jest.fn().mockResolvedValue(categoriaEntityList),
            findOne: jest.fn().mockResolvedValue(categoriaEntityList[0]),
            delete: jest.fn().mockResolvedValue({ message: 'string' }),
          },
        },
      ],
    }).compile();

    categoriaService = module.get<CategoriaService>(CategoriaService);
    categoriaRepository = module.get<Repository<CategoriaEntity>>(
      getRepositoryToken(CategoriaEntity),
    );
  });

  it('should be defined', () => {
    expect(categoriaService).toBeDefined();
    expect(categoriaRepository).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma categoria', async () => {
      const dados: CreateCategoriaDto = {
        id: '5',
        titulo: 'titulo 5',
        cor: '#ffffff',
        videos: [],
      };
      // act
      const result = await categoriaService.create(dados);
      // assert
      expect(result).toEqual(categoriaEntityList[0]);
      expect(categoriaRepository.save).toHaveBeenCalled();
    });
    it('deve lançar um erro', () => {
      jest
        .spyOn(categoriaRepository, 'save')
        .mockRejectedValueOnce(new Error());
      expect(categoriaService.create(newCategoriaEntity)).rejects.toThrow();
    });
  });
  describe('findAll', () => {
    it('deve retornar uma lista de categorias', async () => {
      // act
      const result = await categoriaService.findAll();
      // assert
      expect(result).toEqual(categoriaEntityList);
      expect(categoriaRepository.find).toHaveBeenCalled();
    });
    it('deve lançar um erro', () => {
      jest
        .spyOn(categoriaRepository, 'find')
        .mockRejectedValueOnce(new Error());
      expect(categoriaService.findAll()).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('deve retornar uma categoria', async () => {
      // act
      const result = await categoriaService.findOne('1');
      // assert
      expect(result).toEqual(categoriaEntityList[0]);
      expect(categoriaRepository.findOne).toHaveBeenCalled();
    });
    it('deve lançar um erro', () => {
      jest
        .spyOn(categoriaRepository, 'findOne')
        .mockRejectedValueOnce(new Error());
      expect(categoriaService.findOne('1')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('deve atualizar uma categoria', async () => {
      // arrange
      const body: UpdateCategoriaDto = {
        // arrange
        id: '3',
        titulo: 'titulo 1',
        cor: 'cor 1',
        videos: [],
      };
      // act
      const result = await categoriaService.update('1', body);
      // assert
      expect(result).toEqual(categoriaEntityList[0]);
      expect(categoriaRepository.save).toHaveBeenCalled();
    });
    it('deve lançar um erro', () => {
      jest
        .spyOn(categoriaRepository, 'save')
        .mockRejectedValueOnce(new Error());
      expect(
        categoriaService.update('1', newCategoriaEntity),
      ).rejects.toThrow();
    });
  });
  describe('remove', () => {
    it('deve remover uma categoria', async () => {
      // act
      const result = await categoriaService.remove('1');

      // assert
      expect(result).toEqual({
        message: 'Categoria com id 1 removida com sucesso',
      });
      expect(categoriaRepository.delete).toHaveBeenCalled();
    });
    it('deve lançar um erro', () => {
      jest
        .spyOn(categoriaRepository, 'delete')
        .mockRejectedValueOnce(new Error());
      expect(categoriaService.remove('1')).rejects.toThrow();
    });
  });
});
