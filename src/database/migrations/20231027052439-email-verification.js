'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_email_verification', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accessToken: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        field: 'access_token'
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      tokenExpiration: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'token_expiration'
      },
      isTokenUsed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        field: 'is_token_used'
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tbl_user', // The name of the referenced table
          key: 'id' // The name of the referenced column
        }
      },
      created_by: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true
      },
      updated_by: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });

    // Add any other foreign key constraints or indexes here if needed.
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tbl_email_verification');
  }
};
