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
import { AutenticacaoGuard } from 'src/autenticacao/guards/autenticacao.guard';
import { SkipAuth } from 'src/decorators/skip-auth.decorator';

@Controller('videos')
@UseGuards(AutenticacaoGuard)
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('free')
  @SkipAuth()
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
  create(@Body() dados: CreateVideoDto) {
    return this.videoService.create(dados);
  }

  @Get('all')
  findAll() {
    return this.videoService.findAll();
  }

  @Get('')
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
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(id);
  }

  @Get('categorias/:id')
  findVidoesByCategoria(@Param('id') categoriaId: string) {
    return this.videoService.findVidoesByCategoria(categoriaId);
  }

  @Get('busca')
  findVidoesByTitulo(@Query('titulo') titulo: string) {
    return this.videoService.findVidoesByTitulo(titulo);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(id);
  }
}
