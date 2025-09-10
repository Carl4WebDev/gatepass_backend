export default class GetNotSanctionedGatepassesUseCase {
  constructor(gatepassRepo) {
    this.gatepassRepo = gatepassRepo;
  }
  async execute() {
    return await this.gatepassRepo.findNotSanctionedGatepasses();
  }
}
