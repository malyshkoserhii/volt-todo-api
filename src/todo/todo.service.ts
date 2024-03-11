import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Todo } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoDto, GetAllTodoDto, UpdateTodoDto } from './dto';
import {
  CountTodoResponse,
  PaginatedData,
  ResponseDataWithMessage,
  ResponseWithMessage,
} from './types';

@Injectable()
export class TodoService {
  constructor(private prismaService: PrismaService) {}

  async create(body: CreateTodoDto): Promise<ResponseDataWithMessage<Todo>> {
    try {
      const todo = await this.prismaService.todo.create({
        data: {
          ...body,
        },
      });

      return {
        data: todo,
        message: 'Todo successfully created!',
      };
    } catch (error) {
      throw new NotFoundException('Todo not created');
    }
  }

  async getById(todoId: string): Promise<Todo> {
    try {
      const todo = await this.prismaService.todo.findUnique({
        where: {
          id: todoId,
        },
      });

      return todo;
    } catch (error) {
      throw new NotFoundException("Todo with such id doesn't fount");
    }
  }

  async update(body: UpdateTodoDto): Promise<ResponseDataWithMessage<Todo>> {
    try {
      const updatedTodo = await this.prismaService.todo.update({
        where: {
          id: body?.id,
        },
        data: {
          ...body,
        },
      });

      return {
        data: updatedTodo,
        message: 'Todo successfuly updated!',
      };
    } catch (error) {
      throw new NotFoundException("Can't update todo!");
    }
  }

  async getAll(body: GetAllTodoDto): Promise<PaginatedData<Array<Todo>>> {
    try {
      const defaultWhereOptions = this.defaultPaginationOptions(body);

      const todos = await this.prismaService.todo.findMany({
        ...defaultWhereOptions,
      });

      const totalResults = await this.countTotalTodo();

      const totalPages = Math.ceil(totalResults / body?.take);

      return {
        data: todos,
        totalPages,
        totalResults,
      };
    } catch (error) {
      throw new NotFoundException("Can't fetch all todos!");
    }
  }

  async getAllCompleted(body: GetAllTodoDto): Promise<PaginatedData<Array<Todo>>> {
    try {
      const paginationOptions = this.defaultPaginationOptions(body);

      const completedWhereOptions = {
        where: {
          completed: true,
        },
      };

      const todos = await this.prismaService.todo.findMany({
        ...paginationOptions,
        ...completedWhereOptions,
      });

      const totalResults = await this.prismaService.todo.count({
        ...completedWhereOptions,
      });

      const totalPages = Math.ceil(totalResults / body?.take);

      return {
        data: todos,
        totalPages,
        totalResults,
      };
    } catch (error) {
      throw new NotFoundException("Can't fetch all todos!");
    }
  }

  async getAllCurrent(body: GetAllTodoDto): Promise<PaginatedData<Array<Todo>>> {
    try {
      const paginationOptions = this.defaultPaginationOptions(body);

      const currentWhereOptions = {
        where: {
          completed: false,
        },
      };

      const todos = await this.prismaService.todo.findMany({
        ...paginationOptions,
        ...currentWhereOptions,
      });

      const totalResults = await this.prismaService.todo.count({
        ...currentWhereOptions,
      });

      const totalPages = Math.ceil(totalResults / body?.take);

      return {
        data: todos,
        totalPages,
        totalResults,
      };
    } catch (error) {
      throw new NotFoundException("Can't fetch all todos!");
    }
  }

  async getTodoCount(): Promise<CountTodoResponse> {
    const completed = await this.prismaService.todo.count({
      where: {
        completed: true,
      },
    });

    const current = await this.prismaService.todo.count({
      where: {
        completed: false,
      },
    });

    return {
      current,
      completed,
    };
  }

  async delete(todoId: string): Promise<ResponseWithMessage> {
    try {
      await this.prismaService.todo.delete({
        where: {
          id: todoId,
        },
      });

      return {
        message: 'Todo was removed successfully!',
      };
    } catch (error) {
      throw new NotFoundException("Todo with such id doesn't fount");
    }
  }

  private defaultPaginationOptions(body: GetAllTodoDto): Prisma.TodoFindManyArgs {
    return {
      skip: body?.skip,
      take: body?.take,
      orderBy: {
        created_at: 'desc',
      },
    };
  }

  private async countTotalTodo(): Promise<number> {
    const total = await this.prismaService.todo.count();
    return total;
  }
}
