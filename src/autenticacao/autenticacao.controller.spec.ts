import { Test, TestingModule } from '@nestjs/testing';
import { AutenticacaoController } from './autenticacao.controller';
import { AutenticacaoService } from './autenticacao.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AutenticacaoController', () => {
  let controller: AutenticacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutenticacaoController],
      providers: [
        {
          provide: AutenticacaoService,
          useValue: {
            login: jest
              .fn()
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              .mockImplementation((email: string, _password: string) => {
                return {
                  email,
                  token: 'fake-jest-token',
                };
              }),
          },
        },
      ],
    }).compile();

    controller = module.get<AutenticacaoController>(AutenticacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a token', async () => {
      const body = {
        email: 'email@example.com',
        password: '@senhasegura123',
      };
      const result = await controller.login(body);

      expect(body.email).toBe('email@example.com');
      expect(result).toEqual({
        email: 'email@example.com',
        token: 'fake-jest-token',
      });
    });
    it('Deve retornar um erro de autenticação', async () => {
      jest
        .spyOn(controller, 'login')
        .mockRejectedValueOnce(
          new UnauthorizedException('Usuário ou senha inválidos'),
        );
      await expect(controller.login).rejects.toThrow(
        'Usuário ou senha inválidos',
      );
    });
  });
});
