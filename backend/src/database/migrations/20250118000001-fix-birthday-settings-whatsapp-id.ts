// src/database/migrations/20250118000001-fix-birthday-settings-whatsapp-id.ts
import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    // Verificar se a tabela BirthdaySettings existe (case-insensitive)
    let tableExists;
    try {
      tableExists = await queryInterface.describeTable('BirthdaySettings');
    } catch (error) {
      // Se falhar, tentar com diferentes casos
      try {
        tableExists = await queryInterface.describeTable('birthdaysettings');
      } catch (error2) {
        try {
          tableExists = await queryInterface.describeTable('birthday_settings');
        } catch (error3) {
          tableExists = null;
        }
      }
    }
    
    if (!tableExists) {
      console.log('Tabela BirthdaySettings não existe. Criando...');
      
      // Criar a tabela completa se não existir
      await queryInterface.createTable('BirthdaySettings', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        companyId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Companies',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        userBirthdayEnabled: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          comment: 'Habilitar notificações de aniversário de usuários'
        },
        contactBirthdayEnabled: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          comment: 'Habilitar envio automático de mensagens de aniversário para contatos'
        },
        userBirthdayMessage: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: '🎉 Parabéns, {nome}! Hoje é seu dia especial! Desejamos muito sucesso e felicidade! ',
          comment: 'Mensagem de aniversário para usuários (interno)'
        },
        contactBirthdayMessage: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: '🎉 Parabéns, {nome}! Hoje é seu aniversário! Desejamos muito sucesso, saúde e felicidade! ✨',
          comment: 'Mensagem de aniversário para contatos (WhatsApp)'
        },
        sendBirthdayTime: {
          type: DataTypes.TIME,
          allowNull: false,
          defaultValue: '09:00:00',
          comment: 'Horário para envio das mensagens de aniversário'
        },
        createAnnouncementForUsers: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          comment: 'Criar informativo quando usuário faz aniversário'
        },
        whatsappId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'Whatsapps',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          comment: 'ID da conexão WhatsApp para envio de mensagens de aniversário'
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        }
      });

      // Índices - verificar se já existe antes de criar
      try {
        await queryInterface.addIndex('BirthdaySettings', ['companyId'], {
          unique: true,
          name: 'idx_birthday_settings_company_id'
        });
        console.log('✅ Índice idx_birthday_settings_company_id criado com sucesso!');
      } catch (error) {
        if (error.message && error.message.includes('already exists')) {
          console.log('✅ Índice idx_birthday_settings_company_id já existe.');
        } else {
          throw error;
        }
      }

      // Inserir configurações padrão para todas as empresas existentes
      await queryInterface.sequelize.query(`
        INSERT INTO "BirthdaySettings" ("companyId", "userBirthdayEnabled", "contactBirthdayEnabled", "userBirthdayMessage", "contactBirthdayMessage", "sendBirthdayTime", "createAnnouncementForUsers", "whatsappId", "createdAt", "updatedAt")
        SELECT
          id as "companyId",
          true as "userBirthdayEnabled",
          true as "contactBirthdayEnabled",
          '🎉 Parabéns, {nome}! Hoje é seu dia especial! Desejamos muito sucesso e felicidade! ' as "userBirthdayMessage",
          '🎉 Parabéns, {nome}! Hoje é seu aniversário! Desejamos muito sucesso, saúde e felicidade! ✨' as "contactBirthdayMessage",
          '09:00:00' as "sendBirthdayTime",
          true as "createAnnouncementForUsers",
          NULL as "whatsappId",
          NOW() as "createdAt",
          NOW() as "updatedAt"
        FROM "Companies"
        WHERE NOT EXISTS (
          SELECT 1 FROM "BirthdaySettings" WHERE "companyId" = "Companies".id
        )
      `);
      
    } else {
      // Tabela existe, verificar se a coluna whatsappId existe
      const hasWhatsappId = 'whatsappId' in tableExists;
      if (!hasWhatsappId) {
        console.log('Coluna whatsappId não existe. Adicionando...');
        
        // Determinar o nome correto da tabela
        let tableName = 'BirthdaySettings';
        try {
          await queryInterface.describeTable('BirthdaySettings');
        } catch (error) {
          try {
            await queryInterface.describeTable('birthdaysettings');
            tableName = 'birthdaysettings';
          } catch (error2) {
            tableName = 'birthday_settings';
          }
        }
        
        await queryInterface.addColumn(tableName, 'whatsappId', {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'Whatsapps',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          comment: 'ID da conexão WhatsApp para envio de mensagens de aniversário'
        });
      }
    }
  },

  down: async (queryInterface: QueryInterface) => {
    // Verificar se a coluna existe antes de tentar removê-la (case-insensitive)
    let tableExists;
    let tableName = 'BirthdaySettings';
    
    try {
      tableExists = await queryInterface.describeTable('BirthdaySettings');
    } catch (error) {
      try {
        tableExists = await queryInterface.describeTable('birthdaysettings');
        tableName = 'birthdaysettings';
      } catch (error2) {
        try {
          tableExists = await queryInterface.describeTable('birthday_settings');
          tableName = 'birthday_settings';
        } catch (error3) {
          tableExists = null;
        }
      }
    }
    
    const hasWhatsappId = tableExists && 'whatsappId' in tableExists;
    if (hasWhatsappId) {
      await queryInterface.removeColumn(tableName, 'whatsappId');
    }
    
    // Remover índice se existir
    try {
      await queryInterface.removeIndex(tableName, 'idx_birthday_settings_company_id');
    } catch (error) {
      // Índice pode não existir, ignorar erro
      console.log('Índice idx_birthday_settings_company_id não encontrado para remoção.');
    }
  }
};
