export default class AuthController {
  constructor(authService) {
    this.authService = authService;
  }
  async loginWithRole(req, res, expectedRole) {
    try {
      const { email, password } = req.body;
      const userData = await this.authService.login({ email, password });

      // ✅ Ensure user logs in to the correct portal
      if (userData.role !== expectedRole) {
        return res.status(403).json({
          message: `Access denied for ${userData.role} on ${expectedRole} portal`,
        });
      }

      res.status(200).json(userData);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
