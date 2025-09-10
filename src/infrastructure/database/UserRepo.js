export default class UserRepo {
  constructor(pool) {
    this.pool = pool;
  }

  async findByEmail(email) {
    const result = await this.pool.query(
      "SELECT * FROM admin a WHERE a.email = $1",
      [email]
    );
    return result.rows[0];
  }
}
