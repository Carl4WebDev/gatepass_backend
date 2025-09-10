import { Router } from "express";

export default function printGatepassRoutes(gatepassPrintController) {
  const router = Router();

  // 🔹 Excel export endpoints
  router.get(
    "/export/all",
    gatepassPrintController.exportAll.bind(gatepassPrintController)
  );

  router.get(
    "/export/sanctioned",
    gatepassPrintController.exportSanctioned.bind(gatepassPrintController)
  );

  router.get(
    "/export/not-sanctioned",
    gatepassPrintController.exportNotSanctioned.bind(gatepassPrintController)
  );

  // 🔹 JSON endpoints
  router.get(
    "/all",
    gatepassPrintController.getAll.bind(gatepassPrintController)
  );

  router.get(
    "/sanctioned",
    gatepassPrintController.getSanctioned.bind(gatepassPrintController)
  );

  router.get(
    "/not-sanctioned",
    gatepassPrintController.getNotSanctioned.bind(gatepassPrintController)
  );

  return router;
}
