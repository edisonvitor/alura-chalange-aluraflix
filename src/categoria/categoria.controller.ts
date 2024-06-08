import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CategoriaEntity } from './entities/categoria.entity';
import { AuthAdminGuard } from '../autenticacao/guards/auth-admin.guard';
import { AuthGuard } from '../autenticacao/guards/auth.guard';

@Controller('categorias')
@UseGuards(AuthGuard)
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) { }
  @Post()
  @UseGuards(AuthAdminGuard)
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriaService.create(createCategoriaDto);
  }

  @Get('all')
  findAll() {
    return this.categoriaService.findAll();
  }

  @Get('')
  findAllPaginated(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 20,
  ): Promise<Pagination<CategoriaEntity>> {
    limit = limit > 20 ? limit : 20;
    const options = {
      page,
      limit,
      route: '/categorias',
    };
    return this.categoriaService.findAllPaginate(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriaService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthAdminGuard)
  update(
    @Param('id') id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriaService.update(id, updateCategoriaDto);
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  remove(@Param('id') id: string) {
    return this.categoriaService.remove(id);
  }
}
