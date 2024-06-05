import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { HashPasswordPipe } from 'src/pipes/senha.pipe';
import { ListUsuariosDto } from './dto/list-usuario.dto';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() { password, ...createUsuarioDto }: CreateUsuarioDto,
    @Body('password', HashPasswordPipe) senhaHasheada: string,
  ) {
    const usuarioCreated = await this.usuarioService.create({
      ...createUsuarioDto,
      password: senhaHasheada,
    });

    return {
      usuario: new ListUsuariosDto(
        usuarioCreated.id,
        usuarioCreated.nome,
        usuarioCreated.email,
      ),
    };
  }

  @Get()
  async findAll() {
    const usuariosList = await this.usuarioService.findAll();
    return {
      usuarios: usuariosList.map(
        (usuario) =>
          new ListUsuariosDto(usuario.id, usuario.nome, usuario.email),
      ),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const usuario = await this.usuarioService.findOne(id);
    return {
      usuario: new ListUsuariosDto(usuario.id, usuario.nome, usuario.email),
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(id);
  }
}
