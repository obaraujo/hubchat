module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("MessageApis", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ticketId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      whatsappId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      contactId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      bodyBase64: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      queueId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      sendSignature: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      closeTicket: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      base64: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      schedule: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      isSending: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      originalName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      encoding: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mimeType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      destination: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      filename: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      buffer: {
        type: Sequelize.BLOB,
        allowNull: true,
      },
      mediaType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mediaUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("MessageApis");
  },
};