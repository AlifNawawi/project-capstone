import { API_BASE_URL, db } from '../../firebase';
import { fetchMoodHistory, fetchTestimonials } from '../../firebase-firestore';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { toZonedTime } from 'date-fns-tz';

export default class LandingSudahModel {
  async fetchMoodData() {
    try {
      const history = await fetchMoodHistory();
      return history;
    } catch (error) {
      return [];
    }
  }

  // async fetchUserData(uid) {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/auth/user/${uid}`, {
  //       method: 'GET',
  //       headers: { 'Content-Type': 'application/json' },
  //     });
  //     const data = await response.json();
  //     if (response.ok) {
  //       return { success: true, user: data.user };
  //     }
  //     return { success: false, error: data.error };
  //   } catch (error) {
  //     return { success: false, error: 'Gagal mengambil data pengguna' };
  //   }
  // }

  async fetchUserData(uid) {
    try {
      const user = auth.currentUser;
      if (user && user.uid === uid) {
        return {
          success: true,
          user: {
            uid: user.uid,
            email: user.email,
            username: user.displayName || 'Pengguna',
            // Tambahkan properti lain jika diperlukan
          },
        };
      }
      return { success: false, error: 'Pengguna tidak ditemukan' };
    } catch (error) {
      return { success: false, error: 'Gagal mengambil data pengguna' };
    }
  }

  async fetchTestimonials() {
    try {
      const testimonials = await fetchTestimonials(); // Gunakan nama yang diimpor
      return testimonials;
    } catch (error) {
      console.error('Error mengambil testimoni:', error);
      return [];
    }
  }

  subscribeToTestimonials(callback) {
    try {
      const q = query(collection(db, 'testimonials'), where('isDisplayed', '==', true));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const testimonials = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: toZonedTime(new Date(doc.data().timestamp), 'Asia/Jakarta'),
          }));
          callback(testimonials);
        },
        (error) => {
          console.error('Error mendengarkan testimoni:', error);
          callback([]);
        }
      );
      return unsubscribe;
    } catch (error) {
      console.error('Error mengatur listener testimoni:', error);
      callback([]);
      return () => { };
    }
  }
}