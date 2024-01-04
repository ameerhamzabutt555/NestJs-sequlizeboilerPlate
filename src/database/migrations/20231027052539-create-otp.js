'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_otp', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      phone: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        references: {
          model: 'tbl_user', // The name of the referenced table
          key: 'phone' // The name of the referenced column
        }
      },
      otp: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      otpExpiration: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'otp_expiration'
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
    await queryInterface.dropTable('tbl_otp');
  }
};
