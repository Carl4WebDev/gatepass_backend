export default class GetAllGatepassesUseCase {
  constructor(gatepassRepo) {
    this.gatepassRepo = gatepassRepo;
  }
  async execute() {
    return await this.gatepassRepo.findAllGatepasses();
  }
}
