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

export type PaginatedData<T> = {
  data: T;
  totalPages: number;
  totalResults: number;
};
