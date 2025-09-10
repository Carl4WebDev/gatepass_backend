export default class GetActiveGatepassUseCase {
  constructor(gatepassRepo) {
    this.gatepassRepo = gatepassRepo;
  }

  async execute() {
    try {
      // Call the repository method to get all active gatepasses
      const activeGatepasses = await this.gatepassRepo.findAllActive();
      return activeGatepasses;
    } catch (err) {
      // Handle errors properly
      throw new Error(`Failed to get active gatepasses: ${err.message}`);
    }
  }
}
