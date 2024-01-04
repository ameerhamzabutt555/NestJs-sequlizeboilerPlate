import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseProvider } from './database.provider';

// Define a module for the database-related functionality
@Module({
  imports: [ConfigModule], // Import the ConfigModule to load environment configuration
  providers: [...databaseProvider], // Provide the database-related providers
  exports: [...databaseProvider] // Export the database-related providers for use in other modules
})
export class DatabaseModule {}
