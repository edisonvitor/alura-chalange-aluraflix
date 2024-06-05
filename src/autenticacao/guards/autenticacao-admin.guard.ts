import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsuarioPayload } from '../autenticacao.service';
import { JwtService } from '@nestjs/jwt';

export interface ReqUsuario extends Request {
  usuario: UsuarioPayload;
}

@Injectable()
export class AutenticacaoAdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requisicao = context.switchToHttp().getRequest<ReqUsuario>();
    const token = this.extrairTokenDoCabecalho(requisicao);
    if (!token) {
      throw new UnauthorizedException('Erro na autenticacao');
    }
    try {
      const payload: UsuarioPayload = await this.jwtService.verifyAsync(token);
      requisicao.usuario = payload;
      const role = payload.roleUsuario;
      if (role !== 'admin') {
        throw new UnauthorizedException('Você não tem permissão');
      }
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
