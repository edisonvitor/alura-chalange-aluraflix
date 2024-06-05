export class ListUsuariosDto {
  constructor(
    readonly id: string,
    readonly nome: string,
    readonly email: string,
  ) {}
}
