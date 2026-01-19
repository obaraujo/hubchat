import fs from "fs/promises"
import * as Sentry from "@sentry/node";
import makeWASocket, {
  Browsers,
  // CacheStore,
  DisconnectReason,
  WAMessage,
  WAMessageContent,
  WAMessageKey,
  WASocket,
  isJidBroadcast,
  isJidGroup,
  // isJidMetaIa,
  isJidNewsletter,
  isJidStatusBroadcast,
  jidNormalizedUser,
  makeCacheableSignalKeyStore,
  proto,
} from "baileys";
import { FindOptions } from "sequelize/types";
import Whatsapp from "../models/Whatsapp";
import logger from "../utils/logger";
import MAIN_LOGGER from "baileys/lib/Utils/logger";
import { useMultiFileAuthState } from "../helpers/useMultiFileAuthState";
// import { useMultiFileAuthState } from "../helpers/useMultiFileAuthState_json";
import { Boom } from "@hapi/boom";
import AppError from "../errors/AppError";
import { getIO } from "./socket";
import { StartWhatsAppSession } from "../services/WbotServices/StartWhatsAppSession";
import DeleteBaileysService from "../services/BaileysServices/DeleteBaileysService";
import cacheLayer from "../libs/cache";
import ImportWhatsAppMessageService from "../services/WhatsappService/ImportWhatsAppMessageService";
import { add } from "date-fns";
import moment from "moment";
import { getTypeMessage, isValidMsg } from "../services/WbotServices/wbotMessageListener";
import { addLogs } from "../helpers/addLogs";
import NodeCache from 'node-cache';
import Message from "../models/Message";
import { getVersionByIndexFromUrl } from "../utils/versionHelper";
import path from "path";
import { getGroupMetadataCache } from "../utils/RedisGroupCache";

const loggerBaileys = MAIN_LOGGER.child({});
loggerBaileys.level = "error";

export type Session = WASocket & {
  id?: number;
  myJid?: string;
  myLid?: string;
  store?: (msg: proto.IWebMessageInfo) => void;
};

const sessions: Session[] = [];

const retriesQrCodeMap = new Map<number, number>();

async function deleteFolder(folder) {
  try {
    await fs.rm(folder, { recursive: true });
    console.log('Pasta deletada com sucesso!', folder);
  } catch (err) {
    console.error('Erro ao deletar pasta:', err);
  }
}

export const getWbot = async (whatsappId: number): Promise<Session> => {
  const whatsapp = await Whatsapp.findByPk(whatsappId);
  if (whatsapp.channel !== "whatsapp_oficial") {
    const sessionIndex = sessions.findIndex(s => s.id === whatsappId);
    if (sessionIndex === -1) {
      throw new AppError("ERR_WAPP_NOT_INITIALIZED");
    }
    return sessions[sessionIndex];
  }
};

export const restartWbot = async (
  companyId: number,
  session?: any
): Promise<void> => {
  try {
    const options: FindOptions = {
      where: {
        companyId,
      },
      attributes: ["id"],
    }

    const whatsapp = await Whatsapp.findAll(options);

    whatsapp.map(async c => {
      const sessionIndex = sessions.findIndex(s => s.id === c.id);
      if (sessionIndex !== -1) {
        sessions[sessionIndex].ws.close();
      }

    });

  } catch (err) {
    logger.error(err);
  }
};

export const removeWbot = async (
  whatsappId: number,
  isLogout = true
): Promise<void> => {
  try {
    const sessionIndex = sessions.findIndex(s => s.id === whatsappId);
    if (sessionIndex !== -1) {
      if (isLogout) {
        sessions[sessionIndex].logout();
        sessions[sessionIndex].ws.close();
      }

      sessions.splice(sessionIndex, 1);
    }
  } catch (err) {
    logger.error(err);
  }
};

export function internalIsJidGroup(jid: string): boolean {
  return isJidGroup(jid);
}

export var dataMessages: any = {};

// export const msgDB = msg();

export const initWASocket = async (whatsapp: Whatsapp): Promise<Session> => {
  return new Promise(async (resolve, reject) => {
    try {
      (async () => {

        const io = getIO();

        const whatsappUpdate = await Whatsapp.findOne({
          where: { id: whatsapp.id }
        });

        if (!whatsappUpdate) return;

        const { id, name, allowGroup, companyId } = whatsappUpdate;

        logger.info(`Starting session ${name}`);
        let retriesQrCode = 0;

        let wsocket: Session = null;

        const store = new NodeCache({
          stdTTL: 3600, //1 hora
          checkperiod: 30,
          useClones: false
        });

        const msgRetryCounterCache = new NodeCache({
          stdTTL: 60 * 60, // 5 minutes
          useClones: false
        });

        async function getMessage(
          key: WAMessageKey
        ): Promise<WAMessageContent> {
          console.log("key", key);
          if (!key.id) return null;

          const message = store.get(key.id);

          if (message) {
            logger.info({ message }, "cacheMessage: recovered from cache");
            return message;
          }

          logger.info(
            { key },
            "cacheMessage: not found in cache - fallback to database"
          );

          let msg: Message;

          msg = await Message.findOne({
            where: { wid: key.id, fromMe: true }
          });

          if (!msg) {
            logger.info({ key }, "cacheMessage: not found in database");
            return undefined;
          }

          try {
            const data = JSON.parse(msg.dataJson);
            logger.info(
              { key, data },
              "cacheMessage: recovered from database"
            );
            store.set(key.id, data.message);
            return data.message || undefined;
          } catch (error) {
            logger.error(
              { key },
              `cacheMessage: error parsing message from database - ${error.message}`
            );
          }

          return undefined;
        }

        const versionWA = await getVersionByIndexFromUrl(2);
        console.info("[WBOT.ts] Versao sendo puxada de url:", versionWA);

        const publicFolder = path.join(__dirname, '..', '..', '..', 'backend', 'sessions');
        const folderSessions = path.join(publicFolder, `company${whatsapp.companyId}`, whatsapp.id.toString());

        // const { state, saveCreds } = await useMultiFileAuthState(folderSessions);
        const { state, saveCreds } = await useMultiFileAuthState(whatsapp);

        wsocket = makeWASocket({
          version: versionWA || [2, 3000, 1030220586],
          logger: loggerBaileys,
          auth: {
            creds: state.creds,
            /** caching makes the store faster to send/recv messages */
            keys: state.keys,
          },
          syncFullHistory: true,
          transactionOpts: { maxCommitRetries: 1, delayBetweenTriesMs: 10 },
          generateHighQualityLinkPreview: true,
          linkPreviewImageThumbnailWidth: 200,
          emitOwnEvents: true,
          browser: Browsers.windows("Chrome"),
          defaultQueryTimeoutMs: 60000,
          cachedGroupMetadata: async (jid) => {
            const cachedGroupMetadata = await getGroupMetadataCache(whatsapp.id, jid)

            if (cachedGroupMetadata?.data === 403) {
              throw new AppError("ERR_SENDING_WAPP_MSG_GROUP_BLOCKED")
            }
            return cachedGroupMetadata
          },
          // msgRetryCounterCache,
          // maxMsgRetryCount: 5,
          shouldIgnoreJid: jid => {
            const ignoreJid = (!allowGroup && isJidGroup(jid)) ||
              isJidBroadcast(jid) ||
              isJidNewsletter(jid) ||
              isJidStatusBroadcast(jid)
            // || isJidMetaIa(jid)
            return ignoreJid
          },
          getMessage
        });

        wsocket.id = whatsapp.id;

        wsocket.store = (msg: proto.IWebMessageInfo): void => {
          if (!msg.key.fromMe) return;

          logger.debug({ message: msg.message }, "cacheMessage: saved");

          store.set(msg.key.id, msg.message);
        };

        setTimeout(async () => {
          const wpp = await Whatsapp.findByPk(whatsapp.id);
          // console.log("Status:::::",wpp.status)
          if (wpp?.importOldMessages && wpp.status === "CONNECTED") {
            let dateOldLimit = new Date(wpp.importOldMessages).getTime();
            let dateRecentLimit = new Date(wpp.importRecentMessages).getTime();

            addLogs({
              fileName: `preparingImportMessagesWppId${whatsapp.id}.txt`, forceNewFile: true,
              text: `Aguardando conexão para iniciar a importação de mensagens:
  Whatsapp nome: ${wpp.name}
  Whatsapp Id: ${wpp.id}
  Criação do arquivo de logs: ${moment().format("DD/MM/YYYY HH:mm:ss")}
  Selecionado Data de inicio de importação: ${moment(dateOldLimit).format("DD/MM/YYYY HH:mm:ss")}
  Selecionado Data final da importação: ${moment(dateRecentLimit).format("DD/MM/YYYY HH:mm:ss")}
  `})

            const statusImportMessages = new Date().getTime();

            await wpp.update({
              statusImportMessages
            });
            wsocket.ev.on("messaging-history.set", async (messageSet: any) => {
              //if(messageSet.isLatest){

              const statusImportMessages = new Date().getTime();

              await wpp.update({
                statusImportMessages
              });
              const whatsappId = whatsapp.id;
              let filteredMessages = messageSet.messages
              let filteredDateMessages = []
              filteredMessages.forEach(msg => {
                const timestampMsg = Math.floor(msg.messageTimestamp["low"] * 1000)
                if (isValidMsg(msg) && dateOldLimit < timestampMsg && dateRecentLimit > timestampMsg) {
                  if (msg.key?.remoteJid.split("@")[1] != "g.us") {
                    addLogs({
                      fileName: `preparingImportMessagesWppId${whatsapp.id}.txt`, text: `Adicionando mensagem para pos processamento:
  Não é Mensagem de GRUPO >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  Data e hora da mensagem: ${moment(timestampMsg).format("DD/MM/YYYY HH:mm:ss")}
  Contato da Mensagem : ${msg.key?.remoteJid}
  Tipo da mensagem : ${getTypeMessage(msg)}

  `})
                    filteredDateMessages.push(msg)
                  } else {
                    if (wpp?.importOldMessagesGroups) {
                      addLogs({
                        fileName: `preparingImportMessagesWppId${whatsapp.id}.txt`, text: `Adicionando mensagem para pos processamento:
  Mensagem de GRUPO >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  Data e hora da mensagem: ${moment(timestampMsg).format("DD/MM/YYYY HH:mm:ss")}
  Contato da Mensagem : ${msg.key?.remoteJid}
  Tipo da mensagem : ${getTypeMessage(msg)}

  `})
                      filteredDateMessages.push(msg)
                    }
                  }
                }

              });


              if (!dataMessages?.[whatsappId]) {
                dataMessages[whatsappId] = [];

                dataMessages[whatsappId].unshift(...filteredDateMessages);
              } else {
                dataMessages[whatsappId].unshift(...filteredDateMessages);
              }

              setTimeout(async () => {
                const wpp = await Whatsapp.findByPk(whatsappId);

                io.of(String(companyId))
                  .emit(`importMessages-${wpp.companyId}`, {
                    action: "update",
                    status: { this: -1, all: -1 }
                  });

                io.of(String(companyId))
                  .emit(`company-${companyId}-whatsappSession`, {
                    action: "update",
                    session: wpp
                  });
                //console.log(JSON.stringify(wpp, null, 2));
              }, 500);

              setTimeout(async () => {

                const wpp = await Whatsapp.findByPk(whatsappId);

                if (wpp?.importOldMessages) {
                  let isTimeStamp = !isNaN(
                    new Date(Math.floor(parseInt(wpp?.statusImportMessages))).getTime()
                  );

                  if (isTimeStamp) {
                    const ultimoStatus = new Date(
                      Math.floor(parseInt(wpp?.statusImportMessages))
                    ).getTime();
                    const dataLimite = +add(ultimoStatus, { seconds: +45 }).getTime();

                    if (dataLimite < new Date().getTime()) {
                      //console.log("Pronto para come?ar")
                      ImportWhatsAppMessageService(wpp.id)
                      wpp.update({
                        statusImportMessages: "Running"
                      })

                    } else {
                      //console.log("Aguardando inicio")
                    }
                  }
                }
                io.of(String(companyId))
                  .emit(`company-${companyId}-whatsappSession`, {
                    action: "update",
                    session: wpp
                  });
              }, 1000 * 45);

            });
          }

        }, 2500);

        wsocket.ev.on(
          "connection.update",
          async ({ connection, lastDisconnect, qr }) => {
            logger.info(
              `Socket  ${name} Connection Update ${connection || ""} ${lastDisconnect ? lastDisconnect.error.message : ""
              }`
            );

            if (connection === "close") {
              console.log("DESCONECTOU", JSON.stringify(lastDisconnect, null, 2))
              logger.info(
                `Socket  ${name} Connection Update ${connection || ""} ${lastDisconnect ? lastDisconnect.error.message : ""
                }`
              );
              if ((lastDisconnect?.error as Boom)?.output?.statusCode === 403) {
                await whatsapp.update({ status: "PENDING", session: "" });
                await DeleteBaileysService(whatsapp.id);
                // await deleteFolder(folderSessions);
                await cacheLayer.delFromPattern(`sessions:${whatsapp.id}:*`);
                io.of(String(companyId))
                  .emit(`company-${whatsapp.companyId}-whatsappSession`, {
                    action: "update",
                    session: whatsapp
                  });
                removeWbot(id, false);
              }
              if (
                (lastDisconnect?.error as Boom)?.output?.statusCode !==
                DisconnectReason.loggedOut
              ) {
                removeWbot(id, false);
                setTimeout(
                  () => StartWhatsAppSession(whatsapp, whatsapp.companyId),
                  2000
                );
              } else {
                await whatsapp.update({ status: "PENDING", session: "" });
                await DeleteBaileysService(whatsapp.id);
                // await deleteFolder(folderSessions);
                await cacheLayer.delFromPattern(`sessions:${whatsapp.id}:*`);
                io.of(String(companyId))
                  .emit(`company-${whatsapp.companyId}-whatsappSession`, {
                    action: "update",
                    session: whatsapp
                  });
                removeWbot(id, false);
                setTimeout(
                  () => StartWhatsAppSession(whatsapp, whatsapp.companyId),
                  2000
                );
              }
            }

            if (connection === "open") {

              wsocket.myLid = jidNormalizedUser(wsocket.user?.lid)
              wsocket.myJid = jidNormalizedUser(wsocket.user.id)

              await whatsapp.update({
                status: "CONNECTED",
                qrcode: "",
                retries: 0,
                number:
                  wsocket.type === "md"
                    ? jidNormalizedUser((wsocket as WASocket).user.id).split("@")[0]
                    : "-"
              });

              logger.debug(
                {
                  id: jidNormalizedUser(wsocket.user.id),
                  name: wsocket.user.name,
                  lid: jidNormalizedUser(wsocket.user?.lid),
                  notify: wsocket.user?.notify,
                  verifiedName: wsocket.user?.verifiedName,
                  imgUrl: wsocket.user?.imgUrl,
                  status: wsocket.user?.status
                },
                `Session ${name} details`
              );



              io.of(String(companyId))
                .emit(`company-${whatsapp.companyId}-whatsappSession`, {
                  action: "update",
                  session: whatsapp
                });

              const sessionIndex = sessions.findIndex(
                s => s.id === whatsapp.id
              );
              if (sessionIndex === -1) {
                wsocket.id = whatsapp.id;
                sessions.push(wsocket);
              }

              resolve(wsocket);
            }

            if (qr !== undefined) {
              if (retriesQrCodeMap.get(id) && retriesQrCodeMap.get(id) >= 3) {
                await whatsappUpdate.update({
                  status: "DISCONNECTED",
                  qrcode: ""
                });
                await DeleteBaileysService(whatsappUpdate.id);
                // await deleteFolder(folderSessions);
                await cacheLayer.delFromPattern(`sessions:${whatsapp.id}:*`);
                io.of(String(companyId))
                  .emit(`company-${whatsapp.companyId}-whatsappSession`, {
                    action: "update",
                    session: whatsappUpdate
                  });
                wsocket.ev.removeAllListeners("connection.update");
                wsocket.ws.close();
                wsocket = null;
                retriesQrCodeMap.delete(id);
              } else {
                logger.info(`Session QRCode Generate ${name}`);
                retriesQrCodeMap.set(id, (retriesQrCode += 1));

                await whatsapp.update({
                  qrcode: qr,
                  status: "qrcode",
                  retries: 0,
                  number: ""
                });
                const sessionIndex = sessions.findIndex(
                  s => s.id === whatsapp.id
                );

                if (sessionIndex === -1) {
                  wsocket.id = whatsapp.id;
                  sessions.push(wsocket);
                }

                io.of(String(companyId))
                  .emit(`company-${whatsapp.companyId}-whatsappSession`, {
                    action: "update",
                    session: whatsapp
                  });
              }
            }
          }
        );
        wsocket.ev.on("creds.update", saveCreds);
        // wsocket.store = store;
        // store.bind(wsocket.ev);
      })();
    } catch (error) {
      Sentry.captureException(error);
      console.log(error);
      reject(error);
    }
  });
};
