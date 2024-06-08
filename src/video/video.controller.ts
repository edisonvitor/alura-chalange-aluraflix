import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { VideoEntity } from './entities/video.entity';
import { AuthGuard } from '../autenticacao/guards/auth.guard';
import { AuthAdminGuard } from '../autenticacao/guards/auth-admin.guard';

@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('free')
  findFree(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 5,
  ): Promise<Pagination<VideoEntity>> {
    limit = limit > 5 ? limit : 5;
    const options = {
      page,
      limit,
      route: '/videos',
    };
    return this.videoService.findFree(options);
  }
  @Post()
  @UseGuards(AuthAdminGuard)
  create(@Body() dados: CreateVideoDto) {
    return this.videoService.create(dados);
  }

  @Get('all')
  @UseGuards(AuthAdminGuard)
  findAll() {
    return this.videoService.findAll();
  }

  @Get('')
  @UseGuards(AuthGuard)
  findAllPaginated(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 5,
  ): Promise<Pagination<VideoEntity>> {
    limit = limit > 5 ? limit : 5;
    const options = {
      page,
      limit,
      route: '/videos',
    };
    return this.videoService.findAllPaginate(options);
  }

  @Get('id/:id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(id);
  }

  @Get('categorias/:id')
  @UseGuards(AuthGuard)
  findVidoesByCategoria(@Param('id') categoriaId: string) {
    return this.videoService.findVidoesByCategoria(categoriaId);
  }

  @Get('busca')
  @UseGuards(AuthGuard)
  findVidoesByTitulo(@Query('titulo') titulo: string) {
    return this.videoService.findVidoesByTitulo(titulo);
  }

  @Patch(':id')
  @UseGuards(AuthAdminGuard)
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(id, updateVideoDto);
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  remove(@Param('id') id: string) {
    return this.videoService.remove(id);
  }
}
