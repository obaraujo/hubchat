import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.changeColumn("Whatsapps", "send_token", {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.changeColumn("Whatsapps", "send_token", {
      type: DataTypes.STRING,
      allowNull: true,
    });
  }
};

