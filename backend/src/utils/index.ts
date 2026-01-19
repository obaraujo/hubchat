import logger from "../utils/logger";
import { ENABLE_LID_DEBUG } from "../config/debug";

export function normalizeJid(jid: string): string {
  if (!jid) return jid;

  if (ENABLE_LID_DEBUG) {
    logger.info(`[RDS-LID] normalizeJid - Entrada: ${jid}`);
  }

  // Correção para contatos salvos incorretamente com @lid@s.whatsapp.net
  if (jid.includes('@lid@s.whatsapp.net')) {
    const parts = jid.split('@');
    if (parts.length >= 3 && /^\d+$/.test(parts[0])) {
      const normalized = parts[0] + '@s.whatsapp.net';
      if (ENABLE_LID_DEBUG) logger.info(`[RDS-LID] normalizeJid - Corrigido formato @lid@s.whatsapp.net: ${normalized}`);
      return normalized;
    }
  }

  if (jid.includes('@s.whatsapp.net@s.whatsapp.net')) {
    const normalized = jid.replace('@s.whatsapp.net@s.whatsapp.net', '@s.whatsapp.net');
    if (ENABLE_LID_DEBUG) logger.info(`[RDS-LID] normalizeJid - Corrigido duplicado: ${normalized}`);
    return normalized;
  }
  if (jid.includes('@g.us@g.us')) {
    const normalized = jid.replace('@g.us@g.us', '@g.us');
    if (ENABLE_LID_DEBUG) logger.info(`[RDS-LID] normalizeJid - Corrigido duplicado: ${normalized}`);
    return normalized;
  }

  if (jid.includes('@s.whatsapp.net') || jid.includes('@g.us')) {
    if (ENABLE_LID_DEBUG) logger.info(`[RDS-LID] normalizeJid - JID já normalizado: ${jid}`);
    return jid;
  }

  if (jid.includes('@lid')) {
    const base = jid.split('@')[0];

    if (!/^\d+$/.test(base)) {
      if (ENABLE_LID_DEBUG) logger.warn(`[RDS-LID] normalizeJid - Formato inválido para @lid: ${jid}`);
      return jid;
    }

    let normalized;
    if (base.length > 15 || jid.includes('g.us')) {
      normalized = base + '@g.us';
      if (ENABLE_LID_DEBUG) logger.info(`[RDS-LID] normalizeJid - @lid convertido para grupo: ${normalized}`);
    } else {
      normalized = base + '@s.whatsapp.net';
      if (ENABLE_LID_DEBUG) logger.info(`[RDS-LID] normalizeJid - @lid convertido para usuário: ${normalized}`);
    }
    return normalized;
  }

  if (!jid.includes('@')) {
    const normalized = jid + '@s.whatsapp.net';
    if (ENABLE_LID_DEBUG) logger.info(`[RDS-LID] normalizeJid - Adicionado @s.whatsapp.net: ${normalized}`);
    return normalized;
  }

  if (ENABLE_LID_DEBUG) logger.info(`[RDS-LID] normalizeJid - Sem alteração: ${jid}`);
  return jid;
}
