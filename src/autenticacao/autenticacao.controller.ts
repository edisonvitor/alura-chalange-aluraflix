import { Controller, Post, Body } from '@nestjs/common';
import { AutenticacaoService } from './autenticacao.service';
import { AutenticacaoDto } from './dto/autenticacao.dto';

@Controller('login')
export class AutenticacaoController {
  constructor(private readonly autenticacaoService: AutenticacaoService) {}

  @Post()
  create(@Body() { email, password }: AutenticacaoDto) {
    return this.autenticacaoService.login(email, password);
  }
}
