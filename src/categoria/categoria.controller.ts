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
import { AutenticacaoAdminGuard } from 'src/autenticacao/guards/autenticacao-admin.guard';
import { AutenticacaoGuard } from '../autenticacao/guards/autenticacao.guard';

@Controller('categorias')
@UseGuards(AutenticacaoGuard)
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}
  @Post()
  @UseGuards(AutenticacaoAdminGuard)
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
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 5,
  ): Promise<Pagination<CategoriaEntity>> {
    limit = limit > 5 ? limit : 5;
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
  @UseGuards(AutenticacaoAdminGuard)
  update(
    @Param('id') id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriaService.update(id, updateCategoriaDto);
  }

  @Delete(':id')
  @UseGuards(AutenticacaoAdminGuard)
  remove(@Param('id') id: string) {
    return this.categoriaService.remove(id);
  }
}
