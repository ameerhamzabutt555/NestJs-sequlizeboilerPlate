import { Global } from '@nestjs/common';

/**
 * Re-exports various types and enums used as constants.
 */
export * from './role-type';
export * from './token-type';
export * from './response.types';
export * from './gender-type';
export * from './email-send-type';

/**
 * This class serves as a container for various constants and types.
 * It is marked as a Global module so that it's available throughout the application.
 */
@Global()
export default class Constants {}
