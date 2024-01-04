/**
 * Enum representing different types of authentication tokens.
 */
export enum TokenType {
  /**
   * Represents an access token, used for authorizing and accessing protected resources.
   */
  ACCESS_TOKEN = 'ACCESS_TOKEN',

  /**
   * Represents a refresh token, used for obtaining new access tokens without the need for reauthentication.
   */
  REFRESH_TOKEN = 'REFRESH_TOKEN'
}
