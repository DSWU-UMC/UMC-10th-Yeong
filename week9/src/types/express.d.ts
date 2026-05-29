import "express";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }

    interface Response {
      error(args: { errorCode?: string | number | null; message?: string | null; data?: any | null }): this;
      success(args: { data?: any; message?: string | null; }): this;
    }
  }
}

export {};