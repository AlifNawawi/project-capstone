import { loginModel } from "./login-model";
import { registerModel } from "../register/register-model";

export class LoginPresenter {
  constructor(view) {
    this.view = view;
  }

  async login(email, password) {
    console.log('Memulai login manual:', { email });
    const result = await loginModel.login(email, password);
    if (result.success) {
      // Perbarui data pengguna di backend
      const updateResult = await registerModel.updateUserData(
        result.user.uid,
        result.user.displayName || 'User',
        result.user.gender || ''
      );
      if (updateResult.success) {
        this.view.onLoginSuccess(result.user);
      } else {
        this.view.onLoginError(updateResult.error);
      }
    } else {
      this.view.onLoginError(result.error);
    }
  }

  async handleSocialLogin(provider) {
    try {
      console.log('Memulai autentikasi sosial dengan provider:', provider.providerId);
      const result = await loginModel.socialLogin(provider);
      if (result.success) {
        // Simpan data tambahan ke backend
        const updateResult = await registerModel.updateUserData(
          result.user.uid,
          result.user.displayName || 'User',
          result.user.gender || ''
        );
        if (updateResult.success) {
          return result;
        } else {
          this.view.onLoginError(updateResult.error);
          return { success: false, error: updateResult.error };
        }
      }
      this.view.onLoginError(result.error);
      return result;
    } catch (error) {
      console.error('Error di handleSocialLogin:', error);
      this.view.onLoginError(error.message || 'Gagal login dengan sosial media');
      return { success: false, error: error.message || 'Gagal login dengan sosial media' };
    }
  }
}