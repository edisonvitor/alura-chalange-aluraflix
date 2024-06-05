import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from './categoria.service';
import { CategoriaEntity } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

const categoriaEntityList: CategoriaEntity[] = [
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
  titulo: 'titulo 1',
  cor: '#ffffff',
  videos: [],
});

describe('CategoriaController', () => {
  let categoriaController: CategoriaController;
  let categoriaService: CategoriaService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriaController],
      providers: [
        {
          provide: CategoriaService,
          useValue: {
            create: jest.fn().mockReturnValue(newCategoriaEntity),
            findAll: jest.fn().mockResolvedValue(categoriaEntityList),
            findOne: jest.fn().mockResolvedValue(categoriaEntityList[0]),
            update: jest.fn().mockResolvedValue(newCategoriaEntity),
            remove: jest.fn().mockResolvedValue(categoriaEntityList[0]),
          },
        },
      ],
    }).compile();

    categoriaController = module.get<CategoriaController>(CategoriaController);
    categoriaService = module.get<CategoriaService>(CategoriaService);
  });

  it('should be defined', () => {
    expect(categoriaController).toBeDefined();
    expect(categoriaService).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma categoria', async () => {
      const body: CreateCategoriaDto = {
        // arrange
        id: '3',
        titulo: 'titulo 1',
        cor: '#ffffff',
        videos: [],
      };

      // act
      const result = await categoriaController.create(body);

      // assert
      expect(result).toEqual(newCategoriaEntity);
    });

    it('deve lançar um erro', () => {
      const body: CreateCategoriaDto = {
        // arrange
        id: '3',
        titulo: 'titulo 1',
        cor: '#ffffff',
        videos: [],
      };
      jest.spyOn(categoriaService, 'create').mockRejectedValueOnce(new Error());
      expect(categoriaController.create(body)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de categorias', async () => {
      // act
      const result = await categoriaController.findAll();

      // assert
      expect(result).toEqual(categoriaEntityList);
    });

    it('deve lançar um erro', () => {
      jest
        .spyOn(categoriaService, 'findAll')
        .mockRejectedValueOnce(new Error());
      expect(categoriaController.findAll()).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('deve retornar uma categoria', async () => {
      // act
      const result = await categoriaController.findOne('1');

      // assert
      expect(result).toEqual(categoriaEntityList[0]);
    });

    it('deve lançar um erro', () => {
      jest
        .spyOn(categoriaService, 'findOne')
        .mockRejectedValueOnce(new Error());
      expect(categoriaController.findOne('1')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('deve atualizar uma categoria', async () => {
      // arrange
      const body: UpdateCategoriaDto = {
        // arrange
        id: '3',
        titulo: 'titulo 1',
        cor: '#ffffff',
        videos: [],
      };

      // act
      const result = await categoriaController.update('1', body);

      // assert
      expect(result).toEqual(newCategoriaEntity);
    });

    it('deve lançar um erro', () => {
      const body: UpdateCategoriaDto = {
        // arrange
        id: '3',
        titulo: 'titulo 1',
        cor: '#ffffff',
        videos: [],
      };
      jest.spyOn(categoriaService, 'update').mockRejectedValueOnce(new Error());
      expect(categoriaController.update('1', body)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('deve remover uma categoria', async () => {
      // act
      const result = await categoriaController.remove('1');

      // assert
      expect(result).toEqual(categoriaEntityList[0]);
    });

    it('deve lançar um erro', () => {
      jest.spyOn(categoriaService, 'remove').mockRejectedValueOnce(new Error());
      expect(categoriaController.remove('1')).rejects.toThrow();
    });
  });
});
