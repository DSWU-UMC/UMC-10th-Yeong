import {
  Body,
  Controller,
  Get,
  Middlewares,
  Post,
  Request,
  Res,
  Route,
  Tags,
  Response,
  Example,
} from "tsoa";
import { UserSignUpRequest, UserSignUpResponse } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import { ApiResponse, success } from "../../../common/responses/response.js";
import { authorizeUser } from "../../../common/middlewares/auth.middleware.js";
import { Request as ExpressRequest } from "express";

// express에서 온 Response는 'ExpressResponse'로 부르겠다고 약속!
import { Response as ExpressResponse, } from "express";

@Route("users") // 라우트 경로
@Tags("Users") // Swagger 태그
export class UserController extends Controller {
    /**
   * 회원가입 API
   * @summary 회원가입을 처리하는 엔드포인트입니다.
   */

  @Post("signup") // 엔드포인드 정의
  /**
   * 회원가입
   * @summary 회원가입을 처리하는 엔드포인드입니다.
   * @param body 회원가입 정보 (Body)
   * @returns 생성된 유저 정보
   */
  @Response(201, "회원가입 성공")
  @Response(400, "중복된 이메일 에러")
  @Example<UserSignUpRequest>({
    email: "user@example.com",
    name: "홍길동",
    gender: "male",
    birth: "1990-01-01",
    phoneNumber: "010-1234-5678",
    preferences: [1, 2]
  })
  @Example<UserSignUpResponse>({
    userId: 1,
    preferences: ["한식", "양식"]
  })
  public async handleUserSignUp(
    @Body() body: UserSignUpRequest,
  ): Promise<ApiResponse<UserSignUpResponse>> {
    console.log("회원가입을 요청했습니다!");
    console.log("body:", body);
    const user = await userSignUp(body); //서비스 로직 호출
    return success(user); //성공 응답 보내기
  }


    @Get("guest")
    /**
     * 게스트 페이지
     * @summary 로그인이 필요 없는 게스트용 페이지입니다.
     * @returns 간단한 HTML 페이지 문자열
     */
    @Response(200, "조회 성공")
    public async handleGuestPage(): Promise<ApiResponse<String>> {
      return success(`
              <h1>게스트 페이지</h1>
              <p>이 페이지는 로그인이 필요 없습니다.</p>
              <ul>
                  <li><a href="/api/v1/users/mypage">마이페이지 (로그인 필요)</a></li>
              </ul>
          `);
    }
  @Get("login")
    /**
     * 로그인 페이지
     * @summary 로그인 리다이렉트 시 보여줄 페이지
     * @returns 간단한 HTML 문자열
     */
    @Response(200, "조회 성공")
    public async handleLoginPage(): Promise<ApiResponse<String>> {
      return success("<h1>로그인 페이지</h1><p>로그인이 필요한 페이지에서 튕겨나오면 여기로 옵니다.</p>");
    }
  @Get("mypage")
  @Middlewares(authorizeUser())
    /**
     * 마이페이지
     * @summary 로그인한 사용자를 위한 마이페이지
     * @param req - 요청(인증된 사용자 정보 포함)
     * @returns 사용자 전용 HTML 문자열
     */
    @Response(200, "조회 성공")
    @Response(401, "인증 실패 - 로그인 필요")
    public async handleMypage(@Request() req: ExpressRequest): Promise<ApiResponse<String>> {
      const userName = (req.user as any)?.name ?? "사용자";
      return success(`
              <h1>마이페이지</h1>
              <p>환영합니다, ${userName}님!</p>
              <p>이 페이지는 로그인한 사람만 볼 수 있습니다.</p>
          `);
    }
  @Get("set-login")
    /**
     * 로그인 설정(테스트용 쿠키 생성)
     * @summary 테스트용으로 로그인 쿠키를 생성합니다.
     * @param req - 요청(응답에 쿠키를 설정함)
     * @returns 생성 완료 메시지
     */
    @Response(200, "쿠키 생성 성공")
    public async handleSetLogin(@Request() req: ExpressRequest): Promise<ApiResponse<String>> {
      req.res!.cookie("username", "UMC10th", { maxAge: 3600000 });
      return success('로그인 쿠키(username=UMC9th) 생성 완료! <a href="/api/v1/users/mypage">마이페이지로 이동</a>');
    }
  @Get("set-logout")
    /**
     * 로그아웃(쿠키 삭제)
     * @summary 로그인 쿠키를 삭제합니다.
     * @param req - 요청(응답에서 쿠키를 삭제함)
     * @returns 로그아웃 완료 메시지
     */
    @Response(200, "로그아웃 성공")
    public async handleSetLogout(
      @Request() req: ExpressRequest,
    ): Promise<ApiResponse<String>> {
      req.res!.clearCookie("username");
      return success('로그아웃 완료 (쿠키 삭제). <a href="/api/v1/users/guest">메인으로</a>');
    }
}
