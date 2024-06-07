import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from './usuario.controller';
import { UsuarioEntity } from './entities/usuario.entity';
import { UsuarioService } from '../usuario/usuario.service';
import { ConfigModule } from '@nestjs/config';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

const usuarioEntityList: UsuarioEntity[] = [
  new UsuarioEntity({
    id: '1',
    nome: 'nome 1',
    email: 'email@ex1.com',
    password: '@senhaSegura123',
    role: 'admin',
  }),
  new UsuarioEntity({
    id: '2',
    nome: 'nome 2',
    email: 'email@ex2.com',
    password: '@senhaSegura123',
  }),
  new UsuarioEntity({
    id: '3',
    nome: 'nome 3',
    email: 'email@ex3.com',
    password: '@senhaSegura123',
  }),
  new UsuarioEntity({
    id: '4',
    nome: 'nome 4',
    email: 'email@ex4.com',
    password: '@senhaSegura123',
  }),
  new UsuarioEntity({
    id: '5',
    nome: 'nome 5',
    email: 'email@ex5.com',
    password: '@senhaSegura123',
  }),
];
const newUsuarioEntity: UsuarioEntity = new UsuarioEntity({
  id: '6',
  nome: 'nome 6',
  email: 'email@ex6.com',
  password: '@senhaSegura123',
});

describe('UsuarioController', () => {
  let usuarioController: UsuarioController;
  let usuarioService: UsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
      ],
      controllers: [UsuarioController],
      providers: [
        {
          provide: UsuarioService,
          useValue: {
            create: jest.fn().mockReturnValue(newUsuarioEntity),
            findAll: jest.fn().mockResolvedValue(usuarioEntityList),
            findOne: jest.fn().mockResolvedValue(usuarioEntityList[0]),
            update: jest.fn().mockResolvedValue(usuarioEntityList[0]),
            remove: jest.fn().mockResolvedValue(usuarioEntityList[0]),
            findByEmail: jest.fn().mockResolvedValue(usuarioEntityList[0]),
            emailIsUnique: jest.fn().mockResolvedValue(usuarioEntityList),
          },
        },
      ],
    }).compile();

    usuarioController = module.get<UsuarioController>(UsuarioController);
    usuarioService = module.get<UsuarioService>(UsuarioService);
  });

  it('should be defined', () => {
    expect(usuarioController).toBeDefined();
    expect(usuarioService).toBeDefined();
  });

  describe('findAll', () => {
    it('Deve retornar uma lista de usuarios', async () => {
      expect(await usuarioController.findAll()).toEqual({
        usuarios: usuarioEntityList,
      });
    });
    it('Deve lançar um erro', async () => {
      jest.spyOn(usuarioService, 'findAll').mockRejectedValueOnce(new Error());
      expect(usuarioController.findAll()).rejects.toThrow();
    });
  });
  describe('findOne', () => {
    it('Deve retornar um usuario', async () => {
      const response = await usuarioController.findOne('1');
      expect(response).toEqual({
        usuario: usuarioEntityList[0],
      });
    });
    it('Deve lançar um erro', async () => {
      jest.spyOn(usuarioService, 'findOne').mockRejectedValueOnce(new Error());
      expect(usuarioController.findOne('1')).rejects.toThrow();
    });
  });
  describe('create', () => {
    it('Deve criar um usuario', async () => {
      const senhahasheada: string = '@senhaSegura123';
      const dados: CreateUsuarioDto = {
        nome: 'nome 6',
        email: 'email@ex6.com',
        password: '@senhaSegura123',
      };
      const response = await usuarioController.create(dados, senhahasheada);
      expect(response).toEqual(
        expect.objectContaining({
          usuario: newUsuarioEntity,
        }),
      );
      expect(usuarioService.create).toHaveBeenCalledWith(dados);
      expect(usuarioService.create).toHaveBeenCalledTimes(1);
    });
    it('Deve lançar um erro', async () => {
      const senhahasheada: string = 'novasenhaHasheada';
      const dados: CreateUsuarioDto = {
        nome: 'nome 6',
        email: 'email@ex6.com',
        password: '@senhaSegura123',
      };
      jest.spyOn(usuarioService, 'create').mockRejectedValueOnce(new Error());
      expect(usuarioController.create(dados, senhahasheada)).rejects.toThrow();
    });
    it('Deve lançar um erro, email invalido', async () => {
      const senhahasheada: string = '@senhaSegura123';
      const dados: CreateUsuarioDto = {
        nome: 'nome 6',
        email: 'email',
        password: '@senhaSegura123',
      };
      try {
        await usuarioController.create(dados, senhahasheada);
      } catch (error) {
        expect(error.message).toBe('Email inválido');
      }
    });
    it('Deve lançar um erro, email ja cadastrado', async () => {
      const senhahasheada: string = '@senhaSegura123';
      const dados: CreateUsuarioDto = {
        nome: 'nome 6',
        email: 'email@ex6.com',
        password: '@senhaSegura123',
      };
      jest.spyOn(usuarioService, 'emailIsUnique').mockResolvedValueOnce(false);
      try {
        await usuarioController.create(dados, senhahasheada);
      } catch (error) {
        expect(error.message).toBe('Email já cadastrado');
      }
    });
    it('Deve lançar um erro, senha invalida', async () => {
      const senhahasheada: string = '@senhaSegura123';
      const dados: CreateUsuarioDto = {
        nome: 'nome 6',
        email: 'email@ex6.com',
        password: '123',
      };
      try {
        await usuarioController.create(dados, senhahasheada);
      } catch (error) {
        expect(error.message).toBe('Senha inválida');
      }
    });
  });
  describe('update', () => {
    it('Deve atualizar um usuario', async () => {
      const dados: UpdateUsuarioDto = {
        nome: 'nome 6',
        email: 'email@ex6.com',
        password: '@senhaSegura123',
      };
      const response = await usuarioController.update('1', dados);
      expect(response).toEqual(
        expect.objectContaining({
          usuario: usuarioEntityList[0],
        }),
      );
      expect(usuarioService.update).toHaveBeenCalledWith('1', dados);
      expect(usuarioService.update).toHaveBeenCalledTimes(1);
    });
    it('Deve lançar um erro', async () => {
      const dados: UpdateUsuarioDto = {
        nome: 'nome 6',
        email: 'email@ex6.com',
        password: '@senhaSegura123',
      };
      jest.spyOn(usuarioService, 'update').mockRejectedValueOnce(new Error());
      expect(usuarioController.update('1', dados)).rejects.toThrow();
    });
    it('deve lançar um erro, usuario não encontrado', async () => {
      const dados: UpdateUsuarioDto = {
        nome: 'nome 6',
        email: 'email@ex6.com',
        password: '@senhaSegura123',
      };
      jest.spyOn(usuarioService, 'findOne').mockResolvedValueOnce(undefined);
      try {
        await usuarioController.update('1', dados);
      } catch (error) {
        expect(error.message).toBe('Usuário não encontrado');
      }
    });
  });
  describe('remove', () => {
    it('Deve remover um usuario', async () => {
      const response = await usuarioController.remove('1');
      expect(response).toEqual({ message: 'Usuario 1 removido com sucesso!' });
      expect(usuarioService.remove).toHaveBeenCalledWith('1');
      expect(usuarioService.remove).toHaveBeenCalledTimes(1);
    });
    it('Deve lançar um erro', async () => {
      jest.spyOn(usuarioService, 'remove').mockRejectedValueOnce(new Error());
      expect(usuarioController.remove('1')).rejects.toThrow();
    });
    it('deve lançar um erro, usuario não encontrado', async () => {
      jest.spyOn(usuarioService, 'findOne').mockResolvedValueOnce(undefined);
      try {
        await usuarioController.remove('1');
      } catch (error) {
        expect(error.message).toBe('Usuário não encontrado');
      }
    });
  });
});
