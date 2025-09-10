export default class StudentController {
  constructor(studentRepo) {
    this.studentRepo = studentRepo;
  }

  async searchStudents(req, res) {
    try {
      const { q } = req.query;

      if (!q || q.length < 2) {
        return res.json({ success: true, data: [] });
      }

      const students = await this.studentRepo.searchStudents(q);

      res.json({
        success: true,
        data: students,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}
