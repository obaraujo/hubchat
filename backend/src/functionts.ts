export function createJid(number: string, isGroup=false) {
	return number.includes('-')
		? `${number}@g.us`
		: number.length>13?`${number.replace(/\D+/g, "")}@lid`: `${formatBRNumber(number)}@s.whatsapp.net`;
}

function formatBRNumber(jid: string) {
  const regexp = new RegExp(/^(\d{2})(\d{2})\d{1}(\d{8})$/);
  if (regexp.test(jid)) {
    const match = regexp.exec(jid);
    if (match && match[1] === '55' && Number.isInteger(Number.parseInt(match[2]))) {
      const ddd = Number.parseInt(match[2]);
      if (ddd < 31) {
        return match[0];
      } else if (ddd >= 31) {
        return match[1] + match[2] + match[3];
      }
    }
  } else {
    return jid;
  }
}