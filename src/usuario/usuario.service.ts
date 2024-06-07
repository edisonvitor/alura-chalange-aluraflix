import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from './entities/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuarioService {
  @InjectRepository(UsuarioEntity)
  private readonly usuarioRepository: Repository<UsuarioEntity>;
  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuarioEntity = new UsuarioEntity();
    const usuarioExist = await this.emailIsUnique(createUsuarioDto.email);
    if (!usuarioExist) {
      throw new ConflictException('Email já cadastrado');
    }
    Object.assign(usuarioEntity, createUsuarioDto as UsuarioEntity);
    const usuarioCriado = await this.usuarioRepository.save(usuarioEntity);
    return usuarioCriado;
  }

  private async findUsuario(id: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
    });
    if (!usuario) {
      throw new NotFoundException(`Usuário não encontrado`);
    }
    return usuario;
  }

  async findAll() {
    return await this.usuarioRepository.find();
  }

  async findOne(id: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
    });
    if (!usuario) {
      throw new NotFoundException(`Usuário não encontrado`);
    }
    return usuario;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
    });
    if (!usuario) {
      throw new NotFoundException(`Usuário não encontrado`);
    }
    Object.assign(usuario, updateUsuarioDto);
    return await this.usuarioRepository.save(usuario);
  }

  async remove(id: string) {
    const usuario = this.findUsuario(id);
    if (!usuario) {
      throw new NotFoundException(`Usuário não encontrado`);
    }
    await this.usuarioRepository.delete((await usuario).id);
  }

  async findByEmail(email: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: { email },
    });
    if (!usuario) {
      throw new NotFoundException(`Usuário não encontrado`);
    }
    return usuario;
  }

  async emailIsUnique(email: string): Promise<boolean> {
    const usuario = await this.usuarioRepository.findOne({
      where: { email },
    });
    if (!usuario) {
      return true;
    }
    return false;
  }
}
