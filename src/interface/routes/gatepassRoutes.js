import { Router } from "express";

export default function gatepassRoutes(gatepassController) {
  const router = Router();
  router.post(
    "/add-gatepass",
    gatepassController.addGatepass.bind(gatepassController)
  );
  router.post(
    "/return-gatepass",
    gatepassController.returnGatepass.bind(gatepassController)
  );

  router.put(
    "/edit-gatepass/:id",
    gatepassController.editGatepass.bind(gatepassController)
  );
  router.delete(
    "/delete-all",
    gatepassController.deleteAllGatepass.bind(gatepassController)
  );

  router.get(
    "/active",
    gatepassController.getActiveGatepasses.bind(gatepassController)
  );

  router.get(
    "/sanctions",
    gatepassController.getAllSanctions.bind(gatepassController)
  );
  router.get(
    "/all-gatepass",
    gatepassController.getAllGatepass.bind(gatepassController)
  );

  return router;
}
