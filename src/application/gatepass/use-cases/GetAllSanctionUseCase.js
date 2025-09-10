export default class GetAllSanctionUseCase {
  constructor(gatepassRepo) {
    this.gatepassRepo = gatepassRepo;
  }

  async execute() {
    return await this.gatepassRepo.getAllSanctions();
  }
}
