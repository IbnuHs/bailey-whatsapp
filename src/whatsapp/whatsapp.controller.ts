import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { CreateWhatsappDto } from './dto/create-whatsapp.dto';
import { UpdateWhatsappDto } from './dto/update-whatsapp.dto';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post()
  connectedWhatsapp(@Body() createWhatsappDto: CreateWhatsappDto) {
    return this.whatsappService.connectWhatsapp();
  }

  @Post('sendMessage')
  sendMessage(@Body() createMessageDto: CreateWhatsappDto) {
    return this.whatsappService.sendMsg(createMessageDto);
  }
}
