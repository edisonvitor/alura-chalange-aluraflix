import { Module } from '@nestjs/common';
import { AutenticacaoService } from './autenticacao.service';
import { AutenticacaoController } from './autenticacao.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (ConfigService: ConfigService) => {
        return {
          secret: ConfigService.get<string>('SECRET_KEY'),
          signOptions: {
            expiresIn: ConfigService.get<string>('JWT_EXPIRES_IN'),
          },
        };
      },
      inject: [ConfigService],
      global: true,
    }),
    UsuarioModule,
  ],
  controllers: [AutenticacaoController],
  providers: [AutenticacaoService],
})
export class AutenticacaoModule {}
