import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from 'src/usuario/usuario.service';

export interface UsuarioPayload {
  sub: string;
  nomeUsuario: string;
  roleUsuario: string;
}

@Injectable()
export class AutenticacaoService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}
  async login(email: string, password: string) {
    const usuario = await this.usuarioService.existeComEmail(email);
    const usuarioAutenticado = await bcrypt.compare(password, usuario.password);
    if (!usuarioAutenticado) {
      throw new UnauthorizedException('email ou senha incorretos');
    }
    const payload: UsuarioPayload = {
      sub: usuario.id,
      nomeUsuario: usuario.nome,
      roleUsuario: usuario.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
