import { initWASocket } from "../../libs/wbot";
import Whatsapp from "../../models/Whatsapp";
import { wbotMessageListener } from "./wbotMessageListener";
import { getIO } from "../../libs/socket";
import wbotMonitor from "./wbotMonitor";
import logger from "../../utils/logger";
import * as Sentry from "@sentry/node";
import { redisGroupCache } from "../../utils/RedisGroupCache";

export const StartWhatsAppSession = async (
  whatsapp: Whatsapp,
  companyId: number
): Promise<void> => {
  await whatsapp.update({ status: "OPENING" });

  const io = getIO();
  io.of(String(companyId))
    .emit(`company-${companyId}-whatsappSession`, {
      action: "update",
      session: whatsapp
    });

  try {
    const wbot = await initWASocket(whatsapp);

    if (wbot.id) {

      const groups = await wbot.groupFetchAllParticipating()
      if (groups) {
        for (const [id, groupMetadata] of Object.entries(groups)) {
          //limpa os grupos existentes no cache
          await redisGroupCache.del(whatsapp.id, id);

          await redisGroupCache.set(whatsapp.id, id, groupMetadata);
        }
      }

      wbotMessageListener(wbot, companyId);
      wbotMonitor(wbot, whatsapp, companyId);
    }
  } catch (err) {
    Sentry.captureException(err);
    logger.error(err);
  }
};
