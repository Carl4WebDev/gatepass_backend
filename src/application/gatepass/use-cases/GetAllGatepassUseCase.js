export default class GetAllGatepassUseCase {
  constructor(gatepassRepo) {
    this.gatepassRepo = gatepassRepo;
  }

  async execute() {
    try {
      // Call the repository method to get all active gatepasses
      const allGatepasses = await this.gatepassRepo.findAllGatepasses();
      return allGatepasses;
    } catch (err) {
      // Handle errors properly
      throw new Error(`Failed to get active gatepasses: ${err.message}`);
    }
  }
}
