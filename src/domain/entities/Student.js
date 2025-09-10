export default class Student {
  constructor({ student_id, student_name, section }) {
    this.student_id = student_id;
    this.student_name = student_name;
    this.section = section;
  }

  // Helper method for display
  getDisplayText() {
    return `${this.student_name} (${this.student_id}) - ${this.section}`;
  }

  // Helper method for search highlighting
  matchesQuery(query) {
    const lowerQuery = query.toLowerCase();
    return (
      this.student_id.toString().toLowerCase().includes(lowerQuery) ||
      this.student_name.toLowerCase().includes(lowerQuery) ||
      this.section.toLowerCase().includes(lowerQuery)
    );
  }
}
