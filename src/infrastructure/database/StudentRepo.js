export default class StudentRepo {
  constructor(pool) {
    this.pool = pool;
  }

  async searchStudents(query) {
    const searchQuery = `
    SELECT student_id, student_name, section
    FROM students 
    WHERE student_name ILIKE $1
      OR section ILIKE $1
      OR CAST(student_id AS TEXT) ILIKE $1
    ORDER BY student_name
    LIMIT 10
  `;
    try {
      const result = await this.pool.query(searchQuery, [`%${query}%`]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to search students: ${error.message}`);
    }
  }
}
