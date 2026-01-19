import CompanyKanbanConfig from "../../models/CompanyKanbanConfig";

interface Request {
  companyId: number;
}

const GetKanbanLaneOrderService = async ({
  companyId,
}: Request): Promise<string[] | null> => {
  const config = await CompanyKanbanConfig.findOne({
    where: {
      companyId,
    },
  });

  if (!config || !config.laneOrder) {
    return null;
  }

  try {
    return JSON.parse(config.laneOrder);
  } catch (error) {
    console.error("Error parsing lane order:", error);
    return null;
  }
};

export default GetKanbanLaneOrderService;
