import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoModule } from './video/video.module';
import { CategoriaModule } from './categoria/categoria.module';
import { UsuarioModule } from './usuario/usuario.module';
import { ConfigModule } from '@nestjs/config';
import { AutenticacaoModule } from './autenticacao/autenticacao.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './src/config/db/db.sqlite',
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      synchronize: true,
    }),
    VideoModule,
    CategoriaModule,
    UsuarioModule,
    AutenticacaoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
