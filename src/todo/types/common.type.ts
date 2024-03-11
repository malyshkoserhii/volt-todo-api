export type ResponseWithMessage = {
  message: string;
};

export type ResponseDataWithMessage<T> = {
  data: T;
  message: string;
};

export type CountTodoResponse = {
  completed: number;
  current: number;
};
