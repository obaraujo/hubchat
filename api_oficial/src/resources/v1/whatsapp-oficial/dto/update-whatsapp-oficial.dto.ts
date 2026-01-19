import { PartialType } from '@nestjs/swagger';
import { CreateWhatsappOficialDto } from './create-whatsapp-oficial.dto';

export class UpdateWhatsappOficialDto extends PartialType(CreateWhatsappOficialDto) {}
