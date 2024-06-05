import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { CreateCategoriaDto } from '../..//categoria/dto/create-categoria.dto';

export class CreateVideoDto {
  id?: string;
  @IsString({ message: 'O titulo deve ser um texto' })
  @IsNotEmpty({ message: 'O titulo não pode ser vazio' })
  titulo: string;
  @IsString({ message: 'A descrição não pode ser vazia' })
  @IsNotEmpty({ message: 'A descrição não pode ser vazio' })
  descricao: string;
  @IsUrl({})
  url: string;
  @Type(() => CreateCategoriaDto)
  categoria?: CreateCategoriaDto | string;
  categoriaId?: string;
}
