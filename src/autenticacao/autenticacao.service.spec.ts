import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AutenticacaoService, UsuarioPayload } from './autenticacao.service';
import { UsuarioService } from '../usuario/usuario.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AutenticacaoService', () => {
  let autenticacaoService: AutenticacaoService;
  let usuarioService: UsuarioService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutenticacaoService,
        {
          provide: UsuarioService,
          useValue: {
            findByEmail: jest.fn().mockImplementation(async (email) => {
              if (email === 'usuario@teste.com') {
                return Promise.resolve({
                  id: '1',
                  nome: 'Usuario Teste',
                  role: 'user',
                  password: await bcrypt.hash('123456', 10), // hash para senha '123456'
                });
              } else {
                return Promise.resolve({
                  id: '1',
                  nome: 'Usuario Teste',
                  role: 'user',
                  password: '123456',
                });
              }
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockImplementation((payload: UsuarioPayload) => {
              return 'token_de_acesso_simulado';
            }),
          },
        },
      ],
    }).compile();

    autenticacaoService = module.get<AutenticacaoService>(AutenticacaoService);
    usuarioService = module.get<UsuarioService>(UsuarioService);
    jwtService = module.get<JwtService>(JwtService);
  });
  it('should be defined', () => {
    expect(autenticacaoService).toBeDefined();
    expect(usuarioService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  it('deve autenticar um usuário com credenciais válidas', async () => {
    const email = 'usuario@teste.com';
    const senha = '123456';

    const resultado = await autenticacaoService.login(email, senha);

    expect(resultado).toBeDefined();
    expect(resultado.access_token).toEqual('token_de_acesso_simulado');
  });

  it('deve lançar uma exceção se as credenciais forem inválidas', async () => {
    const email = 'emailinvalido@teste.com';
    const senha = '123456';
    try {
      await autenticacaoService.login(email, senha);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });
});
