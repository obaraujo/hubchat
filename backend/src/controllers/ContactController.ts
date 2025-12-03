import * as Yup from "yup";
import { Request, Response } from "express";
import { getIO } from "../libs/socket";
import { head } from "lodash";

import ListContactsService from "../services/ContactServices/ListContactsService";
import CreateContactService from "../services/ContactServices/CreateContactService";
import ShowContactService from "../services/ContactServices/ShowContactService";
import UpdateContactService from "../services/ContactServices/UpdateContactService";
import DeleteContactService from "../services/ContactServices/DeleteContactService";
import GetContactService from "../services/ContactServices/GetContactService";

import CheckContactNumber from "../services/WbotServices/CheckNumber";
import CheckIsValidContact from "../services/WbotServices/CheckIsValidContact";
import GetProfilePicUrl from "../services/WbotServices/GetProfilePicUrl";
import AppError from "../errors/AppError";
import SimpleListService, {
  SearchContactParams
} from "../services/ContactServices/SimpleListService";
import ContactCustomField from "../models/ContactCustomField";
import ToggleAcceptAudioContactService from "../services/ContactServices/ToggleAcceptAudioContactService";
import BlockUnblockContactService from "../services/ContactServices/BlockUnblockContactService";
import { ImportContactsService } from "../services/ContactServices/ImportContactsService";
import NumberSimpleListService from "../services/ContactServices/NumberSimpleListService";
import CreateOrUpdateContactServiceForImport from "../services/ContactServices/CreateOrUpdateContactServiceForImport";
import UpdateContactWalletsService from "../services/ContactServices/UpdateContactWalletsService";

import FindContactTags from "../services/ContactServices/FindContactTags";
import { log } from "console";
import ToggleDisableBotContactService from "../services/ContactServices/ToggleDisableBotContactService";
import GetDefaultWhatsApp from "../helpers/GetDefaultWhatsApp";
import Contact from "../models/Contact";
import Tag from "../models/Tag";
import ContactTag from "../models/ContactTag";
import logger from "../utils/logger";
import UpdateTicketService from "../services/TicketServices/UpdateTicketService";
import Ticket from "../models/Ticket";
import sequelize from "../database";
import Message from "../models/Message";
import Schedule from "../models/Schedule";
import { Op } from "sequelize";
import { createJid } from "../functionts";
import TicketTraking from "../models/TicketTraking";
import TicketTag from "../models/TicketTag";
import LogTicket from "../models/LogTicket";

type IndexQuery = {
  searchParam: string;
  pageNumber: string;
  contactTag: string;
  isGroup?: string;
};

type IndexGetContactQuery = {
  name: string;
  number: string;
};

interface ExtraInfo extends ContactCustomField {
  name: string;
  value: string;
}
interface ContactData {
  name: string;
  number: string;
  email?: string;
  extraInfo?: ExtraInfo[];
  disableBot?: boolean;
  remoteJid?: string;
  wallets?: null | number[] | string[];
}



export const importXls = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { number, name, email, validateContact, tags } = req.body;
  const simpleNumber = String(number).replace(/[^\d.-]+/g, '');
  let validNumber = simpleNumber;


  if (validateContact === "true") {
    validNumber = await CheckContactNumber(simpleNumber, companyId);
  }
  /**
   * Código desabilitado por demora no retorno
   */
  // 
  // const profilePicUrl = await GetProfilePicUrl(validNumber, companyId);
  // const defaultWhatsapp = await GetDefaultWhatsApp(companyId);

  const contactData = {
    name: `${name}`,
    number: validNumber,
    profilePicUrl: "",
    isGroup: false,
    email,
    companyId,
    // whatsappId: defaultWhatsapp.id
  };

  const contact = await CreateOrUpdateContactServiceForImport(contactData);

  if (tags) {
    const tagList = tags.split(',').map(tag => tag.trim());

    for (const tagName of tagList) {
      try {
        let [tag, created] = await Tag.findOrCreate({
          where: { name: tagName, companyId, color: "#A4CCCC", kanban: 0 }

        });


        // Associate the tag with the contact
        await ContactTag.findOrCreate({
          where: {
            contactId: contact.id,
            tagId: tag.id
          }
        });
      } catch (error) {
        logger.info("Erro ao criar Tags", error)
      }
    }
  }
  const io = getIO();



  io.of(String(companyId))
    .emit(`company-${companyId}-contact`, {
      action: "create",
      contact
    });

  return res.status(200).json(contact);
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { searchParam, pageNumber, contactTag: tagIdsStringified, isGroup } = req.query as IndexQuery;
  const { id: userId, companyId } = req.user;

  let tagsIds: number[] = [];

  if (tagIdsStringified) {
    tagsIds = JSON.parse(tagIdsStringified);
  }

  const { contacts, count, hasMore } = await ListContactsService({
    searchParam,
    pageNumber,
    companyId,
    tagsIds,
    isGroup,
    userId: Number(userId)
  });

  return res.json({ contacts, count, hasMore });
};

export const getContact = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, number } = req.body as IndexGetContactQuery;
  const { companyId } = req.user;

  const contact = await GetContactService({
    name,
    number,
    companyId
  });

  return res.status(200).json(contact);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const newContact: ContactData = req.body;
  const newRemoteJid = newContact.number;

  const findContact = await Contact.findOne({
    where: {
      number: newContact.number.replace("-", "").replace(" ", ""),
      companyId
    }
  })
  if (findContact) {
    throw new AppError("Contact already exists");
  }

  newContact.number = newContact.number.replace("-", "").replace(" ", "");


  const schema = Yup.object().shape({
    name: Yup.string().required(),
    number: Yup.string()
      .required()
      .matches(/^\d+$/, "Invalid number format. Only numbers is allowed.")
  });

  try {
    await schema.validate(newContact);
  } catch (err: any) {
    throw new AppError(err.message);
  }


  const validNumber = await CheckContactNumber(newContact.number, companyId);

  /**
   * Código desabilitado por demora no retorno
   */
  // const profilePicUrl = await GetProfilePicUrl(validNumber.jid, companyId);

  const contact = await CreateContactService({
    ...newContact,
    number: validNumber,
    // profilePicUrl,
    companyId
  });

  const io = getIO();
  io.of(String(companyId))
    .emit(`company-${companyId}-contact`, {
      action: "create",
      contact
    });

  return res.status(200).json(contact);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { contactId } = req.params;
  const { companyId } = req.user;

  const contact = await ShowContactService(contactId, companyId);

  return res.status(200).json(contact);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const contactData: ContactData = req.body;
  const { companyId } = req.user;
  const { contactId } = req.params;

  const schema = Yup.object().shape({
    name: Yup.string(),
    number: Yup.string().matches(
      /^\d+$/,
      "Invalid number format. Only numbers is allowed."
    )
  });

  try {
    await schema.validate(contactData);
  } catch (err: any) {
    throw new AppError(err.message);
  }

  const oldContact = await ShowContactService(contactId, companyId);

  if (oldContact.number != contactData.number && oldContact.channel == "whatsapp") {
    const isGroup = oldContact && oldContact.remoteJid ? oldContact.remoteJid.endsWith("@g.us") : oldContact.isGroup;
    const validNumber = await CheckContactNumber(contactData.number, companyId, isGroup);
    const number = validNumber;
    contactData.number = number;
  }

	let contact;
	
	if (contactData.number){
		const duplicate = await Contact.findOne({
			where: {
				number: contactData.number.replace("-", "").replace(" ", ""),
				companyId
			}
		})


    if (duplicate&&duplicate.id.toString()!==contactId.toString()) {
      // Temos um par: contact e duplicate.
      // Precisamos decidir quem sobrevive. 
      // Critério: Quem tem mais Tickets associados ou quem é mais recente com o 9?
      // Pela lógica de padronização, preferimos manter o número COM O 9 (formato atual) ou o que já tiver mais dados.
      
      let master: Contact;
      let slave: Contact;

   
        master = duplicate;
        slave = oldContact;
      

      console.log(`Unificando: Master ${master.number} (ID: ${master.id}) <- Slave ${slave.number} (ID: ${slave.id})`);

      // Transaction para garantir atomicidade
      const t = await sequelize.transaction();

      try {
				// Pega o ticket do usuário master
        const ticketMaster = await Ticket.findOne({ where:{contactId: master.id }, order:[['id','DESC']], transaction:t});
        const ticketSlave = await Ticket.findOne({ where:{contactId: slave.id }, order:[['id','DESC']], transaction:t});
        
        await Message.update({ contactId: master.id , tickedId: ticketMaster.id}, { where: { contactId: slave.id,companyId }, transaction: t });
				await TicketTraking.update({tickedId: ticketMaster.id},{where:{ticketId: ticketSlave.id}, transaction: t})
				await TicketTag.update({tickedId: ticketMaster.id},{where:{ticketId: ticketSlave.id}, transaction: t})
				await LogTicket.update({tickedId: ticketMaster.id},{where:{ticketId: ticketSlave.id}, transaction: t})
				// 1. Atualizar Tickets
        // await Ticket.update({ contactId: master.id }, { where: { contactId: slave.id, companyId}, transaction: t });

        // 2. Atualizar Mensagens (se houver associação direta em sua versão do banco)

        // 3. Atualizar Agendamentos
        await Schedule.update({ contactId: master.id }, { where: { contactId: slave.id,companyId }, transaction: t });

        // 4. Migrar Campos Personalizados (Custom Fields)
        // Aqui é delicado para não duplicar chave única, então fazemos um findOrCreate ou update ignorando erros se já existir
        const slaveFields = await ContactCustomField.findAll({ where: { contactId: slave.id } });
        for (const field of slaveFields) {
           const exists = await ContactCustomField.findOne({ where: { contactId: master.id, name: field.name } });
           if (!exists) {
             await field.update({ contactId: master.id }, { transaction: t });
           } else {
             // Se já existe no master, deletamos o do slave para não dar erro
             await field.destroy({ transaction: t });
           }
        }

        // 5. Migrar Tags
        const slaveTags = await ContactTag.findAll({ where: { contactId: slave.id } });
        for (const tagRel of slaveTags) {
          const exists = await ContactTag.findOne({ where: { contactId: master.id, tagId: tagRel.tagId } });
          if (!exists) {
            await tagRel.update({ contactId: master.id }, { transaction: t });
          } else {
             await tagRel.destroy({ transaction: t });
          }
        }

        // 6. Finalmente, deletar o contato duplicado (slave)
        await slave.destroy({ transaction: t });
				await Ticket.destroy({
					where: { contactId: slave.id },
					transaction: t
				});
				
				await master.update({...contactData, remoteJid: createJid(oldContact.number)}, { transaction: t })

        await t.commit();

      } catch (error) {
        await t.rollback();
        console.error(`Erro ao unificar contatos ${master.id} e ${slave.id}:`, error);
      }
			
	
		}

	}else {
		   contact = await UpdateContactService({
    contactData,
    contactId,
    companyId
  });
	}



  const io = getIO();
  io.of(String(companyId))
    .emit(`company-${companyId}-contact`, {
      action: "update",
      contact
    });

  return res.status(200).json(contact);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { contactId } = req.params;
  const { companyId } = req.user;

  await ShowContactService(contactId, companyId);

  await DeleteContactService(contactId);

  const io = getIO();
  io.of(String(companyId))
    .emit(`company-${companyId}-contact`, {
      action: "delete",
      contactId
    });

  return res.status(200).json({ message: "Contact deleted" });
};

export const list = async (req: Request, res: Response): Promise<Response> => {
  const { name } = req.query as unknown as SearchContactParams;
  const { companyId } = req.user;

  const contacts = await SimpleListService({ name, companyId });

  return res.json(contacts);
};

export const toggleAcceptAudio = async (
  req: Request,
  res: Response
): Promise<Response> => {
  var { contactId } = req.params;
  const { companyId } = req.user;
  const contact = await ToggleAcceptAudioContactService({ contactId });

  const io = getIO();
  io.of(String(companyId))
    .emit(`company-${companyId}-contact`, {
      action: "update",
      contact
    });

  return res.status(200).json(contact);
};

export const blockUnblock = async (
  req: Request,
  res: Response
): Promise<Response> => {
  var { contactId } = req.params;
  const { companyId } = req.user;
  const { active } = req.body;

  const contact = await BlockUnblockContactService({ contactId, companyId, active });

  const io = getIO();
  io.of(String(companyId))
    .emit(`company-${companyId}-contact`, {
      action: "update",
      contact
    });

  return res.status(200).json(contact);
};

export const upload = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const file: Express.Multer.File = head(files) as Express.Multer.File;
  const { companyId } = req.user;

  const response = await ImportContactsService(companyId, file);

  const io = getIO();

  io.of(String(companyId))
    .emit(`company-${companyId}-contact`, {
      action: "reload",
      records: response
    });

  return res.status(200).json(response);
};

export const getContactProfileURL = async (req: Request, res: Response) => {
  const { number } = req.params
  const { companyId } = req.user;

  if (number) {
    const validNumber = await CheckContactNumber(number, companyId);

    const profilePicUrl = await GetProfilePicUrl(validNumber, companyId);

    const contact = await NumberSimpleListService({ number: validNumber, companyId: companyId })

    let obj: any;
    if (contact.length > 0) {
      obj = {
        contactId: contact[0].id,
        profilePicUrl: profilePicUrl
      }
    } else {
      obj = {
        contactId: 0,
        profilePicUrl: profilePicUrl
      }
    }
    return res.status(200).json(obj);
  }
};

export const getContactVcard = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, number } = req.query as IndexGetContactQuery;
  const { companyId } = req.user;

  let vNumber = number;
  const numberDDI = vNumber.toString().substr(0, 2);
  const numberDDD = vNumber.toString().substr(2, 2);
  const numberUser = vNumber.toString().substr(-8, 8);

  if (numberDDD <= '30' && numberDDI === '55') {
    console.log("menor 30")
    vNumber = `${numberDDI + numberDDD + 9 + numberUser}@s.whatsapp.net`;
  } else if (numberDDD > '30' && numberDDI === '55') {
    console.log("maior 30")
    vNumber = `${numberDDI + numberDDD + numberUser}@s.whatsapp.net`;
  } else {
    vNumber = `${number}@s.whatsapp.net`;
  }


  const contact = await GetContactService({
    name,
    number,
    companyId
  });

  return res.status(200).json(contact);
};

export const getContactTags = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { contactId } = req.params;

  const contactTags = await FindContactTags({ contactId });

  let tags = false;

  if (contactTags.length > 0) {
    tags = true;
  }

  return res.status(200).json({ tags: tags });

}

export const toggleDisableBot = async (req: Request, res: Response): Promise<Response> => {
  var { contactId } = req.params;
  const { companyId } = req.user;
  const contact = await ToggleDisableBotContactService({ contactId });

  const io = getIO();
  io.of(String(companyId))
    .emit(`company-${companyId}-contact`, {
      action: "update",
      contact
    });

  return res.status(200).json(contact);
};

export const updateContactWallet = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { wallets } = req.body;
  const { contactId } = req.params;
  const { companyId } = req.user;

  const contact = await UpdateContactWalletsService({
    wallets,
    contactId,
    companyId
  });

  return res.status(200).json(contact);
};

export const listWhatsapp = async (req: Request, res: Response): Promise<Response> => {

  const { name } = req.query as unknown as SearchContactParams;
  const { companyId } = req.user;

  const contactsAll = await SimpleListService({ name, companyId });

  const contacts = contactsAll.filter(contact => contact.channel == "whatsapp");

  return res.json(contacts);
};