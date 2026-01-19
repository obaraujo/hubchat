import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateWhatsappOficialDto {
  @ApiProperty({ description: 'ID do número de telefone no Meta Business' })
  @IsString()
  phone_number_id: string;

  @ApiProperty({ description: 'ID da conta WhatsApp Business (WABA)' })
  @IsString()
  waba_id: string;

  @ApiProperty({ description: 'Token de acesso permanente do Meta' })
  @IsString()
  send_token: string;

  @ApiProperty({ description: 'ID do Business no Meta' })
  @IsString()
  business_id: string;

  @ApiProperty({ description: 'Número de telefone formatado' })
  @IsString()
  phone_number: string;

  @ApiProperty({ description: 'Token para integração com Mult100' })
  @IsString()
  token_mult100: string;

  @ApiProperty({ description: 'ID da empresa no Mult100' })
  @IsNumber()
  idEmpresaMult100: number;

  @ApiPropertyOptional({ description: 'Usar RabbitMQ' })
  @IsBoolean()
  @IsOptional()
  use_rabbitmq?: boolean;

  @ApiPropertyOptional({ description: 'Exchange do RabbitMQ' })
  @IsString()
  @IsOptional()
  rabbitmq_exchange?: string;

  @ApiPropertyOptional({ description: 'Nome da fila RabbitMQ' })
  @IsString()
  @IsOptional()
  rabbitmq_queue?: string;

  @ApiPropertyOptional({ description: 'Routing key do RabbitMQ' })
  @IsString()
  @IsOptional()
  rabbitmq_routing_key?: string;

  @ApiPropertyOptional({ description: 'URL do webhook Chatwoot' })
  @IsString()
  @IsOptional()
  chatwoot_webhook_url?: string;

  @ApiPropertyOptional({ description: 'Token auth Chatwoot' })
  @IsString()
  @IsOptional()
  auth_token_chatwoot?: string;

  @ApiPropertyOptional({ description: 'URL do webhook N8N' })
  @IsString()
  @IsOptional()
  n8n_webhook_url?: string;

  @ApiPropertyOptional({ description: 'Token auth N8N' })
  @IsString()
  @IsOptional()
  auth_token_n8n?: string;

  @ApiPropertyOptional({ description: 'URL do webhook CRM' })
  @IsString()
  @IsOptional()
  crm_webhook_url?: string;

  @ApiPropertyOptional({ description: 'Token auth CRM' })
  @IsString()
  @IsOptional()
  auth_token_crm?: string;

  @ApiPropertyOptional({ description: 'URL do webhook Typebot' })
  @IsString()
  @IsOptional()
  typebot_webhook_url?: string;

  @ApiPropertyOptional({ description: 'Token auth Typebot' })
  @IsString()
  @IsOptional()
  auth_token_typebot?: string;
}
