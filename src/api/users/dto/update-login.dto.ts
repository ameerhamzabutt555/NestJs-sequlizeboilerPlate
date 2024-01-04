import { LoginDto } from './login.dto';
import { PartialType } from '@nestjs/swagger';

/**
 * Data transfer object (DTO) for update login.
 */
export class UpdateLoginDto extends PartialType(LoginDto) {}
