import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { VideoEntity } from './entities/video.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  imports: [UsuarioModule, TypeOrmModule.forFeature([VideoEntity])],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
