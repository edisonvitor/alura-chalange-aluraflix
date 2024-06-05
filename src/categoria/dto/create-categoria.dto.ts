import { Type } from 'class-transformer';
import {
  IsArray,
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateVideoDto } from '../../video/dto/create-video.dto';

export class CreateCategoriaDto {
  id?: string | undefined;
  @IsString({
    message: 'O titulo deve ser um texto e não pode estar vazio',
  })
  @IsNotEmpty({ message: 'O titulo deve ser um texto e não pode estar vazio' })
  titulo: string;
  @IsHexColor({ message: 'A cor deve ser um hex compativel com CSS' })
  cor: string;
  @IsOptional()
  @ValidateNested()
  @IsArray()
  @Type(() => CreateVideoDto)
  videos: CreateVideoDto[];
}
