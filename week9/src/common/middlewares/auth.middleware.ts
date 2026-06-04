import passport from "passport";
import { Request, Response, NextFunction } from "express";

export function authorizeUser() {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: false }, (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        console.log("[인증 실패] 로그인이 필요합니다.");
        return res.status(401).json({
          resultType: "FAILED",
          error: {
            errorCode: "unauthorized",
            message: "로그인이 필요합니다.",
            data: null,
          },
          data: null,
        });
      }

      req.user = user;
      next();
    })(req, res, next);
  };
}
