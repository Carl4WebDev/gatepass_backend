export default class GatepassController {
  constructor(gatepassService) {
    this.gatepassService = gatepassService;
  }

  async addGatepass(req, res) {
    try {
      const { student_name, section, gatepass_code } = req.body;

      // Validate required fields
      if (!student_name || !section || !gatepass_code) {
        return res.status(400).json({
          success: false,
          error: "Student name, section, and gatepass code are required",
        });
      }

      const gatepass = await this.gatepassService.addGatepass(
        student_name,
        section,
        gatepass_code
      );

      res.status(201).json({
        success: true,
        data: gatepass,
        message: "Gatepass issued successfully",
      });
    } catch (error) {
      console.error("Issue gatepass error:", error);

      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async returnGatepass(req, res) {
    try {
      const { gatepass_code, student_name } = req.body;

      if (!gatepass_code || !student_name) {
        return res.status(400).json({
          success: false,
          error: "Gatepass code and student name are required",
        });
      }

      const result = await this.gatepassService.returnGatepass(
        gatepass_code,
        student_name
      );

      res.json({
        success: true,
        data: result.gatepass,
        status: result.status,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async editGatepass(req, res) {
    try {
      const { id } = req.params;
      const { sanction_type, sanction_reason } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "Gatepass ID is required",
        });
      }

      const result = await this.gatepassService.editGatepass({
        gatepass_id: id,
        sanction_type,
        sanction_reason,
      });

      // ✅ Fix: Check if result exists, not result.gatepass
      if (!result) {
        return res.status(404).json({
          success: false,
          status: "not_found",
          message: "Gatepass not found",
        });
      }

      return res.json({
        success: true,
        data: result, // ✅ Return result directly
        message: "Sanction updated successfully",
      });
    } catch (error) {
      console.error("Error in editGatepass:", error);

      if (error.message === "Gatepass not found") {
        return res.status(404).json({
          success: false,
          error: "Gatepass not found",
        });
      }

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
  // GatepassController.js
  async getActiveGatepasses(req, res) {
    try {
      const activeGatepasses = await this.gatepassService.getActiveGatepasses();
      res.json({ success: true, data: activeGatepasses });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  getAllSanctions = async (req, res) => {
    try {
      const sanctions = await this.gatepassService.getAllSanctions();
      res.status(200).json({ success: true, data: sanctions });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  getAllGatepass = async (req, res) => {
    try {
      const gatepasses = await this.gatepassService.getAllGatepass();
      res.status(200).json({ success: true, data: gatepasses });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  async deleteAllGatepass(req, res) {
    try {
      const deleted =
        await this.gatepassService.deleteAllGatepassUseCase.execute();
      res.status(200).json({
        success: true,
        message: "All gatepasses deleted successfully.",
        data: deleted,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
