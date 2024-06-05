import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UsuarioPayload } from '../autenticacao.service';
import { JwtService } from '@nestjs/jwt';

export interface ReqUsuario extends Request {
  usuario: UsuarioPayload;
}

@Injectable()
export class AutenticacaoGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requisicao = context.switchToHttp().getRequest<ReqUsuario>();
    const token = this.extrairTokenDoCabecalho(requisicao);
    const skipAuth = this.reflector.get<boolean>(
      'skipAuth',
      context.getHandler(),
    );
    if (skipAuth) {
      return true;
    }
    if (!token) {
      throw new UnauthorizedException('Erro na autenticacao');
    }
    try {
      const payload: UsuarioPayload = await this.jwtService.verifyAsync(token);
      requisicao.usuario = payload;
    } catch (error) {
      throw new UnauthorizedException('jwt error');
    }
    return true;
  }

  private extrairTokenDoCabecalho(requisicao: Request): string | undefined {
    const [tipo, token] = requisicao.headers.authorization?.split(' ') ?? [];
    if (tipo !== 'Bearer') {
      return undefined;
    }
    return token;
  }
}
