import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { HashPasswordPipe } from '../pipes/senha.pipe';
import { ListUsuariosDto } from './dto/list-usuario.dto';
import { AuthAdminGuard } from '../autenticacao/guards/auth-admin.guard';
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
  @UseGuards(AuthAdminGuard)
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
  @UseGuards(AuthAdminGuard)
  async findOne(@Param('id') id: string) {
    const usuario = await this.usuarioService.findOne(id);
    return {
      usuario: new ListUsuariosDto(usuario.id, usuario.nome, usuario.email),
    };
  }

  @Patch(':id')
  @UseGuards(AuthAdminGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    const usuarioUpdated = await this.usuarioService.update(
      id,
      updateUsuarioDto,
    );
    return {
      usuario: new ListUsuariosDto(
        usuarioUpdated.id,
        usuarioUpdated.nome,
        usuarioUpdated.email,
      ),
    };
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  async remove(@Param('id') id: string) {
    await this.usuarioService.remove(id);
    return {
      message: `Usuario ${id} removido com sucesso!`,
    };
  }
}
