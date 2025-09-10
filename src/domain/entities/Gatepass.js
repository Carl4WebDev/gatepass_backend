export default class Gatepass {
  constructor({
    gatepass_id,
    student_name,
    section,
    gatepass_code,
    time_out,
    time_in = null,
    expected_return_time,
    is_sanctioned = false,
    sanction_type = null,
    sanction_reason = null,
    late_minutes = null,
    is_active = true,
    created_at,
  }) {
    this.gatepass_id = gatepass_id;
    this.student_name = student_name;
    this.section = section;
    this.gatepass_code = gatepass_code;
    this.time_out = time_out || new Date();
    this.time_in = time_in;
    this.expected_return_time = expected_return_time;
    this.is_sanctioned = is_sanctioned;
    this.sanction_type = sanction_type;
    this.sanction_reason = sanction_reason;
    this.late_minutes = late_minutes;
    this.is_active = is_active;
    this.created_at = created_at || new Date();
  }

  // Helper methods
  isLate() {
    if (!this.time_in) return false;
    return this.time_in > this.expected_return_time;
  }

  markReturned() {
    this.time_in = new Date();
    this.is_active = false;
  }
}
