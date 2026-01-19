import { Module } from '@nestjs/common';
import { WhatsappOficialService } from './whatsapp-oficial.service';
import { WhatsappOficialController } from './whatsapp-oficial.controller';
import { PrismaClient } from '@prisma/client';
import { RabbitMQService } from 'src/@core/infra/rabbitmq/RabbitMq.service';

@Module({
  controllers: [WhatsappOficialController],
  providers: [WhatsappOficialService, PrismaClient, RabbitMQService],
  exports: [WhatsappOficialService],
})
export class WhatsappOficialModule {}
