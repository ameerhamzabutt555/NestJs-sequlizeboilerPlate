import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base.service';
import { Profile } from 'src/entities';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class ProfileService extends BaseService {
  constructor(private readonly otp: OtpService) {
    super(Profile);
  }

  /**
   * Get the full name of a user by their user ID.
   * @param id - User ID.
   * @returns The full name of the user.
   * @throws HttpException with status 404 if the user is not found.
   */
  async getUserFullNameByUserId(id: number) {
    const user = await this.findOne({ userId: id });
    if (!user) throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    return user.firstName + ' ' + user.lastName;
  }
}
