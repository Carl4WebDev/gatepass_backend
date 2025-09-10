import Gatepass from "../../../domain/entities/Gatepass.js";

export default class AddGatepassUseCase {
  constructor(gatepassRepo) {
    this.gatepassRepo = gatepassRepo;
  }
  async execute(student_name, section, gatepass_code) {
    // Validate inputs
    if (!student_name || !section || !gatepass_code) {
      throw new Error("Student name, section, and gatepass code are required");
    }

    const hasAlreadyUsedGatepass =
      await this.gatepassRepo.hasStudentUsedGatepass(student_name);
    if (hasAlreadyUsedGatepass) {
      throw new Error(`Student has already used a gatepass`);
    }

    // Check if student already has active gatepass
    const activePass = await this.gatepassRepo.findActiveByStudent(
      student_name
    );
    if (activePass) {
      throw new Error(`Student ${student_name} already has an active gatepass`);
    }

    // Check section capacity (max 2 active gatepasses)
    const activeCount = await this.gatepassRepo.countActiveBySection(section);
    if (activeCount >= 2) {
      throw new Error(`Section ${section} has no available gatepasses (max 2)`);
    }

    // Check if gatepass code already used in this section
    const existingCode = await this.gatepassRepo.findByCodeAndSection(
      gatepass_code,
      section
    );
    if (existingCode) {
      throw new Error(
        `Gatepass code ${gatepass_code} already used in section ${section}`
      );
    }

    // Create new gatepass
    const gatepass = new Gatepass({
      student_name,
      section,
      gatepass_code,
      time_out: new Date(),
    });

    // Save to database
    return await this.gatepassRepo.save(gatepass);
  }
}
