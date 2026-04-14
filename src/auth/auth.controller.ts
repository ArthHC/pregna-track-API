import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  ValidationPipe,
  UsePipes,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('🔐 Autenticação')
@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Login do médico',
    description:
      'Autentica um médico com email e senha, retornando um token JWT válido por 24h',
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
          password: '123456789',
        },
      },
    },
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
        surname: 'Silva',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
    example: {
      statusCode: 401,
      message: 'Credenciais inválidas',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos',
    example: {
      statusCode: 400,
      message: ['email must be an email', 'password should not be empty'],
      error: 'Bad Request',
    },
  })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({
    summary: 'Perfil do médico autenticado',
    description:
      'Retorna informações do médico atualmente logado baseado no token JWT',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Perfil do médico',
    example: {
      id: 1,
      email: 'joao.silva@email.com',
      name: 'Dr. João',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT inválido ou expirado',
    example: {
      statusCode: 401,
      message: 'Unauthorized',
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @ApiOperation({
    summary: 'Renovar token JWT',
    description: 'Renova um token JWT expirado ou próximo do vencimento',
  })
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Token a ser renovado',
    examples: {
      refresh: {
        summary: 'Renovar token',
        description: 'Exemplo de renovação de token',
        value: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Token renovado com sucesso',
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: 1,
        email: 'joao.silva@email.com',
        name: 'Dr. João',
        surname: 'Silva',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou não renovável',
    example: {
      statusCode: 401,
      message: 'Não foi possível renovar o token',
    },
  })
  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.token);
  }

  @ApiOperation({
    summary: 'Buscar dados do médico logado',
    description: 'Retorna dados completos do médico atualmente autenticado',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Dados do médico logado',
    example: {
      id: 1,
      name: 'Dr. João',
      surname: 'Silva',
      email: 'joao.silva@email.com',
      dateOfBirth: '1985-03-15T00:00:00.000Z',
      parity: null,
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT inválido',
    example: {
      statusCode: 401,
      message: 'Unauthorized',
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getCurrentDoctor(@Request() req) {
    return this.authService.getCurrentDoctor(req.user.sub);
  }

  @ApiOperation({
    summary: 'Alterar senha do médico',
    description:
      'Permite ao médico alterar sua senha fornecendo a senha atual e uma nova senha',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({
    type: ChangePasswordDto,
    description: 'Senha atual e nova senha',
    examples: {
      change: {
        summary: 'Alterar senha',
        description: 'Exemplo de alteração de senha',
        value: {
          currentPassword: 'senhaAtual123',
          newPassword: 'novaSenha456',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Senha alterada com sucesso',
    example: {
      message: 'Senha alterada com sucesso',
      timestamp: '2025-10-20T14:30:00.000Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Senha atual incorreta ou nova senha inválida',
    example: {
      statusCode: 400,
      message: 'Senha atual incorreta',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT inválido',
    example: {
      statusCode: 401,
      message: 'Unauthorized',
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @Patch('change-password')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.sub, changePasswordDto);
  }
}
