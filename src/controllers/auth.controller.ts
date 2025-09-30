import { Controller, Get, Query, Param, HttpException, HttpStatus, Post, Body, UsePipes, HttpCode, Patch, Delete } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger'
import { AuthService } from '../auth/auth.service'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

const authBodySchema = z.object({
  email: z.string().email("E-mail inválido. Informe um endereço válido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

const updateUserSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").max(15, "Name too long"),
});


type AuthBodySchema = z.infer<typeof authBodySchema>

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authBodySchema))
  @ApiOperation({ summary: 'Autentica o usuario logado' })
    @ApiBody({ 
    description: 'Dados do usuario',
    schema: {
      example: {
        email: "gustavogustavomoreira@casaarte.com.br",
        password: "Gus@2030",
      }
    }
  })

  @ApiResponse({ status: 200, description: 'Usuário autenticado com sucesso' })
  async createUser(@Body() body: AuthBodySchema): Promise<any> {
    try {
      const {email,password} = body
      const authToken = await this.authService.signIn(email, password);
      console.log(authToken);
      return authToken;
    } catch (error) {
      console.error(error);
      throw new HttpException(`Failed to create a user: ${error?.response}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}