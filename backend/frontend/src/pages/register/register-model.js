import { API_BASE_URL } from '../../firebase';

export const registerModel = {
  async register(username, email, password, gender) {
    console.log('Mengirim register:', JSON.stringify({ username, email, password, gender }, null, 2));
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, gender }),
      });
      console.log('Respons dari server:', response.status, response.statusText);
      const data = await response.json();
      if (response.ok) {
        return { success: true, user: data.user };
      }
      // console.error('Error dari server di register:', data.error, data.details);
      return { success: false, error: data.details || data.error || 'Registrasi gagal' };
    } catch (error) {
      console.error('Error di register:', error.message, error.stack);
      if (error.message === 'Failed to fetch') {
        return { success: false, error: 'Tidak dapat terhubung ke server. Pastikan backend berjalan di http://localhost:5000' };
      }
      return { success: false, error: 'Gagal terhubung ke server' };
    }
  },

  async verifyToken(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, uid: data.uid };
      }
      console.error('Error dari server di verifyToken:', data.error, data.details);
      return { success: false, error: data.details || data.error || 'Verifikasi token gagal' };
    } catch (error) {
      console.error('Error di verifyToken:', error.message, error.stack);
      return { success: false, error: 'Gagal memverifikasi token' };
    }
  },

  async updateUserData(uid, username, gender) {
    try {
      console.log('Mengirim data ke update-user:', JSON.stringify({ uid, username, gender }, null, 2));
      const response = await fetch(`${API_BASE_URL}/auth/update-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, username, gender }),
      });
      console.log('Respons dari update-user:', response.status, response.statusText);
      const data = await response.json();
      if (response.ok) {
        return { success: true };
      }
      console.error('Error dari server di updateUserData:', data.error, data.details);
      return { success: false, error: data.details || data.error || 'Gagal memperbarui data pengguna' };
    } catch (error) {
      console.error('Error di updateUserData:', error.message, error.stack);
      return { success: false, error: 'Gagal terhubung ke server' };
    }
  },
};