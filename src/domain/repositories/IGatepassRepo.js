export default class IGatepassRepo {
  async save(gatepass) {
    throw new Error("Method not implemented");
  }

  async findById(gatepass_id) {
    throw new Error("Method not implemented");
  }

  async findActiveByStudent(student_name) {
    throw new Error("Method not implemented");
  }

  async countActiveBySection(section) {
    throw new Error("Method not implemented");
  }

  async findByCodeAndSection(gatepass_code, section) {
    throw new Error("Method not implemented");
  }

  async findAll() {
    throw new Error("Method not implemented");
  }

  async deleteAll() {
    throw new Error("Method not implemented");
  }
}
