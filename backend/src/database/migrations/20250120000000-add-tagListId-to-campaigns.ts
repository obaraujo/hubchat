import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addColumn("Campaigns", "tagListId", {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "ID da tag para seleção de contatos"
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeColumn("Campaigns", "tagListId");
  }
};