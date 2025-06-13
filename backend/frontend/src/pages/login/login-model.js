import { auth, signInWithPopup, signInWithEmailAndPassword } from '../../firebase';

export const loginModel = {
  async login(email, password) {
    try {
      console.log('Memulai login manual dengan email:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      console.log('Login manual berhasil:', user);
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'User',
          gender: '' // Gender tidak tersedia dari Firebase secara default
        }
      };
    } catch (error) {
      console.error('Error di login manual:', error);
      let errorMessage = 'Gagal login. Periksa email atau kata sandi.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Pengguna tidak ditemukan.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Kata sandi salah.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Format email tidak valid.';
      }
      return { success: false, error: errorMessage };
    }
  },

  async socialLogin(provider) {
    try {
      console.log('Memulai signInWithPopup untuk provider:', provider.providerId);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Login sosial berhasil:', user);
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'User',
          gender: ''
        }
      };
    } catch (error) {
      console.error('Error di socialLogin:', error);
      let errorMessage = 'Gagal login dengan sosial media.';
      if (error.code === 'auth/email-already-exists') {
        errorMessage = 'Silahkan login, akun sudah ada.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Jendela login ditutup sebelum selesai.';
      }
      return { success: false, error: errorMessage };
    }
  },

  async handleRedirectResult() {
    console.log('handleRedirectResult tidak digunakan untuk popup');
    return null;
  }
};