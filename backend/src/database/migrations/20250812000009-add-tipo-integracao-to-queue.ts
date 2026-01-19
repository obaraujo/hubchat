import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.addColumn("Queues", "tipoIntegracao", {
            type: DataTypes.STRING,
            defaultValue: null
        });
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.removeColumn("Queues", "tipoIntegracao");
    }
};
