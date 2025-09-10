export default class AuthService {
  constructor(loginUseCase) {
    this.loginUseCase = loginUseCase;
  }

  login(credentials) {
    return this.loginUseCase.execute(credentials);
  }
}
