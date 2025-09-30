import { Injectable, UnauthorizedException, HttpException  } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly http: HttpService
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.prismaService.user.findUnique({where: { email: email }})
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { userId: user.id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // async signInOCPP(): Promise<any> {
  //   const myHeaders = new Headers();
  //   myHeaders.append("accept", "application/json, text/plain, */*");
  //   myHeaders.append("accept-language", "pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6");
  //   myHeaders.append("authorization", "Basic Og==");
  //   myHeaders.append("content-type", "application/x-www-form-urlencoded");
  //   myHeaders.append("origin", "https://cloud.ocpp-css.com");
  //   myHeaders.append("priority", "u=1, i");
  //   myHeaders.append("referer", "https://cloud.ocpp-css.com/");
  //   myHeaders.append("sec-ch-ua", "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Microsoft Edge\";v=\"140\"");
  //   myHeaders.append("sec-ch-ua-mobile", "?0");
  //   myHeaders.append("sec-ch-ua-platform", "\"Windows\"");
  //   myHeaders.append("sec-fetch-dest", "empty");
  //   myHeaders.append("sec-fetch-mode", "cors");
  //   myHeaders.append("sec-fetch-site", "same-site");
  //   myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0");
  //   myHeaders.append("x-requested-with", "XMLHttpRequest");
  //   myHeaders.append("Cookie", "SID=de3b3e525d8089ba3f857f071e70a78abcf09dc1; __Secure-AT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiIDogImFjY291bnRzLm9jcHAtY3NzLmNvbSIsICJhdWQiIDogIndlYi1vY3BwLWNzcy5jb20iLCAic3ViIiA6ICJkZTNiM2U1MjVkODA4OWJhM2Y4NTdmMDcxZTcwYTc4YWJjZjA5ZGMxIiwgImlhdCIgOiAxNzU5MjUzMDYwLCAiZXhwIiA6IDE3NTkyNTY2NjB9.Xzz6srrXBHP7b9ecXTteax7yIPgtUr6qnffs_SVfbQs");

  //   const urlencoded = new URLSearchParams();
  //   urlencoded.append("grant_type", "password");
  //   urlencoded.append("username", "demo");
  //   urlencoded.append("password", "demo");

  //   const requestOptions: RequestInit = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: urlencoded,
  //     redirect: "follow"
  //   };

  //   fetch("https://ocpp-css.com/oauth2/token", requestOptions)
  //     .then((response) => response.text())
  //     .then((result) => console.log(result))
  //     .catch((error) => console.error(error));
  // }

  async signInOCPP(): Promise<any> {

    const body = new URLSearchParams({
      grant_type: process.env.OCPP_GRANT_TYPE || 'password',
      username: process.env.OCPP_USER || 'demo',
      password: process.env.OCPP_PASSWORD || 'demo',
    });

    try {
      const { data } = await firstValueFrom(
        this.http.post('https://ocpp-css.com/oauth2/token', body.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json, text/plain, */*',
          },
        }),
      );
      return data;
    } catch (err) {
      const e = err as AxiosError;
      const status = e.response?.status ?? 500;
      const payload = e.response?.data ?? e.message;
      throw new HttpException(
        { message: 'OCPP sign-in failed', details: payload },
        status,
      );
    }
  }
}
