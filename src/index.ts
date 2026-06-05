import dotenv from "dotenv";
import express, { Express, Request, Response , NextFunction} from "express";
import cors from "cors";
import { RegisterRoutes } from "./generated/routes.js";
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { AppError } from "./common/errors/app.error.js";
import swaggerUi from "swagger-ui-express";
// ESM 환경에서는 JSON 파일을 가져올 때 아래와 같이 처리합니다.
import path from "path";
import fs from "fs";
import passport from "passport";
import { googleStrategy,jwtStrategy } from "./auth.config.js";


// 1. 환경 변수 설정
dotenv.config();

passport.use(googleStrategy);
passport.use(jwtStrategy);

const app: Express = express();
app.use(passport.initialize());
const port = process.env.PORT || 3000;

app.use((req: Request, res: Response, next: NextFunction) => {
  res.error = function ({ errorCode = null, message = null, data = null }) {
    return this.json({
      resultType: "FAILED",
      error: { errorCode, message, data },
      data: null,
    });
  };
  res.success = function ({ data = null, message = null } = {}) {
    return this.json({
      resultType: "SUCCESS",
      error: null,
      data,
      message,
    });
  };
  next();
});


// 2. 미들웨어 설정
app.use(cors());            // cors 방식 허용                 
app.use(express.static('public'));    // 정적 파일 접근      
app.use(express.json());              // request의 본문을 json으로 해석할 수 있도록 함(JSON 형태의 요청 body를 파싱하기 위함)     
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use(morgan('dev'));  // 로그 포맷: dev
app.use(cookieParser()); 

// 1. TSOA가 생성한 swagger.json 읽어오기
const swaggerFile = JSON.parse(
  fs.readFileSync(path.resolve("dist/swagger.json"), "utf8")
);

// 2. Swagger UI 연결
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Express.js에 생성한 엔드 포인트들을 register
const router = express.Router();

// 응답 표준화 미들웨어: controller가 반환한 값을 자동으로 표준 성공 응답으로 래핑
router.use((req: Request, res: Response, next: NextFunction) => {
  const origJson = res.json.bind(res) as (body?: any) => Response;
  (res as any).json = (body?: any) => {
    // 이미 표준 형식이면 그대로 전달
    if (body && (body.resultType === "SUCCESS" || body.resultType === "FAILED")) {
      return origJson(body);
    }

    // 성공 응답으로 래핑
    return origJson({
      resultType: "SUCCESS",
      error: null,
      data: body,
    });
  };
  next();
});

RegisterRoutes(router);
app.use("/api/v1", router);


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err && (err.errorCode !== undefined || err.statusCode !== undefined)) {
    return res.status(err.statusCode || 500).error({
      errorCode: err.errorCode || "unknown",
      message: err.message || null,
      data: err.data || null,
    });
  }

  // fallback for unknown errors
  return res.status(500).error({
    errorCode: "unknown",
    message: err?.message ?? null,
    data: null,
  });
});


// const isLogin = (req: any, res: any, next: any) => {
//     // cookie-parser가 만들어준 req.cookies 객체에서 username을 확인
//     const { username } = req.cookies; 

//     if (username) {
     
//         console.log(`[인증 성공] ${username}님, 환영합니다.`);
//         next(); 
//     } else {
    
//         console.log('[인증 실패] 로그인이 필요합니다.');
//         res.status(401).send('<script>alert("로그인이 필요합니다!");location.href="/login";</script>');
//     }
// };


// 3. 기본 라우트
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! This is TypeScript Server!");
});


// 쿠키 만드는 라우터 
app.get('/setcookie', (req, res) => {
    // 'myCookie'라는 이름으로 'hello' 값을 가진 쿠키를 생성
    res.cookie('myCookie', 'hello', { maxAge: 60000 }); // 60초간 유효
    res.send('쿠키가 생성되었습니다!');
});

// 쿠키 읽는 라우터 
app.get('/getcookie', (req, res) => {
    // cookie-parser 덕분에 req.cookies 객체에서 바로 꺼내 쓸 수 있음
    const myCookie = req.cookies.myCookie; 
    
    if (myCookie) {
        console.log(req.cookies); // { myCookie: 'hello' }
        res.send(`당신의 쿠키: ${myCookie}`);
    } else {
        res.send('쿠키가 없습니다.');
    }
});

const isLogin = passport.authenticate('jwt', { session: false });

app.get('/mypage', isLogin, (req, res) => {
  const user = req.user as { name?: string } | undefined;

  if (!user) {
    return res.status(401).error({
      errorCode: "unauthorized",
      message: "인증된 사용자가 없습니다.",
      data: null,
    });
  }

  return res.status(200).success({
    data: {
      user,
    },
    message: `인증 성공! ${user.name}님의 마이페이지입니다.`,
  });
});

//http://localhost:7777/oauth2/login/google

app.get("/oauth2/login/google", passport.authenticate("google", { session: false }));
app.get("/oauth2/callback/google", 
  passport.authenticate("google", { session: false, failureRedirect: "/login-failed" }),
  (req, res) => {
    res.status(200).json({ success: true, tokens: req.user });
  }
);


// 4. 서버 시작
app.listen(port, () => {
  console.log(`[server]: Server is running at <http://localhost>:${port}`);
});


