import { getIO } from "../../libs/socket";
import CompaniesSettings from "../../models/CompaniesSettings";
import Contact from "../../models/Contact";
import ContactCustomField from "../../models/ContactCustomField";
import fs from "fs";
import path, { join } from "path";
import logger from "../../utils/logger";
import { isNil } from "lodash";
import Whatsapp from "../../models/Whatsapp";
import * as Sentry from "@sentry/node";
import { createJid } from "../../functionts";
import { Op } from "sequelize";
import axios from 'axios';

interface ExtraInfo extends ContactCustomField {
  name: string;
  value: string;
}

interface Request {
  name: string;
  number: string;
  isGroup: boolean;
  email?: string;
  profilePicUrl?: string;
  companyId: number;
  channel?: string;
  extraInfo?: ExtraInfo[];
  remoteJid?: string;
  whatsappId?: number;
  wbot?: any;
}

const downloadProfileImage = async ({ profilePicUrl, companyId, contact }) => {
  const publicFolder = path.resolve(__dirname, "..", "..", "..", "public");
  const folder = path.resolve(publicFolder, `company${companyId}`, "contacts");
  let filename;

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    fs.chmodSync(folder, 0o777);
  }

  try {
    const response = await axios.get(profilePicUrl, {
      responseType: 'arraybuffer'
    });

    filename = `${new Date().getTime()}.jpeg`;
    fs.writeFileSync(join(folder, filename), response.data);
  } catch (error) {
    logger.error(`Error downloading profile image: ${error}`);
  }

  return filename;
};

const CreateOrUpdateContactService = async ({
  name,
  number: rawNumber,
  profilePicUrl,
  isGroup,
  email = "",
  channel = "whatsapp",
  companyId,
  extraInfo = [],
  remoteJid = "",
  whatsappId,
  wbot
}: Request): Promise<Contact> => {
  console.log("🚀 ~ CreateOrUpdateContactService ~ rawNumber:", rawNumber)
  console.log("🚀 ~ CreateOrUpdateContactService ~ remoteJid:", remoteJid)
  try {
    const io = getIO();
    let contact: Contact | null = null;
    
    // Limpeza básica do número
    const number = isGroup ? rawNumber : rawNumber?.replace(/[^0-9]/g, "");

    // 1. ESTRATÉGIA DE BUSCA UNIFICADA (A Verdade é uma só)
    // Tenta achar por remoteJid OU por número (se não for grupo)
    const queryConditions: any = [];
    
    if (remoteJid && !remoteJid.includes('@lid')) {
        queryConditions.push({ remoteJid });
    }
    
    if (number) {
        queryConditions.push({ number });
    }

    if (queryConditions.length > 0) {
        contact = await Contact.findOne({
            where: {
                companyId,
                [Op.or]: queryConditions
            }
        });
    }

    let action = "update";

    // 2. ATUALIZAÇÃO (Se encontrou o contato)
    if (contact) {
      // Atualiza remoteJid se necessário (e se não for LID)
      if (remoteJid && !remoteJid.includes('@lid') && contact.remoteJid !== remoteJid) {
				
        contact.remoteJid = remoteJid;
      }
      
      // Atualiza dados básicos
      contact.profilePicUrl = profilePicUrl || contact.profilePicUrl;
      contact.isGroup = isGroup;
      contact.email = email || contact.email;
      
      // Atualiza nome se o atual for igual ao número (contato sem nome salvo)
      if (contact.name === contact.number && name) {
        contact.name = name;
      }

      // Vincula WhatsappId se não tiver
      if (isNil(contact.whatsappId) && whatsappId) {
        const whatsapp = await Whatsapp.findOne({ where: { id: whatsappId, companyId } });
        if (whatsapp) {
          contact.whatsappId = whatsappId;
        }
      }

      await contact.save();
    } 
    // 3. CRIAÇÃO (Se não encontrou)
    else {
      action = "create";
      
      // Lógica específica para WhatsApp (gerar JID se faltar)
      let newRemoteJid = remoteJid;
      if (wbot && channel === 'whatsapp' && !remoteJid) {
        newRemoteJid = isGroup ? `${rawNumber}@g.us` : createJid(number);
      }

      // Tenta pegar foto do Wbot se não veio na requisição
      if (wbot && channel === 'whatsapp' && !profilePicUrl) {
         try {
            profilePicUrl = await wbot.profilePictureUrl(newRemoteJid || remoteJid, "image");
         } catch (e) {
            profilePicUrl = `${process.env.FRONTEND_URL}/nopicture.png`;
         }
      }

      const settings = await CompaniesSettings.findOne({ where: { companyId } });
      const acceptAudio = settings?.acceptAudioMessageContact === 'enabled';

      contact = await Contact.create({
        name,
        number,
        email,
        isGroup,
        companyId,
        channel,
        acceptAudioMessage: acceptAudio,
        remoteJid: newRemoteJid,
        profilePicUrl,
        urlPicture: "",
        whatsappId
      });
    }

    // 4. TRATAMENTO DE IMAGEM (Atualizar arquivo local)
    // Verifica se precisa baixar a imagem (se tem wbot, se é social media ou se a URL mudou)
    const shouldUpdateImage = (wbot || ['facebook', 'instagram'].includes(channel)) && 
                              profilePicUrl && 
                              profilePicUrl !== "" &&
                              profilePicUrl !== `${process.env.FRONTEND_URL}/nopicture.png` &&
                              (!contact.urlPicture || contact.profilePicUrl !== profilePicUrl);

    if (shouldUpdateImage) {
      const filename = await downloadProfileImage({
        profilePicUrl,
        companyId,
        contact
      });

      if (filename) {
        await contact.update({
          urlPicture: filename,
          pictureUpdated: true
        });
      }
    }

    // Recarrega para garantir dados frescos
    await contact.reload();

    // 5. NOTIFICAÇÃO VIA SOCKET
    io.of(String(companyId)).emit(`company-${companyId}-contact`, {
      action,
      contact
    });

    return contact;
  } catch (err) {
    logger.error("Error to find or create a contact:", err);
    throw err;
  }
};

export default CreateOrUpdateContactService;