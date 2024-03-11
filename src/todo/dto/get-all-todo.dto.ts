import { IsNumber } from 'class-validator';

export class GetAllTodoDto {
  @IsNumber()
  take: number;

  @IsNumber()
  skip: number;
}
