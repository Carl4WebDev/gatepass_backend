import ExcelJS from "exceljs";
export default class GatepassController {
  constructor(
    getSanctionedGatepassesUseCase,
    getNotSanctionedGatepassesUseCase,
    getAllGatepassesUseCase
  ) {
    this.getSanctionedGatepassesUseCase = getSanctionedGatepassesUseCase;
    this.getNotSanctionedGatepassesUseCase = getNotSanctionedGatepassesUseCase;
    this.getAllGatepassesUseCase = getAllGatepassesUseCase;
  }

  // 🔹 Reusable export function (with dynamic columns)
  async exportToExcel(data, filename, res, columns) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Gatepasses");

    sheet.columns = columns;

    // ✅ Add rows and format dates
    sheet.addRows(
      data.map((gp) => ({
        student_name: gp.student_name,
        section: gp.section,
        gatepass_code: gp.gatepass_code,
        time_out: gp.time_out ? new Date(gp.time_out).toLocaleString() : null,
        time_in: gp.time_in ? new Date(gp.time_in).toLocaleString() : null,
        expected_return_time: gp.expected_return_time
          ? new Date(gp.expected_return_time).toLocaleString()
          : null,
        is_sanctioned: gp.is_sanctioned ? "Yes" : "No",
        sanction_type: gp.sanction_type || "",
        sanction_reason: gp.sanction_reason || "",
        late_minutes: gp.late_minutes ?? 0,
      }))
    );

    // ✅ Send Excel file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${filename}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  // 🔹 Controller Endpoints
  async exportSanctioned(req, res) {
    const data = await this.getSanctionedGatepassesUseCase.execute();
    return this.exportToExcel(data, "sanctioned_students", res, [
      { header: "Student Name", key: "student_name", width: 25 },
      { header: "Section", key: "section", width: 20 },
      { header: "Gatepass Code", key: "gatepass_code", width: 20 },
      { header: "Time Out", key: "time_out", width: 25 },
      { header: "Time In", key: "time_in", width: 25 },
      { header: "Expected Return", key: "expected_return_time", width: 25 },
      { header: "Sanctioned?", key: "is_sanctioned", width: 15 },
      { header: "Sanction Type", key: "sanction_type", width: 20 },
      { header: "Sanction Reason", key: "sanction_reason", width: 30 },
      { header: "Late Minutes", key: "late_minutes", width: 15 },
    ]);
  }

  async exportNotSanctioned(req, res) {
    const data = await this.getNotSanctionedGatepassesUseCase.execute();
    return this.exportToExcel(data, "not_sanctioned_students", res, [
      { header: "Student Name", key: "student_name", width: 25 },
      { header: "Section", key: "section", width: 20 },
      { header: "Gatepass Code", key: "gatepass_code", width: 20 },
      { header: "Time Out", key: "time_out", width: 25 },
      { header: "Time In", key: "time_in", width: 25 },
      { header: "Expected Return", key: "expected_return_time", width: 25 },
    ]);
  }

  async exportAll(req, res) {
    const data = await this.getAllGatepassesUseCase.execute();
    return this.exportToExcel(data, "all_gatepass_students", res, [
      { header: "Student Name", key: "student_name", width: 25 },
      { header: "Section", key: "section", width: 20 },
      { header: "Gatepass Code", key: "gatepass_code", width: 20 },
      { header: "Time Out", key: "time_out", width: 25 },
      { header: "Time In", key: "time_in", width: 25 },
      { header: "Expected Return", key: "expected_return_time", width: 25 },
      { header: "Sanctioned?", key: "is_sanctioned", width: 15 },
      { header: "Sanction Type", key: "sanction_type", width: 20 },
      { header: "Sanction Reason", key: "sanction_reason", width: 30 },
      { header: "Late Minutes", key: "late_minutes", width: 15 },
    ]);
  }

  // ✅ Optional JSON endpoints
  async getSanctioned(req, res) {
    const data = await this.getSanctionedGatepassesUseCase.execute();
    return res.json(data);
  }

  async getNotSanctioned(req, res) {
    const data = await this.getNotSanctionedGatepassesUseCase.execute();
    return res.json(data);
  }

  async getAll(req, res) {
    const data = await this.getAllGatepassesUseCase.execute();
    return res.json(data);
  }
}
