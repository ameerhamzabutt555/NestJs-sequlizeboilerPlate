import { Body, Controller, Get, Param, Patch, Post, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ROLE_TYPE } from 'src/constants';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionAccessGuard } from 'src/guards/permission-access-guard.guard';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';
import { EmailVerifiedGuard } from 'src/guards/email-verified.guard';

@ApiBearerAuth()
@ApiTags('profile')
@Controller('profile')
@UseGuards(JwtAuthGuard, PermissionAccessGuard, EmailVerifiedGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * Create a new user profile.
   * @param createProfileDto - DTO containing profile information.
   * @param req - Request object containing user information.
   * @returns The created profile.
   */
  @Roles(ROLE_TYPE.USER, ROLE_TYPE.ADMIN, ROLE_TYPE.SUPER_ADMIN)
  @Post()
  async create(@Body() createProfileDto: CreateProfileDto, @Req() req: any) {
    const userId = req.user.id;
    return await this.profileService.create({ ...createProfileDto, userId }, userId);
  }

  /**
   * Get a user's profile by ID.
   * @param id - User profile ID.
   * @returns The user's profile.
   */
  @Roles(ROLE_TYPE.USER, ROLE_TYPE.ADMIN, ROLE_TYPE.SUPER_ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.profileService.findOneById(+id);
  }

  /**
   * Update a user's profile by ID.
   * @param id - User profile ID.
   * @param updateProfileDto - DTO containing updated profile information.
   * @returns The updated profile.
   */
  @Roles(ROLE_TYPE.USER, ROLE_TYPE.ADMIN, ROLE_TYPE.SUPER_ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return await this.profileService.update(+id, updateProfileDto);
  }
}
