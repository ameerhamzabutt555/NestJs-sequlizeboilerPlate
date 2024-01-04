import { Injectable, Global } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  INestedArrayObjectKeys,
  INestedObjectKeys,
  IRemoveKeysFromObject
} from 'src/interface/IRemoveKeysFromObject';
import * as Twilio from 'twilio';

/**
 * Injectable and global utility service that provides various helper methods.
 */
@Injectable()
@Global()
export class UtilitiesService {
  private readonly jwt: JwtService;
  constructor(jwt: JwtService) {
    this.jwt = jwt;
  }

  /**
   * Logs and displays the provided arguments to the console.
   * @param args - Arguments to be logged to the console.
   */
  public checkMediaType = (args) => {
    console.log('args:', args);
  };

  /**
   * Decodes a JWT token and returns the decoded payload.
   * @param token - JWT token to decode.
   * @returns Promise that resolves to the decoded payload.
   */
  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token, null);
  }

  /**
   * Generates a JWT token for a user with the specified payload.
   * @param user - User object for whom the token is generated.
   * @returns Generated JWT token as a string.
   */
  public generateToken(user): string {
    return this.jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        time: new Date().toUTCString(),
        expiry: 86400000
      },
      { secret: process.env.JWT_SECRET_KEY }
    );
  }
  /**
   * Decodes and verifies a JWT token.
   * @param token - JWT token to decode and verify.
   * @returns A promise that resolves to the decoded token or null if the token is invalid.
   */
  public async decodeToken(token: string): Promise<any> {
    const verifyToken = await this.jwt?.verifyAsync(token, {
      secret: process.env.JWT_SECRET_KEY
    });
    return verifyToken;
  }
  /**
   * Extracts the token from the authorization header of a request.
   * @param req - The request object.
   * @returns The extracted token as a string.
   */
  public async abstractToken(req: any): Promise<any> {
    const currentToken = await req.header('authorization');
    const token: string = currentToken.split('Bearer ')[1];
    return token;
  }

  /**
   * Validates if the provided password matches the user's stored password hash.
   * @param password - The input password to validate.
   * @param userPassword - The stored password hash to compare against.
   * @returns True if the passwords match, false otherwise.
   */
  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  /**
   * Validates if the provided OTP matches the user's stored OTP hash.
   * @param Otp - The input OTP to validate.
   * @param userOtp - The stored OTP hash to compare against.
   * @returns True if the OTPs match, false otherwise.
   */
  public isOtpValid(Otp: string, userOtp: string): boolean {
    return bcrypt.compareSync(Otp, userOtp);
  }
  /**
   * Generates a random password of a specified length.
   * @returns A randomly generated password.
   */
  public generatePassword() {
    const length = 8;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }
  /**
   * Adds a specified number of minutes to a given date.
   * @param numOfMinutes - The number of minutes to add.
   * @param date - The date to which minutes should be added (default is the current date).
   * @returns The modified date.
   */
  public addMinutes(numOfMinutes, date = new Date()): Date {
    date.setMinutes(date.getMinutes() + numOfMinutes);
    return date;
  }
  // Encode User's password
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  /**
   * Removes the password property from an array of user objects.
   * @param users - An array of user objects.
   * @returns An array of user objects with the password property removed.
   */
  public excludePassword(users: any[]) {
    const data = [];
    for (const user of users) {
      const { password, ...rest } = user;
      data.push(rest);
    }
    return data;
  }

  /**
   * Encodes an OTP (One-Time Password) using bcrypt hashing with a generated salt.
   * @param otp - The OTP to encode as a string.
   * @returns The encoded OTP as a hashed string.
   */
  public encodeOtp(otp: string): string {
    const salt: string = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(otp, salt);
  }

  /**
   * Paginates a response data set and provides metadata for pagination.
   * @param data - The data to be paginated.
   * @param page - The current page number (optional).
   * @param limit - The number of items per page (optional).
   * @returns An object containing the paginated data and metadata.
   */
  public paginateResponse(data: any, page?: number, limit?: number) {
    const [result, total] = data;
    const totalPages = Math.ceil(total / limit);
    // const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > totalPages ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {
      data: [...result],
      metaInfo: {
        totalRecords: total,
        itemsPerPage: result.length,
        currentPage: page,
        nextPage: nextPage,
        prevPage: prevPage,
        totalPages: totalPages
      }
    };
  }
  /**
   * Removes the password and other sensitive information from a single user object.
   * @param user - The user object to remove sensitive information from.
   * @returns A user object with sensitive information removed.
   */
  public excludeOnlyPwd(user: any) {
    const data = user;
    const { password, isPasswordForgot, otpCode, otpCodeExpiry, isPasswordForgotExpiry, ...rest } =
      data;
    return rest;
  }

  /**
   * Modifies the response by adding status code, message, and body information.
   * @param httpStatusCode - The HTTP status code to include in the response.
   * @param responseMessage - The message to include in the response.
   * @param httpStatus - A boolean indicating the success status of the response.
   * @param resp - The data to include in the response (can be an object or an array of objects).
   * @returns The modified response object with status, message, and data.
   */
  public responseModifier(
    httpStatusCode: number,
    responseMessage: string,
    httpStatus: boolean,
    resp: object | Array<object>
  ) {
    const newResponse = {
      succeeded: httpStatus,
      httpStatusCode: httpStatusCode,
      message: responseMessage,
      data: resp
    };
    return newResponse;
  }

  /**
   * Generates a random OTP (One-Time Password).
   * @returns A random OTP as a number.
   */
  public generateOtp() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  /**
   * Generates a future date by adding a specified time duration to the current date.
   * @param time - The time duration to add in milliseconds.
   * @returns The future date.
   */
  public generateFutureDate(time) {
    return new Date(new Date().getTime() + time);
  }

  /**
   * Sends an OTP (One-Time Password) via Twilio SMS to a phone number.
   * @param phoneNumber - The recipient's phone number.
   * @param otp - The OTP to send.
   * @returns A string indicating that the OTP has been sent.
   */
  public async sendOtp(phoneNumber, otp) {
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = Twilio(accountSid, authToken);
    await client.messages.create({
      body: `Your OTP for account verification is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    return 'Otp sent';
  }

  /**
   * Generates a random code of a specified length using a set of characters.
   * @param length - The length of the generated code (default is 6).
   * @returns The randomly generated code.
   */
  public generateRandomCode(length = 6) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&(*)_-+0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   * Removes specified keys from an object, including nested object and array properties.
   * @param params - An object specifying the object, keys, nested object keys, and nested array object keys to remove.
   * @returns The object with specified keys removed.
   */
  excludeKeysFromObject({
    obj,
    keys,
    nestedObjectKeys,
    nestedArrayObjectKeys
  }: IRemoveKeysFromObject) {
    keys.forEach((key: string) => {
      if (obj) delete obj[key];
    });

    if (nestedObjectKeys?.length) {
      nestedObjectKeys.forEach(async (object: INestedObjectKeys) => {
        const key = Object.keys(object)[0];
        obj[key] = await this.excludeKeysFromObject({ obj: { ...obj[key] }, keys: object[key] });
      });
    }

    if (nestedArrayObjectKeys?.length) {
      nestedArrayObjectKeys.forEach((object: INestedArrayObjectKeys) => {
        const key = Object.keys(object)[0];
        obj[key] = obj[key]?.map((item: any) => {
          return this.excludeKeysFromObject({ obj: { ...item }, keys: object[key] });
        });
      });
    }

    return obj;
  }

  /**
   * Converts keys from camel case to snake case when they occur after a period and are enclosed in '$' signs.
   * @param condition - The data to transform.
   * @returns The transformed data with keys converted to snake case.
   */
  public camelToSnake(condition: any) {
    if (typeof condition !== 'object' || condition === null) {
      return condition;
    }

    if (Array.isArray(condition)) {
      return condition.map((item) => this.camelToSnake(item));
    }

    const result = {};
    for (const key in condition) {
      if (Object.prototype.hasOwnProperty.call(condition, key)) {
        let newKey = key;
        if (key.includes('.') && key.indexOf('$', 1) !== -1) {
          const parts = key.split('.');
          parts[parts.length - 1] = parts[parts.length - 1]
            .replace(/([a-z])([A-Z])/g, '$1_$2')
            .toLowerCase();
          newKey = parts.join('.');
        }
        result[newKey] = this.camelToSnake(condition[key]);
      }
    }
    return result;
  }
  /**
   * Converts a snake_case string to different cases.
   * @param inputString - The input string in snake_case.
   * @param firstWordLetterCapital - Whether to capitalize the first letter of the first word.
   * @param addSpaceBetween - Whether to add spaces between words.
   * @param allLowerCase - Whether to make all letters lowercase.
   * @returns The converted string in the specified format.
   */
  snakeCaseToDifferentCases(
    inputString: string,
    firstWordLetterCapital = false,
    addSpaceBetween = false,
    allLowerCase = false
  ) {
    // Split the input string by underscores
    const words = inputString.split('_');

    // Capitalize the first letter of each word (except the first one) and join them
    const moldedString = words
      .map((word, index) => {
        if ((index === 0 && !firstWordLetterCapital) || (allLowerCase && index !== 0)) {
          return word.toLowerCase(); // Keep the first word lowercase
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(addSpaceBetween ? ' ' : '');

    return moldedString;
  }
}
