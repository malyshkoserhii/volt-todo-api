import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, TodoModule],
  providers: [PrismaService],
})
export class AppModule {}
