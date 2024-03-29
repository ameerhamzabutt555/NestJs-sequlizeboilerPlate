import { PartialType } from '@nestjs/swagger';
import { CreateProfileDto } from './create-profile.dto';

/**
 * Data transfer object (DTO) for profile updating.
 */
export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
