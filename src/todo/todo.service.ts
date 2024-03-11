import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoDto, UpdateTodoDto } from './dto';
import { CountTodoResponse, ResponseDataWithMessage, ResponseWithMessage } from './types';

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

  async getAll(): Promise<Array<Todo>> {
    try {
      const todos = await this.prismaService.todo.findMany();
      return todos;
    } catch (error) {
      throw new NotFoundException("Can't fetch all todos!");
    }
  }

  async getAllCompleted(): Promise<Array<Todo>> {
    try {
      const todos = await this.prismaService.todo.findMany({
        where: {
          completed: true,
        },
      });

      return todos;
    } catch (error) {
      throw new NotFoundException("Can't fetch all todos!");
    }
  }

  async getAllCurrent(): Promise<Array<Todo>> {
    try {
      const todos = await this.prismaService.todo.findMany({
        where: {
          completed: false,
        },
      });

      return todos;
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
        message: 'Todo was removed',
      };
    } catch (error) {
      throw new NotFoundException("Todo with such id doesn't fount");
    }
  }
}
