import express from "express";
import cors from "cors";

import ENV from "./infrastructure/config/env.js";
import { pool } from "./infrastructure/config/db.js";

const app = express();
app.use(cors());
app.use(express.json());

import JwtTokenService from "./infrastructure/security/JwtTokenService.js";
import BcryptPasswordHasher from "./infrastructure/security/BcryptPasswordHasher.js";

import UserRepo from "./infrastructure/database/UserRepo.js";
import AuthService from "./application/auth/AuthService.js";
import AuthController from "./interface/controllers/AuthController.js";
import authRoutes from "./interface/routes/authRoutes.js";

import LoginUseCase from "./application/auth/use-cases/LoginUseCase.js";

const userRep = new UserRepo(pool);
const tokenService = new JwtTokenService();
const passwordHasher = new BcryptPasswordHasher();

const loginUseCase = new LoginUseCase(userRep, tokenService, passwordHasher);
const authService = new AuthService(loginUseCase);

const authController = new AuthController(authService);
app.use("/auth/admin", authRoutes(authController));

// =-============================================ Add gatepass
import GatepassRepo from "./infrastructure/database/GatepassRepo.js";

import AddGatepasssUseCase from "./application/gatepass/use-cases/AddGatepassUseCase.js";
import ReturnGatepassUseCase from "./application/gatepass/use-cases/ReturnGatepassUseCase.js";

import GatepassService from "./application/gatepass/GatepassService.js";
import GatepassController from "./interface/controllers/GatepassController.js";
import gatepassRoutes from "./interface/routes/gatepassRoutes.js";
import EditGatepassUseCase from "./application/gatepass/use-cases/EditGatepassUseCase.js";
import GetActiveGatepasses from "./application/gatepass/use-cases/GetActiveGatepass.js";
import GetAllSanctionUseCase from "./application/gatepass/use-cases/GetAllSanctionUseCase.js";
import GetAllGatepassUseCase from "./application/gatepass/use-cases/GetAllGatepassUseCase.js";
import DeleteAllGatepassUseCase from "./application/gatepass/use-cases/DeleteAllGatepassUseCase.js";

const gatepassRepo = new GatepassRepo(pool);

const addGatepassUseCase = new AddGatepasssUseCase(gatepassRepo);
const returnGatepassUseCase = new ReturnGatepassUseCase(gatepassRepo);
const editGatepassUseCase = new EditGatepassUseCase(gatepassRepo);
const getActiveGatepasses = new GetActiveGatepasses(gatepassRepo);
const getAllSanctionUseCase = new GetAllSanctionUseCase(gatepassRepo);
const getAllGatepassUseCase = new GetAllGatepassUseCase(gatepassRepo);
const deleteAllGatepassUseCase = new DeleteAllGatepassUseCase(gatepassRepo);

const gatepassService = new GatepassService(
  addGatepassUseCase,
  returnGatepassUseCase,
  editGatepassUseCase,
  getActiveGatepasses,
  getAllSanctionUseCase,
  getAllGatepassUseCase,
  deleteAllGatepassUseCase
);
const gatepassController = new GatepassController(gatepassService);

app.use("/gatepass", gatepassRoutes(gatepassController));

// ==================================================excel download
import GetSanctionedGatepassesUseCase from "./application/gatepass/print_gatepass/GetSanctionedGatepassesUseCase.js";
import GetNotSanctionedGatepassesUseCase from "./application/gatepass/print_gatepass/GetNotSanctionedGatepassesUseCase.js";
import GetAllGatepassesUseCase from "./application/gatepass/print_gatepass/GetAllGatepassesUseCase.js";

import GatepassPrintController from "./interface/controllers/GatepassPrintController.js";
import printGatepassRoutes from "./interface/routes/printGatepassRoutes.js";

const getSanctionedGatepassesUseCase = new GetSanctionedGatepassesUseCase(
  gatepassRepo
);
const getNotSanctionedGatepassesUseCase = new GetNotSanctionedGatepassesUseCase(
  gatepassRepo
);
const getAllGatepassesUseCase = new GetAllGatepassesUseCase(gatepassRepo);

const gatepassPrintController = new GatepassPrintController(
  getSanctionedGatepassesUseCase,
  getNotSanctionedGatepassesUseCase,
  getAllGatepassesUseCase
);

app.use("/prints", printGatepassRoutes(gatepassPrintController));

// ================================================== intellisense
import StudentRepo from "./infrastructure/database/StudentRepo.js";
import StudentController from "./interface/controllers/StudentController.js";

const studentRepo = new StudentRepo(pool);
const studentController = new StudentController(studentRepo);

app.get("/student/search", (req, res) =>
  studentController.searchStudents(req, res)
);

app.listen(ENV.PORT, () => {
  console.log(`🚀 Server running on port ${ENV.PORT}`);
});
