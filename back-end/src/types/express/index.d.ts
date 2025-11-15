import 'express';

declare module 'express' {
  export interface User {
    userId: string;
    email: string;
    role: string;
  }

  export interface Request {
    user?: User;
  }
}
