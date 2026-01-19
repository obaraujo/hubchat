import User from "../../models/User";
import Contact from "../../models/Contact";
import BirthdaySettings from "../../models/BirthdaySettings";
import Announcement from "../../models/Announcement";
import Company from "../../models/Company";
import Whatsapp from "../../models/Whatsapp";
import { getIO, emitBirthdayEvents } from "../../libs/socket";
import SendWhatsAppMessage from "../WbotServices/SendWhatsAppMessage";
import ShowTicketService from "../TicketServices/ShowTicketService";
import FindOrCreateTicketService from "../TicketServices/FindOrCreateTicketService";
import logger from "../../utils/logger";
import GetDefaultWhatsApp from "../../helpers/GetDefaultWhatsApp";
import { Op } from "sequelize";
import moment from "moment-timezone";
import { redisClient } from "../../libs/redisClient";
import CreateMessageService from "../MessageServices/CreateMessageService";

interface BirthdayPerson {
  id: number;
  name: string;
  type: 'user' | 'contact';
  age: number | null;
  birthDate: Date;
  companyId: number;
  whatsappId?: number;
  contactNumber?: string;
  messageSent?: boolean; // Flag para indicar se mensagem já foi enviada
}

interface BirthdayData {
  users: BirthdayPerson[];
  contacts: BirthdayPerson[];
  settings: BirthdaySettings;
}

export class BirthdayService {
  
  /**
   * Verifica se a mensagem de aniversário já foi enviada para um contato hoje
   */
  static async isMessageSentToday(contactId: number, companyId: number): Promise<boolean> {
    const todayKey = moment().tz("America/Sao_Paulo").format("YYYYMMDD");
    const dedupKey = `birthday:sent:${companyId}:${contactId}:${todayKey}`;
    
    try {
      const exists = await redisClient.get(dedupKey);
      return exists !== null;
    } catch (error) {
      logger.error(`🎂 Error checking if message was sent for contact ${contactId}:`, error);
      return false;
    }
  }
  
  /**
   * Busca todos os aniversariantes do dia de uma empresa
   */
  static async getTodayBirthdaysForCompany(companyId: number): Promise<BirthdayData> {
    // Buscar configurações da empresa
    const settings = await BirthdaySettings.getCompanySettings(companyId);
    
    // Usar moment com timezone brasileiro
    const today = moment().tz("America/Sao_Paulo");
    const month = today.month() + 1; // moment month começa em 0
    const day = today.date();

    logger.info(`🎂 [DEBUG] Buscando aniversariantes: Data de hoje = ${today.format('DD/MM/YYYY')}, Mês = ${month}, Dia = ${day}`);

    // Buscar usuários aniversariantes
    let users: BirthdayPerson[] = [];
    if (settings.userBirthdayEnabled) {
      const allUsers = await User.findAll({
        where: {
          companyId,
          birthDate: {
            [Op.ne]: null
          }
        },
        raw: true
      });

      logger.info(`🎂 [DEBUG] Total de usuários com birthDate na empresa ${companyId}: ${allUsers.length}`);
      
      // Debug: mostrar todas as datas de nascimento
      allUsers.forEach(user => {
        const userBirthDate = moment(user.birthDate).tz("America/Sao_Paulo");
        logger.info(`🎂 [DEBUG] Usuário ${user.name} (ID: ${user.id}) - birthDate: ${user.birthDate} - Formatado: ${userBirthDate.format('DD/MM/YYYY')}`);
      });

      // Filtrar aniversariantes de hoje
      const todayBirthdays = allUsers.filter(user => {
        if (!user.birthDate) return false;
        
        // Usar moment para comparação consistente
        const birthDate = moment(user.birthDate).tz("America/Sao_Paulo");
        const birthMonth = birthDate.month() + 1;
        const birthDay = birthDate.date();
        
        const isToday = birthMonth === month && birthDay === day;
        
        if (isToday) {
          logger.info(`🎂 [MATCH] Usuário ${user.name} faz aniversário hoje! Nascimento: ${birthDate.format('DD/MM/YYYY')}`);
        }
        
        return isToday;
      });

      logger.info(`🎂 [DEBUG] Usuários aniversariantes hoje: ${todayBirthdays.length}`);

      users = todayBirthdays.map(user => {
        const birthDate = moment(user.birthDate).tz("America/Sao_Paulo");
        const age = today.year() - birthDate.year();
        
        return {
          id: user.id,
          name: user.name,
          type: 'user' as const,
          age: age,
          birthDate: user.birthDate,
          companyId: user.companyId
        };
      });
    }

    // Buscar contatos aniversariantes
    let contacts: BirthdayPerson[] = [];
    if (settings.contactBirthdayEnabled) {
      const allContacts = await Contact.findAll({
        where: {
          companyId,
          active: true,
          birthDate: {
            [Op.ne]: null
          }
        },
        include: ['whatsapp'],
        raw: false
      });

      logger.info(`🎂 [DEBUG] Total de contatos com birthDate na empresa ${companyId}: ${allContacts.length}`);

      // Debug: mostrar todas as datas de nascimento
      allContacts.forEach(contact => {
        const contactBirthDate = moment(contact.birthDate).tz("America/Sao_Paulo");
        logger.info(`🎂 [DEBUG] Contato ${contact.name} (ID: ${contact.id}) - birthDate: ${contact.birthDate} - Formatado: ${contactBirthDate.format('DD/MM/YYYY')}`);
      });

      // Filtrar aniversariantes de hoje
      const todayBirthdays = allContacts.filter(contact => {
        if (!contact.birthDate) return false;
        
        // Usar moment para comparação consistente
        const birthDate = moment(contact.birthDate).tz("America/Sao_Paulo");
        const birthMonth = birthDate.month() + 1;
        const birthDay = birthDate.date();
        
        const isToday = birthMonth === month && birthDay === day;
        
        if (isToday) {
          logger.info(`🎂 [MATCH] Contato ${contact.name} faz aniversário hoje! Nascimento: ${birthDate.format('DD/MM/YYYY')}`);
        }
        
        return isToday;
      });

      logger.info(`🎂 [DEBUG] Contatos aniversariantes hoje: ${todayBirthdays.length}`);

      // Mapear contatos e verificar se mensagem já foi enviada
      contacts = await Promise.all(
        todayBirthdays.map(async (contact) => {
          const birthDate = moment(contact.birthDate).tz("America/Sao_Paulo");
          const age = today.year() - birthDate.year();
          
          // Verificar se mensagem já foi enviada hoje
          const messageSent = await this.isMessageSentToday(contact.id, companyId);
          
          return {
            id: contact.id,
            name: contact.name,
            type: 'contact' as const,
            age: age,
            birthDate: contact.birthDate,
            companyId: contact.companyId,
            whatsappId: contact.whatsappId,
            contactNumber: contact.number,
            messageSent
          };
        })
      );
    }

    logger.info(`🎂 [RESULTADO] Empresa ${companyId}: ${users.length} usuários e ${contacts.length} contatos aniversariantes hoje`);

    return {
      users,
      contacts,
      settings
    };
  }

  /**
   * Busca aniversariantes de todas as empresas
   */
  static async getAllTodayBirthdays(): Promise<{ [companyId: number]: BirthdayData }> {
    const companies = await Company.findAll({
      where: { status: true },
      attributes: ['id']
    });

    const result: { [companyId: number]: BirthdayData } = {};

    for (const company of companies) {
      const birthdayData = await this.getTodayBirthdaysForCompany(company.id);
      if (birthdayData.users.length > 0 || birthdayData.contacts.length > 0) {
        result[company.id] = birthdayData;
      }
    }

    return result;
  }

  /**
   * Envia mensagem de aniversário para um contato
   */
  static async sendBirthdayMessageToContact(
    contactId: number, 
    companyId: number,
    customMessage?: string
  ): Promise<boolean> {
    try {
      // Deduplicação: evita envio duplicado no mesmo dia por contato/empresa
      const todayKey = moment().tz("America/Sao_Paulo").format("YYYYMMDD");
      const dedupKey = `birthday:sent:${companyId}:${contactId}:${todayKey}`;
      const wasSet = await redisClient.set(dedupKey, "1", "EX", 60 * 60 * 48, "NX");
      if (wasSet === null) {
        logger.info(`🎂 [DEDUP] Mensagem de aniversário já enviada hoje para contactId=${contactId}, companyId=${companyId}`);
        throw new Error("MESSAGE_ALREADY_SENT");
      }

      const contact = await Contact.findOne({
        where: { id: contactId, companyId },
        include: ['whatsapp']
      });

      if (!contact) {
        logger.warn(`Contact ${contactId} not found`);
        return false;
      }

      // Buscar configurações da empresa
      const settings = await BirthdaySettings.getCompanySettings(companyId);

      // Usar conexão WhatsApp específica das configurações ou fallback para padrão
      let whatsapp;
      if (settings.whatsappId && settings.whatsappId !== null) {
        whatsapp = await Whatsapp.findOne({
          where: { id: settings.whatsappId, companyId, status: "CONNECTED" }
        });
        if (!whatsapp) {
          logger.warn(`WhatsApp connection ${settings.whatsappId} not found or not connected, using default`);
          whatsapp = await GetDefaultWhatsApp(companyId);
        }
      } else {
        whatsapp = await GetDefaultWhatsApp(companyId);
      }

      if (!whatsapp) {
        logger.warn(`No WhatsApp connection found for company ${companyId}`);
        return false;
      }
      
      // Usar mensagem personalizada ou padrão
      let message = customMessage || settings.contactBirthdayMessage;
      
      // Substituir placeholders
      message = message.replace(/{nome}/g, contact.name);
      if (contact.currentAge) {
        message = message.replace(/{idade}/g, contact.currentAge.toString());
      }

      // Criar ou buscar ticket para o contato
      const ticket = await FindOrCreateTicketService(
        contact,
        whatsapp,
        0,
        companyId,
        null,
        null,
        null,
        whatsapp.channel,
        null,
        false,
        settings,
        false,
        false
      );

      // Enviar mensagem
      const sentMessage = await SendWhatsAppMessage({
        body: `\u200e ${message}`,
        ticket
      });

      // Garantir registro da mensagem no ticket (persistência no FE)
      try {
        const wid = (sentMessage as any)?.key?.id as string;
        if (wid) {
          await CreateMessageService({
            companyId,
            messageData: {
              wid,
              ticketId: ticket.id,
              contactId: contact.id,
              body: message,
              fromMe: true,
              read: true,
              channel: whatsapp.channel
            }
          });
        } else {
          logger.warn(`🎂 [WARN] Wid ausente ao enviar mensagem de aniversário para contactId=${contactId}`);
        }
      } catch (persistErr) {
        logger.error(`🎂 [ERROR] Falha ao persistir mensagem de aniversário contactId=${contactId}:`, persistErr);
      }

      logger.info(`🎂 Birthday message sent to contact ${contact.name} (${contact.id})`);
      return true;

    } catch (error) {
      logger.error(`🎂 Error sending birthday message to contact ${contactId}:`, error);
      return false;
    }
  }

  /**
   * Cria informativo de aniversário para usuário
   */
  static async createUserBirthdayAnnouncement(
    user: User, 
    settings: BirthdaySettings
  ): Promise<void> {
    if (!settings.createAnnouncementForUsers) return;

    try {
      // Criar informativo para a empresa do usuário
      const announcement = await Announcement.createBirthdayAnnouncement(
        1, // Company ID 1 (sistema) cria o informativo
        user.companyId, // Mas é direcionado para a empresa do usuário
        user
      );

      // 🎂 SOCKET CORRIGIDO: Emitir evento de announcement
      try {
        const io = getIO();
        io.of(`/${user.companyId}`).emit("company-announcement", {
          action: "create",
          record: announcement
        });
      } catch (socketError) {
        logger.warn("🎂 Socket not available for announcement emission:", socketError);
      }

      logger.info(`🎂 Birthday announcement created for user ${user.name} (${user.id})`);

    } catch (error) {
      logger.error(`🎂 Error creating birthday announcement for user ${user.id}:`, error);
    }
  }

  /**
   * Processa todos os aniversários do dia
   */
  static async processTodayBirthdays(): Promise<void> {
    const today = new Date();
    logger.info(`🎂 Iniciando processamento de aniversários para ${today.toDateString()}`);

    try {
      const allBirthdays = await this.getAllTodayBirthdays();
      
      logger.info(`🎂 Total de empresas com aniversariantes: ${Object.keys(allBirthdays).length}`);

      for (const [companyId, birthdayData] of Object.entries(allBirthdays)) {
        const companyIdNum = parseInt(companyId);
        const { users, contacts, settings } = birthdayData;

        logger.info(`🎂 Processando empresa ${companyId}: ${users.length} usuários, ${contacts.length} contatos`);

        // Processar aniversários de usuários
        for (const userBirthday of users) {
          const user = await User.findByPk(userBirthday.id);
          if (user) {
            await this.createUserBirthdayAnnouncement(user, settings);
            logger.info(`🎉 Processado aniversário do usuário: ${user.name}`);
          }
        }

        // Processar aniversários de contatos (envio automático se habilitado)
        for (const contactBirthday of contacts) {
          if (settings.contactBirthdayEnabled) {
            await this.sendBirthdayMessageToContact(
              contactBirthday.id,
              companyIdNum
            );
          }
          logger.info(`🎉 Processado aniversário do contato: ${contactBirthday.name}`);
        }

        // 🎂 SOCKET CORRIGIDO: Emitir eventos via socket usando função específica
        try {
          await emitBirthdayEvents(companyIdNum);
        } catch (socketError) {
          logger.warn("🎂 Socket not available for birthday events:", socketError);
        }
      }

      // Limpar informativos expirados
      try {
        const { default: Announcement } = await import("../../models/Announcement");
        const cleanedCount = await Announcement.cleanExpiredAnnouncements();
        if (cleanedCount > 0) {
          logger.info(`🗑️ Cleaned ${cleanedCount} expired announcements`);
        }
      } catch (error) {
        logger.error("🎂 Error cleaning expired announcements:", error);
      }

      logger.info('🎂 Processamento de aniversários concluído com sucesso');

    } catch (error) {
      logger.error('❌ Erro no processamento de aniversários:', error);
    }
  }

  /**
   * 🎂 NOVO: Emitir eventos de aniversário para uma empresa via socket
   */
  static async emitBirthdayEventsForCompany(companyId: number): Promise<void> {
    try {
      await emitBirthdayEvents(companyId);
    } catch (error) {
      logger.error(`🎂 Error emitting birthday events for company ${companyId}:`, error);
    }
  }

  /**
   * Atualiza configurações de aniversário de uma empresa
   */
  static async updateBirthdaySettings(
    companyId: number, 
    settingsData: Partial<BirthdaySettings>
  ): Promise<BirthdaySettings> {
    let settings = await BirthdaySettings.findOne({
      where: { companyId }
    });

    if (!settings) {
      settings = await BirthdaySettings.create({
        companyId,
        ...settingsData
      });
    } else {
      await settings.update(settingsData);
    }

    return settings;
  }

  /**
   * Busca configurações de aniversário de uma empresa
   */
  static async getBirthdaySettings(companyId: number): Promise<BirthdaySettings> {
    return BirthdaySettings.getCompanySettings(companyId);
  }
}

export default BirthdayService;