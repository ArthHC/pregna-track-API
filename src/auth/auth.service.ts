import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DoctorsService } from '../doctors/doctors.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private doctorsService: DoctorsService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const doctor = await this.doctorsService.findByEmail(email);

    if (doctor && (await bcrypt.compare(password, doctor.password))) {
      const { password, ...result } = doctor;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
      },
    };
  }

  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  async refreshToken(token: string) {
    try {
      // Decodificar o token mesmo que esteja expirado
      const decoded = this.jwtService.decode(token) as any;

      if (!decoded || !decoded.sub) {
        throw new UnauthorizedException('Token inválido');
      }

      // Buscar o usuário para garantir que ainda existe
      const doctor = await this.doctorsService.findOne(decoded.sub);

      if (!doctor) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      // Gerar novo token
      const payload = {
        email: doctor.email,
        sub: doctor.id,
        name: doctor.name,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: doctor.id,
          email: doctor.email,
          name: doctor.name,
          surname: doctor.surname,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Não foi possível renovar o token');
    }
  }

  async getCurrentDoctor(userId: number) {
    const doctor = await this.doctorsService.findOne(userId);

    if (!doctor) {
      throw new UnauthorizedException('Médico não encontrado');
    }

    const { password, ...result } = doctor;
    return result;
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const doctor = await this.doctorsService.findOne(userId);

    if (!doctor) {
      throw new UnauthorizedException('Médico não encontrado');
    }

    // Verificar se a senha atual está correta
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      doctor.password,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Senha atual incorreta');
    }

    // Verificar se a nova senha não é igual à atual
    const isSamePassword = await bcrypt.compare(
      changePasswordDto.newPassword,
      doctor.password,
    );

    if (isSamePassword) {
      throw new BadRequestException(
        'A nova senha deve ser diferente da senha atual',
      );
    }

    // Hash da nova senha
    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      10,
    );

    // Atualizar a senha no banco
    await this.doctorsService.update(userId, {
      password: hashedNewPassword,
    });

    return {
      message: 'Senha alterada com sucesso',
      timestamp: new Date().toISOString(),
    };
  }
}
