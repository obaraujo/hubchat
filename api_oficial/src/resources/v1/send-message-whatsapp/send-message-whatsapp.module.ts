import { Module } from '@nestjs/common';
import { SendMessageWhatsappService } from './send-message-whatsapp.service';
import { SendMessageWhatsappController } from './send-message-whatsapp.controller';
import { PrismaService } from '../../../@core/infra/database/prisma.service';
import { MetaService } from '../../../@core/infra/meta/meta.service';
import { RedisService } from '../../../@core/infra/redis/RedisService.service';

@Module({
  controllers: [SendMessageWhatsappController],
  providers: [
    SendMessageWhatsappService,
    PrismaService,
    MetaService,
    RedisService,
  ],
  exports: [SendMessageWhatsappService],
})
export class SendMessageWhatsappModule {}
