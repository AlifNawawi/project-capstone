import { registerModel } from "./register-model";
import { loginModel } from "../login/login-model";

export class RegisterPresenter {
  constructor(view) {
    this.view = view;
  }

  async register(username, email, password, gender) {
    console.log('Memulai registrasi manual:', JSON.stringify({ username, email, gender }, null, 2));
    const result = await registerModel.register(username, email, password, gender);
    if (result.success) {
      this.view.onRegisterSuccess(result.user);
    } else {
      if (result.error === 'Email sudah terdaftar.') {
        this.view.onRegisterError('Silahkan login, akun sudah ada.');
      } else {
        this.view.onRegisterError(result.error);
      }
    }
  }

  async handleSocialLogin(provider) {
    try {
      console.log('Memulai autentikasi sosial dengan provider:', provider.providerId);
      const result = await loginModel.socialLogin(provider);
      if (result.success) {
        const updateResult = await registerModel.updateUserData(
          result.user.uid,
          result.user.displayName || 'User',
          ''
        );
        if (updateResult.success) {
          this.view.onRegisterSuccess({
            username: result.user.displayName || 'User',
            email: result.user.email,
            gender: '',
          });
        } else {
          this.view.onRegisterError(updateResult.error);
        }
      } else {
        if (result.error === 'Silahkan login, akun sudah ada.') {
          this.view.onRegisterError('Silahkan login, akun sudah ada.');
        } else {
          this.view.onRegisterError(result.error);
        }
      }
    } catch (error) {
      console.error('Error di handleSocialLogin:', error.message, error.stack);
      this.view.onRegisterError('Gagal login dengan sosial media');
    }
  }
}