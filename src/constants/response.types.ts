/**
 * Enum containing response status and message for a successful operation.
 */
export const enum SUCCESSFUL_RESPONSE {
  status = 200,
  message = 'Operation successful'
}

/**
 * Enum containing response status and message for an internal server error.
 */
export const enum INTERNAL_SERVER_ERROR_RESPONSE {
  status = 500,
  message = 'Internal server error'
}

/**
 * Enum containing response status and message for a bad request.
 */
export const enum BAD_REQUEST_RESPONSE {
  status = 400,
  message = 'Bad request'
}

/**
 * Enum containing response status and message for a record not found.
 */
export const enum NOT_FOUND_RESPONSE {
  status = 404,
  message = 'Record not found'
}

/**
 * Enum containing response status and message for a user not found.
 */
export const enum USER_NOT_FOUND_RESPONSE {
  status = 404,
  message = 'User not found'
}

/**
 * Enum containing response status and message for a user in the report list.
 */
export const enum PRE_REPORTED_USER_RESPONSE {
  status = 409,
  message = 'User is in the report list'
}

/**
 * Enum containing response status and message for an unauthorized operation.
 */
export const enum UNAUTHORIZED_RESPONSE {
  status = 401,
  message = 'Unauthorized'
}

/**
 * Enum containing response status and message for a forbidden operation.
 */
export const enum FORBIDDEN_RESPONSE {
  status = 403,
  message = 'Operation forbidden'
}

/**
 * Enum containing response status and message for a resource creation operation.
 */
export const enum CREATION_RESPONSE {
  status = 201,
  message = 'Resource created'
}

/**
 * Enum containing response status and message for a record that already exists.
 */
export const enum ALREADY_EXIST_RESPONSE {
  status = 409,
  message = 'Record already exists'
}

/**
 * Enum containing response status and message for a user that already exists.
 */
export const enum USER_ALREADY_EXIST_RESPONSE {
  status = 409,
  message = 'User already exists'
}

/**
 * Enum containing response status and message for an email that already exists.
 */
export const enum EMAIL_ALREADY_EXIST_RESPONSE {
  status = 409,
  message = 'Email already exists'
}

/**
 * Enum containing response status and message for a phone number that already exists.
 */
export const enum PHONE_ALREADY_EXIST_RESPONSE {
  status = 409,
  message = 'Phone number already exists'
}

/**
 * Enum containing response status and message for an unprocessable request.
 */
export const enum UNPROCESSABLE_RESPONSE {
  status = 422,
  message = 'Cannot be processed'
}

/**
 * Enum containing response status and message for a record deletion operation.
 */
export const enum DELETE_RECORD_RESPONSE {
  status = 200,
  message = 'Record deleted successfully'
}
