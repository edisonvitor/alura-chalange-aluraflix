import { UsuarioEntity } from '../../usuario/entities/usuario.entity';
import { CategoriaEntity } from '../../categoria/entities/categoria.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'videos' })
export class VideoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'titulo', length: 30, nullable: false })
  titulo: string;
  @Column({ name: 'descricao', length: 150, nullable: false })
  descricao: string;
  @Column({ name: 'url', nullable: true })
  url: string;
  @ManyToOne(() => CategoriaEntity, (categoria) => categoria.videos)
  categoria: CategoriaEntity;
  @Column({ name: 'categoriaId', nullable: true, default: '1' })
  categoriaId: string;
  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.videos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  usuario: UsuarioEntity;
  @Column({ name: 'free', nullable: true, default: false })
  free: boolean;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(video?: Partial<VideoEntity>) {
    video = video || {};
    video.id = this?.id;
    video.titulo = this?.titulo;
    video.descricao = this?.descricao;
    video.url = this?.url;
    video.categoria = this?.categoria;
    video.categoriaId = this?.categoriaId;
  }
}
