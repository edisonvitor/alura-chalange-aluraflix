import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoDto } from './create-video.dto';
import { IsOptional } from 'class-validator';

export class UpdateVideoDto extends PartialType(CreateVideoDto) {
  id?: string;
  @IsOptional()
  titulo: string;
  @IsOptional()
  descricao: string;
}
