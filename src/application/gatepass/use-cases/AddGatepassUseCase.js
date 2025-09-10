import Gatepass from "../../../domain/entities/Gatepass.js";

export default class AddGatepassUseCase {
  constructor(gatepassRepo) {
    this.gatepassRepo = gatepassRepo;
  }

  sanitizeName(input) {
    if (typeof input !== "string") return "";
    return input
      .trim()
      .replace(/[^A-Za-z\s]/g, " ") // remove dashes, numbers, special chars
      .replace(/\s+/g, " ") // collapse multiple spaces
      .toUpperCase()
      .trim();
  }

  sanitizeSection(input) {
    if (typeof input !== "string") return "";
    return input
      .trim()
      .replace(/[^A-Za-z0-9]/g, "") // keep only letters+numbers
      .toUpperCase();
  }

  validateGatepassCode(input) {
    if (typeof input !== "string") return "";
    let code = input.trim();

    // Auto-correct
    if (code === "01") code = "1";
    if (code === "02") code = "2";

    if (code !== "1" && code !== "2") {
      throw new Error("Gatepass code must be '1' or '2'");
    }

    return code;
  }

  async execute(student_name, section, gatepass_code) {
    // Sanitize inputs
    student_name = this.sanitizeName(student_name);
    section = this.sanitizeSection(section);
    gatepass_code = this.validateGatepassCode(gatepass_code);

    if (!student_name || !section || !gatepass_code) {
      throw new Error("Student name, section, and gatepass code are required");
    }

    // Checks (same as before)
    const hasAlreadyUsedGatepass =
      await this.gatepassRepo.hasStudentUsedGatepass(student_name);
    if (hasAlreadyUsedGatepass) {
      throw new Error(`Student has already used a gatepass`);
    }

    const activePass = await this.gatepassRepo.findActiveByStudent(
      student_name
    );
    if (activePass) {
      throw new Error(`Student ${student_name} already has an active gatepass`);
    }

    const activeCount = await this.gatepassRepo.countActiveBySection(section);
    if (activeCount >= 2) {
      throw new Error(`Section ${section} has no available gatepasses (max 2)`);
    }

    const existingCode = await this.gatepassRepo.findByCodeAndSection(
      gatepass_code,
      section
    );
    if (existingCode) {
      throw new Error(
        `Gatepass code ${gatepass_code} is already in use for section ${section}`
      );
    }

    const gatepass = new Gatepass({
      student_name,
      section,
      gatepass_code,
      time_out: new Date(),
    });

    return await this.gatepassRepo.save(gatepass);
  }
}
