import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UsuarioEntity } from './entities/usuario.entity';
import { VideoEntity } from '../video/entities/video.entity';
import { CategoriaEntity } from '../categoria/entities/categoria.entity';
import { Repository } from 'typeorm';
import { VideoService } from '../video/video.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

describe('UsuarioService', () => {
  let usuarioService: UsuarioService;
  let usuarioRepository: Repository<UsuarioEntity>;
  let videoService: VideoService;
  let videoRepository: Repository<VideoEntity>;
  let categoriaRepository: Repository<CategoriaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'sqlite',
            database: ':memory:',
            entities: [UsuarioEntity, VideoEntity, CategoriaEntity],
            synchronize: true,
          }),
        }),
        TypeOrmModule.forFeature([UsuarioEntity, VideoEntity, CategoriaEntity]),
      ],
      providers: [UsuarioService, VideoService],
    }).compile();

    usuarioService = module.get<UsuarioService>(UsuarioService);
    usuarioRepository = module.get<Repository<UsuarioEntity>>(
      getRepositoryToken(UsuarioEntity),
    );
    videoService = module.get<VideoService>(VideoService);
    videoRepository = module.get<Repository<VideoEntity>>(
      getRepositoryToken(VideoEntity),
    );
    categoriaRepository = module.get<Repository<CategoriaEntity>>(
      getRepositoryToken(CategoriaEntity),
    );
    await categoriaRepository.save([
      {
        id: '1',
        titulo: 'categoria 1',
        cor: '#000000',
      },
    ]);
    await videoRepository.save([
      {
        id: '1',
        titulo: 'titulo 1',
        descricao: 'descricao 1',
        url: 'url 1',
        free: true,
      },
    ]);
    await usuarioRepository.save([
      {
        id: '1',
        nome: 'usuario 1',
        email: 'email.usuario1.com',
        password: '@SenhaSegura123',
      },
      {
        id: '2',
        nome: 'usuario 2',
        email: 'email.usuario2.com',
        password: '@SenhaSegura123',
      },
      {
        id: '3',
        nome: 'usuario 3',
        email: 'email.usuario3.com',
        password: '@SenhaSegura123',
      },
      {
        id: '4',
        nome: 'usuario 4',
        email: 'email.usuario4.com',
        password: '@SenhaSegura123',
      },
    ]);
  });

  it('should be defined', () => {
    expect(usuarioService).toBeDefined();
    expect(usuarioRepository).toBeDefined();
    expect(videoService).toBeDefined();
    expect(videoRepository).toBeDefined();
  });

  describe('create usuario', () => {
    it('deve criar um usuario', async () => {
      const dados: CreateUsuarioDto = {
        // arrange
        id: '5',
        nome: 'usuario 5',
        email: 'email.usuario5.com',
        password: '@SenhaSegura123',
      };

      // act
      await usuarioService.create(dados);

      // assert
      expect(await usuarioRepository.count()).toBe(5);
      expect(dados.id).toEqual('5');
    });
    it('deve lançar um erro', async () => {
      try {
        const dados: CreateUsuarioDto = {
          id: '20',
          nome: 'usuario 1',
          email: 'email.usuario1.com',
          password: '@SenhaSegura123',
        };
        await usuarioService.create(dados);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });
  });
  describe('findAll', () => {
    it('deve retornar todos os usuarios', async () => {
      const usuarios = await usuarioService.findAll();
      expect(usuarios.length).toBe(4);
      expect(usuarios[0].nome).toBe('usuario 1');
    });
    it('deve retornar um erro ', () => {
      jest.spyOn(usuarioRepository, 'find').mockRejectedValueOnce(new Error());
      expect(usuarioService.findAll()).rejects.toThrow();
    });
  });
  describe('findOne', () => {
    it('deve retornar um usuario', async () => {
      const usuario = await usuarioService.findOne('1');
      expect(usuario.nome).toBe('usuario 1');
    });
    it('deve retornar um erro ', () => {
      jest
        .spyOn(usuarioRepository, 'findOne')
        .mockRejectedValueOnce(new Error());
      expect(usuarioService.findOne('1')).rejects.toThrow();
    });
    it('deve retornar um erro caso o usuario não seja encontrado', async () => {
      try {
        const usuario = await usuarioService.findOne('99');
        expect(usuario.nome).toBe('usuario 1');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
  describe('update', () => {
    it('deve atualizar um usuario', async () => {
      const dados: UpdateUsuarioDto = {
        nome: 'usuario atualizado',
      };
      await usuarioService.update('1', dados);
      const usuario = await usuarioService.findOne('1');
      expect(usuario.nome).toBe('usuario atualizado');
    });
    it('deve retornar um erro ', () => {
      jest.spyOn(usuarioRepository, 'save').mockRejectedValue(new Error());
      expect(usuarioService.update('1', {})).rejects.toThrow();
    });
    it('deve retornar um erro caso o usuario não seja encontrado', async () => {
      try {
        const usuario = await usuarioService.update('99', {});
        expect(usuario.nome).toBe('usuario 1');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('remove', () => {
    it('deve remover um usuario', async () => {
      await usuarioService.remove('1');
      expect(await usuarioRepository.count()).toBe(3);
    });
    it('deve retornar um erro ', () => {
      jest.spyOn(usuarioRepository, 'delete').mockRejectedValue(new Error());
      expect(usuarioService.remove('1')).rejects.toThrow();
    });
    it('deve retornar um erro caso o usuario não seja encontrado', async () => {
      try {
        await usuarioService.remove('99');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('existeComEmail', () => {
    it('deve retornar um usuario', async () => {
      expect(await usuarioService.findByEmail('email.usuario1.com')).toEqual(
        expect.objectContaining({
          id: '1',
          nome: 'usuario 1',
          email: 'email.usuario1.com',
          password: '@SenhaSegura123',
        }),
      );
    });
    it('deve retornar um erro caso não seja encontrado', async () => {
      try {
        expect(await usuarioService.findByEmail('email.usuario99.com')).toEqual(
          expect.objectContaining({
            id: '1',
            nome: 'usuario 1',
            email: 'email.usuario1.com',
            password: '@SenhaSegura123',
          }),
        );
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
  describe('emailUnico', () => {
    it('deve retornar false', async () => {
      expect(await usuarioService.emailIsUnique('email.usuario1.com')).toBe(
        false,
      );
    });
    it('deve retornar true', async () => {
      expect(await usuarioService.emailIsUnique('email.usuario99.com')).toBe(
        true,
      );
    });
  });
});
