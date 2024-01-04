import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './api/auth/auth.module';
import { EmailModule } from './api/email/email.module';
import { ProfileModule } from './api/profile/profile.module';
import { UsersModule } from './api/users/users.module';
import { DatabaseModule } from './core/providers/database.module';

// This is a Nest.js module that defines the root of your application.
@Module({
  imports: [
    // ConfigModule is used to load configuration variables.
    // The `isGlobal` option ensures that the configuration is available globally.
    ConfigModule.forRoot({ isGlobal: true }),

    // DatabaseModule is a custom module that handles database connections.
    DatabaseModule,

    // UsersModule, EmailModule, AuthModule, and ProfileModule are feature modules
    // that encapsulate related functionality. These modules will be used
    // to organize and structure your application.
    UsersModule,
    EmailModule,
    AuthModule,
    ProfileModule
  ]
})
export class AppModule {}
