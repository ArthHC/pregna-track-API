import { IsDateString, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateNotificationDto {
  
  @IsNotEmpty()
  @IsInt()
  doctorId: number;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsString()
  message: string;
}