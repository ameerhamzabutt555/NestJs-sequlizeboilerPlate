'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_profile', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      last_name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      country: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      user_id: {
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
    await queryInterface.dropTable('tbl_profile');
  }
};
