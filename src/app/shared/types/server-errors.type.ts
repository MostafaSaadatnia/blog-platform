export type ServerErrors =
  | { errors?: Record<string, string[] | string> }
  | { message?: string; error?: any }
  | any;
