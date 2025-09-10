import IGatepassRepo from "../../domain/repositories/IGatepassRepo.js";
import Gatepass from "../../domain/entities/Gatepass.js";

export default class GatepassRepo extends IGatepassRepo {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async save(gatepass) {
    // ✅ CHECK if this is an UPDATE or INSERT
    if (gatepass.gatepass_id) {
      return await this.update(gatepass);
    } else {
      return await this.insert(gatepass);
    }
  }

  // ✅ NEW METHOD: Update existing record
  async update(gatepass) {
    const query = `
      UPDATE gatepasses 
      SET time_in = $1, 
          is_sanctioned = $2, 
          sanction_type = $3, 
          sanction_reason = $4, 
          late_minutes = $5, 
          is_active = $6
      WHERE gatepass_id = $7
      RETURNING *
    `;

    const values = [
      gatepass.time_in,
      gatepass.is_sanctioned,
      gatepass.sanction_type,
      gatepass.sanction_reason,
      gatepass.late_minutes,
      gatepass.is_active,
      gatepass.gatepass_id,
    ];

    try {
      const result = await this.pool.query(query, values);
      return this.toEntity(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to update gatepass: ${error.message}`);
    }
  }

  // ✅ RENAMED: Insert new record
  async insert(gatepass) {
    const query = `
      INSERT INTO gatepasses 
      (student_name, section, gatepass_code, time_out, time_in, 
       is_sanctioned, sanction_type, sanction_reason, late_minutes, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      gatepass.student_name,
      gatepass.section,
      gatepass.gatepass_code,
      gatepass.time_out,
      gatepass.time_in,
      gatepass.is_sanctioned,
      gatepass.sanction_type,
      gatepass.sanction_reason,
      gatepass.late_minutes,
      gatepass.is_active,
    ];

    try {
      const result = await this.pool.query(query, values);
      return this.toEntity(result.rows[0]);
    } catch (error) {
      if (
        error.code === "23505" &&
        error.constraint === "unique_active_student"
      ) {
        throw new Error(
          `Student ${gatepass.student_name} already has an active gatepass`
        );
      }
      throw error;
    }
  }

  // ✅ NEW METHOD: Find by ID for updates
  async findById(gatepass_id) {
    const query = `
      SELECT * FROM gatepasses 
      WHERE gatepass_id = $1
      LIMIT 1
    `;

    const result = await this.pool.query(query, [gatepass_id]);
    return result.rows.length > 0 ? this.toEntity(result.rows[0]) : null;
  }

  async findActiveByStudent(student_name) {
    const query = `
      SELECT * FROM gatepasses 
      WHERE student_name = $1 AND is_active = true
      LIMIT 1
    `;

    const result = await this.pool.query(query, [student_name]);
    return result.rows.length > 0 ? this.toEntity(result.rows[0]) : null;
  }

  async hasStudentUsedGatepass(student_name) {
    const query = `
    SELECT * FROM gatepasses 
    WHERE student_name = $1
    LIMIT 1
  `;

    const result = await this.pool.query(query, [student_name]);
    return result.rows.length > 0; // Returns TRUE if student has ANY gatepass record
  }

  async countActiveBySection(section) {
    const query = `
      SELECT COUNT(*) FROM gatepasses 
      WHERE section = $1 AND is_active = true
    `;

    const result = await this.pool.query(query, [section]);
    return parseInt(result.rows[0].count);
  }

  async findByCodeAndSection(gatepass_code, section) {
    const query = `
    SELECT * FROM gatepasses 
    WHERE gatepass_code = $1 AND section = $2 AND is_active = true
    LIMIT 1
  `;

    const result = await this.pool.query(query, [gatepass_code, section]);
    return result.rows.length > 0 ? this.toEntity(result.rows[0]) : null;
  }
  async findAll() {
    const query = `SELECT * FROM gatepasses ORDER BY created_at DESC`;
    const result = await this.pool.query(query);
    return result.rows.map((row) => this.toEntity(row));
  }

  async deleteAll() {
    const query = `DELETE FROM gatepasses`;
    await this.pool.query(query);
    return { message: "All gatepasses deleted" };
  }

  toEntity(row) {
    return new Gatepass({
      gatepass_id: row.gatepass_id,
      student_name: row.student_name,
      section: row.section,
      gatepass_code: row.gatepass_code,
      time_out: row.time_out,
      time_in: row.time_in,
      expected_return_time: row.expected_return_time,
      is_sanctioned: row.is_sanctioned,
      sanction_type: row.sanction_type,
      sanction_reason: row.sanction_reason,
      late_minutes: row.late_minutes,
      is_active: row.is_active,
      created_at: row.created_at,
    });
  }

  async modifyGatepass(gatepass_id, updates) {
    const query = `
    UPDATE gatepasses
    SET sanction_type = $1,
        sanction_reason = $2,
        late_minutes = $3,
        is_active = $4 
    WHERE gatepass_id = $5
    RETURNING *;
  `;

    const values = [
      updates.sanction_type,
      updates.sanction_reason,
      updates.late_minutes,
      updates.is_active,
      gatepass_id,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findByGatepassId(gatepass_id) {
    // Validate input
    if (!gatepass_id || isNaN(gatepass_id)) {
      throw new Error("Valid gatepass ID is required");
    }

    const query = `
    SELECT * FROM gatepasses 
    WHERE gatepass_id = $1
    LIMIT 1
  `;

    try {
      const result = await this.pool.query(query, [13]);

      if (result.rows.length === 0) {
        return null;
      }

      return this.toEntity(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to retrieve gatepass: ${error.message}`);
    }
  }

  // GatepassRepository.js
  async findAllActive() {
    const result = await this.pool.query(
      "SELECT * FROM gatepasses WHERE is_active = true ORDER BY time_out DESC"
    );
    return result.rows;
  }

  async getAllSanctions() {
    const query = `
  SELECT *
  FROM gatepasses
  WHERE is_sanctioned = true
  ORDER BY expected_return_time DESC;
`;

    const { rows } = await this.pool.query(query);
    return rows;
  }

  async findSanctionedGatepasses() {
    const result = await this.pool.query(
      "SELECT * FROM gatepasses WHERE is_sanctioned = true"
    );
    return result.rows; // ✅ return array only
  }

  async findNotSanctionedGatepasses() {
    const result = await this.pool.query(
      "SELECT * FROM gatepasses WHERE is_sanctioned = false"
    );
    return result.rows; // ✅ return array only
  }

  async findAllGatepasses() {
    const result = await this.pool.query(
      `SELECT * FROM gatepasses WHERE is_active = false ORDER BY is_sanctioned ASC, created_at DESC
        `
    );

    return result.rows; // ✅ return array only
  }
  // ✅ Delete all gatepasses
  async deleteAllGatepass() {
    const query = "DELETE FROM gatepasses RETURNING *";
    try {
      const result = await this.pool.query(query);
      return result.rows; // return deleted rows if needed
    } catch (error) {
      throw new Error(`Failed to delete all gatepasses: ${error.message}`);
    }
  }
}
