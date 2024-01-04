'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_user', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true
      },
      user_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      role: {
        type: Sequelize.ENUM('SUPER_ADMIN', 'ADMIN', 'USER'),
        allowNull: true
      },
      password: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING,
        unique: true
      },
      is_email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_phone_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      login_type: {
        type: Sequelize.STRING,
        defaultValue: null
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_user');
  }
};
