import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaEntity } from './entities/categoria.entity';
import { Repository } from 'typeorm';
import { VideoEntity } from '../video/entities/video.entity';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class CategoriaService {
  @InjectRepository(CategoriaEntity)
  private readonly categoriaRepository: Repository<CategoriaEntity>;
  private readonly videosRepository: Repository<VideoEntity>;
  async create(createCategoriaDto: CreateCategoriaDto) {
    const categoriaEntity = new CategoriaEntity();
    Object.assign(categoriaEntity, createCategoriaDto as CategoriaEntity);
    return await this.categoriaRepository.save(categoriaEntity);
  }

  async findAll() {
    return await this.categoriaRepository.find();
  }

  async findAllPaginate(
    options: IPaginationOptions,
  ): Promise<Pagination<CategoriaEntity>> {
    const queryBuilder = this.categoriaRepository.createQueryBuilder('c');
    queryBuilder.select(['c.id', 'c.titulo', 'c.cor']);
    queryBuilder.orderBy('c.titulo', 'ASC');

    return paginate<CategoriaEntity>(queryBuilder, options);
  }

  async findOne(id: string) {
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
    });
    if (!categoria) {
      throw new NotFoundException(`Categoria com id ${id} não encontrada`);
    }
    return categoria;
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    const categoriaEncontrada = await this.categoriaRepository.findOne({
      where: { id },
    });
    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria com id ${id} não encontrada`);
    }
    Object.assign(categoriaEncontrada, updateCategoriaDto);
    return await this.categoriaRepository.save(categoriaEncontrada);
  }

  async remove(id: string) {
    const categoriaEncontrada = await this.categoriaRepository.findOne({
      where: { id },
    });
    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria com id ${id} não encontrada`);
    }
    await this.categoriaRepository.delete(categoriaEncontrada);
    return {
      message: `Categoria com id ${id} removida com sucesso`,
    };
  }
}
