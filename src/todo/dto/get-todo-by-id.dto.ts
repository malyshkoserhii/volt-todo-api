import { IsString } from 'class-validator';

export class GetTodoByIdParamDto {
  @IsString()
  id: string;
}
