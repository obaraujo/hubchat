// Ajustes de tipagem e dependências para evitar erros de compilação
declare const process: any;
declare module "crypto";
const cryptoMod: any = (() => {
  try {
    // carrega crypto de forma dinâmica, evitando erro de tipagem em ambientes sem @types/node
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require("crypto");
  } catch {
    return null;
  }
})();
import Whatsapp from "../models/Whatsapp";
import { handleMessage } from "../services/FacebookServices/facebookMessageListener";
// import { handleMessage } from "../services/FacebookServices/facebookMessageListener";

export const index = async (req: any, res: any): Promise<any> => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "whaticket";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
  }

  return res.status(403).json({
    message: "Forbidden"
  });
};

export const webHook = async (
  req: any,
  res: any
): Promise<any> => {
  try {
    // Verificação opcional de assinatura do webhook (X-Hub-Signature-256)
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    const signatureHeader = (req.headers["x-hub-signature-256"] || "") as string;
    if (cryptoMod && appSecret && signatureHeader && typeof (req as any).rawBody === "string") {
      const expected =
        "sha256=" + cryptoMod.createHmac("sha256", appSecret).update((req as any).rawBody).digest("hex");
      if (expected !== signatureHeader) {
        return res.status(403).json({ message: "Invalid signature" });
      }
    }

    const { body } = req;
    if (body.object === "page" || body.object === "instagram") {
      let channel: string;

      if (body.object === "page") {
        channel = "facebook";
      } else {
        channel = "instagram";
      }

      body.entry?.forEach(async (entry: any) => {
        const getTokenPage = await (Whatsapp as any).findOne({
          where: {
            facebookPageUserId: entry.id,
            channel
          }
        });

        if (!getTokenPage) return;

        if (Array.isArray(entry.messaging)) {
          entry.messaging.forEach((data: any) => {
            handleMessage(getTokenPage, data, channel, getTokenPage.companyId);
          });
        }

        // Suporte a Instagram: eventos vêm em entry.changes[].value
        if (channel === "instagram" && Array.isArray(entry.changes)) {
          entry.changes.forEach((chg: any) => {
            if (chg?.field === "messages" && chg?.value) {
              const v = chg.value;
              // Normaliza para o formato esperado por handleMessage
              const normalized = {
                sender: { id: v.sender?.id },
                recipient: { id: v.recipient?.id },
                timestamp: v.timestamp,
                message: v.message
              };
              handleMessage(getTokenPage, normalized, channel, getTokenPage.companyId);
            }
          });
        }
      });

      return res.status(200).json({
        message: "EVENT_RECEIVED"
      });
    }

    return res.status(404).json({
      message: body
    });
  } catch (error) {
    return res.status(500).json({
      message: error
    });
  }
};
