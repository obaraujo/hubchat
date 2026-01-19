import Campaign from "../../models/Campaign";
import CampaignSetting from "../../models/CampaignSetting";
import CampaignShipping from "../../models/CampaignShipping";
import { campaignQueue } from "../../queues";
import { Op } from "sequelize";

export async function RestartService(id: number) {
  const campaign = await Campaign.findByPk(id);
  await campaign.update({ status: "EM_ANDAMENTO" });

  // Buscar configurações de delay da campanha
  const settings = await CampaignSetting.findAll({
    where: { companyId: campaign.companyId },
    attributes: ["key", "value"]
  });

  let messageInterval: number = 20; // Default 20 segundos
  let longerIntervalAfter: number = 20;
  let greaterInterval: number = 60;

  settings.forEach(setting => {
    if (setting.key === "messageInterval") {
      messageInterval = JSON.parse(setting.value);
    }
    if (setting.key === "longerIntervalAfter") {
      longerIntervalAfter = JSON.parse(setting.value);
    }
    if (setting.key === "greaterInterval") {
      greaterInterval = JSON.parse(setting.value);
    }
  });

  // Verificar quantos registros já foram processados
  const processedCount = await CampaignShipping.count({
    where: {
      campaignId: campaign.id,
      deliveredAt: { [Op.ne]: null }
    }
  });

  console.log(`[RESTART] Campanha ${campaign.id} reiniciada - ${processedCount} já processados`);

  // Usar delay mínimo de 5 segundos para evitar envio imediato
  const initialDelay = Math.max(messageInterval * 1000, 5000);

  await campaignQueue.add("ProcessCampaign", {
    id: campaign.id,
    delay: initialDelay,
    restartMode: true, // Flag para indicar que é um restart
    messageInterval: messageInterval,
    longerIntervalAfter: longerIntervalAfter,
    greaterInterval: greaterInterval
  });
}
