import AppError from "../../errors/AppError";
import { createJid } from "../../functionts";
import GetDefaultWhatsApp from "../../helpers/GetDefaultWhatsApp";
import { getWbot } from "../../libs/wbot";
import Contact from "../../models/Contact";
import FindCompaniesWhatsappService from "../CompanyService/FindCompaniesWhatsappService";

interface Request {
    contactId: string;
    companyId: string | number;
    active: boolean
}


const BlockUnblockContactService = async ({
    contactId,
    companyId,
    active
}: Request): Promise<Contact> => {
    const contact = await Contact.findByPk(contactId);

    if (!contact) {
        throw new AppError("ERR_NO_CONTACT_FOUND", 404);
    }

    // console.log('active', active)
    // console.log('companyId', companyId)
    // console.log('contact.number', contact.number)

    if (active) {
        try {
            //const whatsappCompany = await GetDefaultWhatsApp(Number(companyId))

            const whatsappCompany = null;

            const wbot = getWbot(whatsappCompany.id);

            const jid = createJid(contact.number);

            await wbot.updateBlockStatus(jid, "unblock");

            await contact.update({ active: true });

        } catch (error) {
            console.log('Não consegui desbloquear o contato')
        }
    }

    if (!active) {
         try {
            //const whatsappCompany = await GetDefaultWhatsApp(Number(companyId))

            const whatsappCompany = null;
            
            const wbot = getWbot(whatsappCompany.id);

            const jid = createJid(contact.number);

            await wbot.updateBlockStatus(jid, "block");

            await contact.update({ active: false });

        } catch (error) {
            console.log('Não consegui bloquear o contato')
        }
    }

    return contact;
};

export default BlockUnblockContactService;
