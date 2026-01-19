import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Tags", "mediaFiles", {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "JSON array with media files information"
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Tags", "mediaFiles");
  },
};
