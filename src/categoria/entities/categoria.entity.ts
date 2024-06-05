import { VideoEntity } from '../../video/entities/video.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'categorias' })
export class CategoriaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'titulo', length: 30, nullable: false })
  titulo: string;
  @Column({ name: 'cor', length: 7, nullable: false })
  cor: string;
  @OneToMany(() => VideoEntity, (videos) => videos.categoria, {
    cascade: true,
    eager: true,
  })
  videos: VideoEntity[];
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(Categoria?: Partial<CategoriaEntity>) {
    Categoria = Categoria || {};
    Categoria.id = this?.id;
    Categoria.titulo = this?.titulo;
    Categoria.cor = this?.cor;
    Categoria.videos = this?.videos;
  }
}
