import { SetMetadata } from '@nestjs/common';

// Define a constant variable to store the metadata key for public routes.
export const IS_PUBLIC_KEY = 'isPublic';

// The `Public` decorator is used to set metadata to mark a route as public.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
