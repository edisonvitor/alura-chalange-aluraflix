import { VideoEntity } from '../../video/entities/video.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'usuarios' })
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'nome', length: 30, nullable: false })
  nome: string;
  @Column({ name: 'email', length: 40, nullable: false /*unique: true*/ })
  email: string;
  @Column({ name: 'password', length: 30, nullable: false })
  password: string;
  @OneToMany(() => VideoEntity, (videos) => videos.usuario, {
    cascade: true,
    eager: true,
  })
  videos?: VideoEntity[];
  @Column({ name: 'role', length: 15, nullable: false, default: 'user' })
  role?: string;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(Usuario?: Partial<UsuarioEntity>) {
    Usuario = Usuario || {};
    Usuario.id = this?.id;
    Usuario.nome = this?.nome;
    Usuario.email = this?.email;
    Usuario.password = this?.password;
    Usuario.videos = this?.videos;
    Usuario.role = this?.role;
  }
}
