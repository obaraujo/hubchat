import Contact from "../../models/Contact";
import Ticket from "../../models/Ticket";
import { normalizeJid } from "../../utils";
import logger from "../../utils/logger";
import { ENABLE_LID_DEBUG } from "../../config/debug";

export function getJidOf(reference: string | Contact | Ticket): string {
  let address = reference;
  let isGroup = false;

  // Extrair endereço e flag de grupo com base no tipo da referência
  if (reference instanceof Contact) {
    isGroup = reference.isGroup;

    if (reference.remoteJid && reference.remoteJid.includes("@")) {
      if (ENABLE_LID_DEBUG) {
        logger.info(`[RDS-LID] getJidOf - Usando remoteJid do contato: ${reference.remoteJid}`);
      }
      return normalizeJid(reference.remoteJid);
    }

    address = reference.number;
  } else if (reference instanceof Ticket) {
    isGroup = reference.isGroup;

    if (reference.contact?.remoteJid && reference.contact.remoteJid.includes("@")) {
      if (ENABLE_LID_DEBUG) {
        logger.info(`[RDS-LID] getJidOf - Usando remoteJid do ticket.contact: ${reference.contact.remoteJid}`);
      }
      return normalizeJid(reference.contact.remoteJid);
    }

    address = reference.contact.number;
  }

  if (typeof address !== "string") {
    throw new Error("Invalid reference type");
  }

  if (address.includes("@")) {
    return normalizeJid(address);
  }

  // Construir o JID e normalizar
  const jid = `${address}@${isGroup ? "g.us" : "s.whatsapp.net"}`;
  return normalizeJid(jid);
}
