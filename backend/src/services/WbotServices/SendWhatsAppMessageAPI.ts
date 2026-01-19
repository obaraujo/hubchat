import { delay, WAMessage } from "baileys";
import * as Sentry from "@sentry/node";
import AppError from "../../errors/AppError";
import GetTicketWbot from "../../helpers/GetTicketWbot";
import Message from "../../models/Message";
import Ticket from "../../models/Ticket";

import formatBody from "../../helpers/Mustache";
import Contact from "../../models/Contact";
import { getWbot } from "../../libs/wbot";
import logger from "../../utils/logger";
import { ENABLE_LID_DEBUG } from "../../config/debug";
import { normalizeJid } from "../../utils";
interface Request {
  body: string;
  whatsappId: number;
  contact: Contact;
  quotedMsg?: Message;
  msdelay?: number;
}

const SendWhatsAppMessage = async ({
  body,
  whatsappId,
  contact,
  quotedMsg,
  msdelay
}: Request): Promise<WAMessage> => {
  let options = {};
  const wbot = await getWbot(whatsappId);

  let jid = `${contact.number}@${contact.isGroup ? "g.us" : "s.whatsapp.net"}`;

  jid = normalizeJid(jid);

  if (ENABLE_LID_DEBUG) {
    logger.info(
      `[RDS-LID] SendMessageAPI - Enviando para JID normalizado: ${jid}`
    );
    logger.info(`[RDS-LID] SendMessageAPI - Contact lid: ${contact.lid}`);
    logger.info(
      `[RDS-LID] SendMessageAPI - Contact remoteJid: ${contact.remoteJid}`
    );
    logger.info(
      `[RDS-LID] SendMessageAPI - QuotedMsg: ${quotedMsg ? "SIM" : "NÃO"}`
    );
  }

  if (quotedMsg) {
    const quotedId: any = (quotedMsg as any)?.id ?? quotedMsg;
    let chatMessages: Message | null = null;
    if (quotedId !== undefined && quotedId !== null && String(quotedId).trim() !== "") {
      chatMessages = await Message.findOne({
        where: {
          id: quotedId
        }
      });
    }

    if (chatMessages) {
      const msgFound = JSON.parse(chatMessages.dataJson);

      options = {
        quoted: {
          key: msgFound.key,
          message: {
            extendedTextMessage: msgFound.message.extendedTextMessage
          }
        }
      };

      if (ENABLE_LID_DEBUG) {
        logger.info(
          `[RDS-LID] SendMessageAPI - ContextInfo configurado para resposta`
        );
      }
    }
  }

  try {
    await delay(msdelay);

    const messageContent: any = {
      text: body
    };

    if (quotedMsg) {
      messageContent.contextInfo = {
        forwardingScore: 0,
        isForwarded: false
      };

      if (ENABLE_LID_DEBUG) {
        logger.info(
          `[RDS-LID] SendMessageAPI - ContextInfo adicionado para resposta`
        );
      }
    }

    const sentMessage = await wbot.sendMessage(jid, messageContent, {
      ...options
    });

    wbot.store(sentMessage);

    if (ENABLE_LID_DEBUG) {
      logger.info(
        `[RDS-LID] SendMessageAPI - Mensagem enviada com sucesso para ${jid}`
      );
    }

    wbot.store(sentMessage);

    return sentMessage;
  } catch (err) {
    Sentry.captureException(err);
    console.log(err);
    throw new AppError("ERR_SENDING_WAPP_MSG");
  }
};

export default SendWhatsAppMessage;
