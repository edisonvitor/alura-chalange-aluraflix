import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { VideoEntity } from 'src/video/entities/video.entity';

export class CreateUsuarioDto {
  id?: string;
  @IsString({ message: 'O campo nome deve ser um texto' })
  @IsNotEmpty({ message: 'O campo nome não pode estar vazio' })
  nome: string;
  @IsEmail({}, { message: 'O campo email deve ser um email valido' })
  email: string;
  @Matches(
    /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\/\*\-\+\.\)\(\&\%\$\#\@\!]).{6,32})$/,
    {
      message:
        'A senha deve ter entre 6 e 32 caracteres, um deve ser um especial, uma letra maiúscula, uma minúscula e um número',
    },
  )
  password: string;
  videos: VideoEntity[];
  createdAt: Date;
  updatedAt: Date;
}
