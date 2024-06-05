import { IsEmail, IsNotEmpty } from 'class-validator';

export class AutenticacaoDto {
  @IsEmail({}, { message: 'Email invalido' })
  email: string;
  @IsNotEmpty({ message: 'O campo password não pode estar vazio' })
  password: string;
}
