import { Controller, Get, Query, Param, HttpException, HttpStatus, Post, Body, UsePipes, HttpCode, Patch, Delete, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { CreateUserBodySchema, createUserBodySchema } from '../schemas/user.schema';
import { UserService } from '../services/user.service';


@ApiTags('users')
@Controller('/users')
export class UsersController {
  constructor(
    private prisma: PrismaService,
    private userService: UserService
  ) {}
  

  @Get()
  @ApiOperation({ summary: 'Lista todos os usuarios, com opção de filtrar apenas os admins' })
  @ApiQuery({ name: 'filter', required: false, enum: ['admins'], description: 'Filtro opcional para listar apenas os usários que são admin' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornados com sucesso' })
  async getUsers(@Query('filter') filter: any): Promise<any[]> {
    if(filter && filter === 'admins') {
      const admins = await this.prisma.user.findMany()
      return admins
    }
    const users = await this.prisma.user.findMany()
    return users
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtém um usuario específico pelo ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID do Usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario não encontrado' })
  async getKnight(@Param('id') id: any): Promise<any> {
      const knight = await this.prisma.user.findUnique({where: { id: id }})
      if(!knight) throw new HttpException("User not found!", HttpStatus.BAD_REQUEST)
      return knight
  }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createUserBodySchema))
  @ApiOperation({ summary: 'Cria um novo usuario' })
    @ApiBody({ 
    description: 'Dados do cavaleiro',
    schema: {
      example: {
        name: "Gustavo Gustavo Moreira", 
        email: "gustavogustavomoreira@casaarte.com.br",
        password: "Gus@2030",
        confirmPassword: "Gus@2030",
        phone: "+5579993193264",
        cpf: "300.579.700-76"
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  async createUser(@Body() body: CreateUserBodySchema): Promise<any> {
    try {
      return this.userService.create(body);
    } catch (error) {
      console.error(error);
      throw new HttpException(`Failed to create a user: ${error?.response}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Patch('/:id/name')
  // @ApiOperation({ summary: 'Atualiza o nome de um usuario' })
  // @ApiParam({ name: 'id', required: true, description: 'ID do usuario' })
  // @ApiBody({
  //   description: 'Novo nickname',
  //   schema: { example: { nickname: "Sir_Lancelot" } }
  // })
  // @ApiResponse({ status: 200, description: 'Nome atualizado com sucesso' })
  // @ApiResponse({ status: 404, description: 'Usuario não encontrado' })
  // async updateNickname(
  //   @Param('id') id: string, 
  //   @Body(new ZodValidationPipe(updateNicknameSchema)) body: UpdateNicknameSchema
  // ): Promise<any> {
  //   try {
  //     const { name } = body;

  //     const knight = await this.prisma.user.findUnique({
  //       where: { id },
  //     });

  //     if (!knight) {
  //       throw new HttpException('Knight not found!', HttpStatus.NOT_FOUND);
  //     }

  //     const existingKnight = await this.prisma.knight.findUnique({
  //       where: { nickname },
  //     });

  //     if (existingKnight) {
  //       throw new HttpException('This nickname is already in use!', HttpStatus.BAD_REQUEST);
  //     }

  //     const updateKnight = await this.prisma.knight.update({
  //       where: { id },
  //       data: { nickname },
  //     });

  //     return updateKnight
  //   } catch (error) {
  //     console.error(error);
  //     throw new HttpException(`Failed to update knight: ${error?.response}`, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // @Delete('/:id')
  // @ApiOperation({ summary: 'Promove um cavaleiro a herói' })
  // @ApiParam({ name: 'id', required: true, description: 'ID do cavaleiro' })
  // @ApiResponse({ status: 200, description: 'Cavaleiro promovido com sucesso' })
  // @ApiResponse({ status: 404, description: 'Cavaleiro não encontrado' })
  // async promoteKnight(@Param('id') id: string): Promise<any> {
  //   try {
  //     const knight = await this.prisma.knight.findUnique({
  //       where: { id },
  //     });

  //     if (!knight) {
  //       throw new HttpException('Knight not found!', HttpStatus.NOT_FOUND);
  //     }

  //     const promotedKnight = await this.prisma.knight.update({
  //       where: { id },
  //       data: { isHero: true },
  //     });

  //     return promotedKnight
  //   } catch (error) {
  //     console.error(error);
  //     throw new HttpException(`Failed to promote knight: ${error?.response}`, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
}