import express from "express";
import isAuth from "../middleware/isAuth";
import * as CompanyKanbanController from "../controllers/CompanyKanbanController";

const companyKanbanRoutes = express.Router();

companyKanbanRoutes.post(
  "/company-kanban/lane-order",
  isAuth,
  CompanyKanbanController.setLaneOrder
);

companyKanbanRoutes.get(
  "/company-kanban/lane-order",
  isAuth,
  CompanyKanbanController.getLaneOrder
);

export default companyKanbanRoutes;
