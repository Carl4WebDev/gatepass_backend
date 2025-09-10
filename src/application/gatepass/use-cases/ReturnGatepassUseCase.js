export default class ReturnGatepassUseCase {
  constructor(gatepassRepo) {
    this.gatepassRepo = gatepassRepo;
  }

  async execute(gatepass_code, student_name) {
    const gatepass = await this.gatepassRepo.findActiveByStudent(student_name);

    if (!gatepass || gatepass.gatepass_code !== gatepass_code) {
      throw new Error("Active gatepass not found for this student");
    }

    // Mark returned
    gatepass.time_in = new Date();
    gatepass.is_active = false;

    // ✅ NEW: Automatic sanction detection
    const returnTime = new Date(gatepass.time_in);
    const expectedReturn = new Date(gatepass.expected_return_time);
    const isLate = returnTime > expectedReturn;

    if (isLate) {
      const minutesLate = Math.round((returnTime - expectedReturn) / 60000);
      gatepass.is_sanctioned = true;
      gatepass.sanction_type = "DNR";
      gatepass.late_minutes = minutesLate;
    }

    return await this.gatepassRepo.save(gatepass);
  }
}
