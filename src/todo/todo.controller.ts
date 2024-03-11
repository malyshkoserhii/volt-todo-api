import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Todo } from '@prisma/client';

import { TodoService } from './todo.service';
import { CreateTodoDto, GetAllTodoDto, UpdateTodoDto } from './dto';
import {
  CountTodoResponse,
  PaginatedData,
  ResponseDataWithMessage,
  ResponseWithMessage,
} from './types';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get('all')
  getAll(@Body() body: GetAllTodoDto): Promise<PaginatedData<Array<Todo>>> {
    return this.todoService.getAll(body);
  }

  @Get('completed')
  getAllCompleted(@Body() body: GetAllTodoDto): Promise<PaginatedData<Array<Todo>>> {
    return this.todoService.getAllCompleted(body);
  }

  @Get('current')
  getAllCurrent(@Body() body: GetAllTodoDto): Promise<PaginatedData<Array<Todo>>> {
    return this.todoService.getAllCurrent(body);
  }

  @Get('count')
  getTodoCount(): Promise<CountTodoResponse> {
    return this.todoService.getTodoCount();
  }

  @Post('create')
  create(@Body() body: CreateTodoDto): Promise<ResponseDataWithMessage<Todo>> {
    return this.todoService.create(body);
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<Todo> {
    return this.todoService.getById(id);
  }

  @Post('update')
  update(@Body() body: UpdateTodoDto): Promise<ResponseDataWithMessage<Todo>> {
    return this.todoService.update(body);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<ResponseWithMessage> {
    return this.todoService.delete(id);
  }
}
