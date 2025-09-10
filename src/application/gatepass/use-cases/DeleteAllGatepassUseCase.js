import Gatepass from "../../../domain/entities/Gatepass.js";

export default class AddGatepassUseCase {
  constructor(gatepassRepo) {
    this.gatepassRepo = gatepassRepo;
  }
  async execute() {
    return this.gatepassRepo.deleteAllGatepass();
  }
}
