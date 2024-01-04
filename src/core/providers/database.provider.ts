import { Sequelize } from 'sequelize-typescript';
import entities from 'src/entities'; // Import the entity models
import { ConfigService } from '@nestjs/config';
import { Op } from 'sequelize';

// Define custom operators for Sequelize
const operatorsAliases = {
  $substring: Op.substring,
  $iLike: Op.iLike,
  $or: Op.or,
  $in: Op.in,
  $notIn: Op.notIn,
  $gt: Op.gt,
  $gte: Op.gte,
  $lt: Op.lt,
  $lte: Op.lte,
  $eq: Op.eq,
  $between: Op.between
};

// Define a provider for the Sequelize database connection
export const databaseProvider = [
  {
    provide: 'SEQUELIZE', // Provide token for the Sequelize instance
    inject: [ConfigService], // Inject the ConfigService for configuration
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: 'postgres', // Specify the database dialect (PostgreSQL in this case)
        username: configService.get('DB_USER'), // Get database username from configuration
        password: configService.get('DB_PASSWORD'), // Get database password from configuration
        host: configService.get('DB_HOST'), // Get database host from configuration
        port: configService.get('DB_PORT'), // Get database port from configuration
        database: configService.get('DB'), // Get database name from configuration
        operatorsAliases, // Apply custom operators to Sequelize
        hooks: {
          // Define hooks for before upsert (create or update)
          beforeUpsert(value, options) {
            if (options['isNewRecord']) {
              // Set 'createdBy' if it's a new record
              value['createdBy'] = options['userId'];
            } else {
              // Set 'updatedBy' if it's an existing record being updated
              value['updatedBy'] = options['userId'];
            }
          }
        }
      });

      // Add the entity models to Sequelize
      sequelize.addModels(entities);

      // Note: Commented out the sequelize.sync() to avoid automatic syncing using models.

      return sequelize; // Return the configured Sequelize instance
    }
  }
];
