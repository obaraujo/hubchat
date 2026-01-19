import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("CallHistory", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      token_wavoip: {
        type: DataTypes.STRING,
        allowNull: false
      },
      whatsapp_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      contact_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      phone_to: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("CallHistory");
  }
};
