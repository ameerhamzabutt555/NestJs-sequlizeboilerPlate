import { SetMetadata } from '@nestjs/common';

// Define a constant variable to store the metadata key for roles.
export const ROLES_KEY = 'roles';

// The `Roles` decorator is used to set metadata for roles.
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
