import { Controller, Post, UseGuards, Request, Body, Get, ValidationPipe, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('🔐 Autenticação')
@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Login do médico',
    description: 'Autentica um médico com email e senha, retornando um token JWT válido por 24h'
  })
  @ApiBody({
    type: LoginDto,
    description: 'Credenciais do médico',
    examples: {
      login: {
        summary: 'Login válido',
        description: 'Exemplo de login com credenciais válidas',
        value: {
          email: 'joao.silva@email.com',
          password: '123456789'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: 1,
        email: 'joao.silva@email.com',
        name: 'Dr. João',
        surname: 'Silva'
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
    example: {
      statusCode: 401,
      message: 'Credenciais inválidas'
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos',
    example: {
      statusCode: 400,
      message: ['email must be an email', 'password should not be empty'],
      error: 'Bad Request'
    }
  })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @ApiOperation({
    summary: 'Perfil do médico autenticado',
    description: 'Retorna informações do médico atualmente logado baseado no token JWT'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Perfil do médico',
    example: {
      id: 1,
      email: 'joao.silva@email.com',
      name: 'Dr. João'
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT inválido ou expirado',
    example: {
      statusCode: 401,
      message: 'Unauthorized'
    }
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
