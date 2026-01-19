import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'nome da empresa',
    default: 'Empresa A',
    example: 'Empresa A',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'id da empresa no mult100',
    default: 1,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  idEmpresaMult100: number;
}
