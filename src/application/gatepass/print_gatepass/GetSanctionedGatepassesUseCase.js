export default class GetSanctionedGatepassUseCase {
  constructor(gatepassRepo) {
    this.gatepassRepo = gatepassRepo;
  }
  async execute() {
    return await this.gatepassRepo.findSanctionedGatepasses();
  }
}
