export default class GatepassService {
  constructor(
    addGatepassUseCase,
    returnGatepassUseCase,
    editGatepassUseCase,
    getActiveGatepassUseCase,
    getAllSanctionUseCase,
    getAllGatepassUseCase,
    deleteAllGatepassUseCase
  ) {
    this.addGatepassUseCase = addGatepassUseCase;
    this.returnGatepassUseCase = returnGatepassUseCase;
    this.editGatepassUseCase = editGatepassUseCase;
    this.getActiveGatepassUseCase = getActiveGatepassUseCase;
    this.getAllSanctionUseCase = getAllSanctionUseCase;
    this.getAllGatepassUseCase = getAllGatepassUseCase;
    this.deleteAllGatepassUseCase = deleteAllGatepassUseCase;
  }

  async addGatepass(student_name, section, gatepass_code) {
    return this.addGatepassUseCase.execute(
      student_name,
      section,
      gatepass_code
    );
  }
  async returnGatepass(gatepass_code, student_name) {
    return this.returnGatepassUseCase.execute(gatepass_code, student_name);
  }
  async editGatepass(gatepass) {
    return this.editGatepassUseCase.execute(gatepass);
  }
  async getActiveGatepasses() {
    return this.getActiveGatepassUseCase.execute();
  }
  async getAllSanctions() {
    return await this.getAllSanctionUseCase.execute();
  }

  async getAllGatepass() {
    return await this.getAllGatepassUseCase.execute();
  }
  async deleteAllGatepass() {
    return await this.deleteAllGatepassUseCase.execute();
  }
}
