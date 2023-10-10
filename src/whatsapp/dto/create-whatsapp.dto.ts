import { IsNotEmpty } from 'class-validator';

export class CreateWhatsappDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  message: string;
}
