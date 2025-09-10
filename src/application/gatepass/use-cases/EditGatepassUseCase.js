export default class EditGatepassUseCase {
  constructor(gatepassRepo) {
    this.gatepassRepo = gatepassRepo;
  }

  /**
   * Updates an existing gatepass with sanction details.
   * @param {Object} gatepass - Gatepass update data
   * @param {number} gatepass.gatepass_id - ID of the gatepass
   * @param {string} [gatepass.sanction_type] - e.g. "DNR" or "LATE"
   * @param {string} [gatepass.sanction_reason] - Reason for sanction
   * @param {number} [gatepass.late_minutes] - How many minutes late
   * @param {boolean} [gatepass.is_active] - Whether the gatepass is active
   */
  async execute(gatepass) {
    const gatepassDb = await this.gatepassRepo.findById(gatepass.gatepass_id);

    const returnTime = new Date();
    const minutesLate = Math.round(
      (returnTime - gatepassDb.expected_return_time) / 60000
    );

    // Validate
    if (!gatepass.gatepass_id) {
      throw new Error("gatepass_id is required to update a record");
    }

    // Build update object
    const updates = {
      sanction_type: gatepass.sanction_type || "DNR", // default if not provided
      sanction_reason: gatepass.sanction_reason || null,
      late_minutes: minutesLate,
      is_active: gatepass.is_active ?? false, // defaults to false when sanction is applied
    };

    // Call repository method (handles DB update)
    return await this.gatepassRepo.modifyGatepass(
      gatepass.gatepass_id,
      updates
    );
  }
}
