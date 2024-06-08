import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsuarioPayload } from '../autenticacao.service';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../../usuario/usuario.service';

export interface ReqUsuario extends Request {
  usuario: UsuarioPayload;
}

@Injectable()
export class AuthAdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly usuarioService: UsuarioService,
  ) {}
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
      const recursoId = requisicao.params.id;
      const usuario = await this.usuarioService.findOne(payload.sub);
      if (role !== 'admin' || usuario.id !== recursoId) {
        throw new UnauthorizedException('Você não tem permissão');
      }
    } catch (error) {
      throw new UnauthorizedException(error);
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
