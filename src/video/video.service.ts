import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideoEntity } from './entities/video.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
  ) {}
  async create(dados: CreateVideoDto) {
    const videoEntity = new VideoEntity();
    Object.assign(videoEntity, dados as VideoEntity);
    return await this.videoRepository.save(videoEntity);
  }

  async findAll() {
    return this.videoRepository.find();
  }

  async findFree(
    options: IPaginationOptions,
  ): Promise<Pagination<VideoEntity>> {
    const queryBuilder = this.videoRepository.createQueryBuilder('v');
    queryBuilder.select(['v.titulo', 'v.descricao', 'v.url']);
    queryBuilder.where('v.free = true');
    queryBuilder.orderBy('v.titulo', 'ASC');
    return paginate<VideoEntity>(queryBuilder, options);
  }

  async findAllPaginate(
    options: IPaginationOptions,
  ): Promise<Pagination<VideoEntity>> {
    const queryBuilder = this.videoRepository.createQueryBuilder('v');
    queryBuilder.select(['v.titulo', 'v.descricao', 'v.url']);
    queryBuilder.orderBy('v.titulo', 'ASC');
    return paginate<VideoEntity>(queryBuilder, options);
  }

  async findOne(id: string) {
    const video = await this.videoRepository.findOne({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException(`Video com id ${id} não encontrado`);
    }
    return video;
  }

  async findVidoesByCategoria(categoriaId: string) {
    const videos = await this.videoRepository.find({
      where: { categoria: { id: categoriaId } },
    });
    if (!videos) {
      throw new NotFoundException(
        `Categoria com id ${categoriaId} não encontrada`,
      );
    }
    return videos;
  }

  async findVidoesByTitulo(titulo: string) {
    const videos = await this.videoRepository.find({
      where: { titulo },
    });
    if (!videos) {
      throw new NotFoundException(`Video com titulo ${titulo} não encontrado`);
    }
    return videos;
  }

  async update(id: string, updateVideoDto: UpdateVideoDto) {
    const videoEncontrado = await this.videoRepository.findOne({
      where: { id },
    });
    if (!videoEncontrado) {
      throw new NotFoundException(`Video com id ${id} não encontrado`);
    }
    Object.assign(videoEncontrado, updateVideoDto);
    return await this.videoRepository.save(videoEncontrado);
  }

  async remove(id: string) {
    const videoEncontrado = await this.videoRepository.findOne({
      where: { id },
    });
    if (!videoEncontrado) {
      throw new NotFoundException(`Video com id ${id} não encontrado`);
    }
    await this.videoRepository.delete(videoEncontrado);
    return {
      message: 'Video removido com sucesso',
    };
  }
}
