import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  auth,
  storage,
  uploadProfilePhoto,
  deleteProfilePhoto,
  getProfilePhoto,
  updateProfile,
} from '../../../firebase';
import { logout } from '../../../firebase';

const WebProfileComponent = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [newDisplayName, setNewDisplayName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoading(false);
      if (user) {
        const profileData = await getProfilePhoto(user.uid);
        setUser({ ...user, photoURL: profileData.photoURL });
        setNewDisplayName(user.displayName || '');
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
    setIsProfileOpen(false);
  };

  const closeProfileModal = () => setIsProfileModalOpen(false);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setNotification({ message: 'Berhasil logout', type: 'success' });
      navigate('/login');
    } else {
      setNotification({
        message: 'Gagal logout: ' + result.error,
        type: 'error',
      });
    }
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && auth.currentUser) {
      setLoading(true);
      try {
        const photoURL = await uploadProfilePhoto(file, auth.currentUser.uid);
        await updateProfile(auth.currentUser.uid, { photoURL });
        setUser((prev) => ({ ...prev, photoURL }));
        setNotification({ message: 'Foto berhasil diganti', type: 'success' });
      } catch (error) {
        setNotification({
          message: 'Gagal mengganti foto: ' + error.message,
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    } else {
      setNotification({
        message: 'Pengguna tidak diautentikasi',
        type: 'error',
      });
    }
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const handleRemovePhoto = async () => {
    if (auth.currentUser) {
      setLoading(true);
      try {
        await deleteProfilePhoto(auth.currentUser.uid);
        await updateProfile(auth.currentUser.uid, { photoURL: '/profile.png' });
        setUser((prev) => ({ ...prev, photoURL: '/profile.png' }));
        setNotification({
          message: 'Foto dihapus, kembali ke default',
          type: 'success',
        });
      } catch (error) {
        setNotification({
          message: 'Gagal menghapus foto: ' + error.message,
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    }
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const handleSaveName = async () => {
    if (newDisplayName.trim() && newDisplayName !== user.displayName) {
      setLoading(true);
      try {
        await updateProfile(auth.currentUser.uid, {
          displayName: newDisplayName,
        });
        setUser((prev) => ({ ...prev, displayName: newDisplayName }));
        setNotification({ message: 'Nama berhasil diganti', type: 'success' });
      } catch (error) {
        setNotification({
          message: 'Gagal mengganti nama: ' + error.message,
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    } else {
      setNotification({
        message: 'Nama tidak boleh kosong atau sama',
        type: 'error',
      });
    }
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="relative flex gap-3">
      <div
        className="hidden md:flex items-center space-x-2 cursor-pointer"
        onClick={toggleProfile}
      >
        <span className="font-semibold text-sm md:text-base">
          Halo, {user.displayName || 'User'}!
        </span>
        <img
          src={user.photoURL || '/profile.png'}
          alt="Profile"
          className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white cursor-pointer"
          onError={(e) => {
            e.target.src = '/profile.png';
          }}
        />
      </div>

      {isProfileOpen && (
        <ul className="absolute right-0 mt-12 bg-white rounded-md shadow-md text-sm py-2 w-48 z-20">
          <li>
            <button
              onClick={openProfileModal}
              className="w-full text-left block px-4 py-2 hover:bg-purple-100 cursor-pointer"
            >
              Profil Saya
            </button>
          </li>
          <li>
            <button
              onClick={() => (confirm('Ingin Logout?') ? handleLogout() : null)}
              className="w-full text-left block px-4 py-2 hover:bg-purple-100 cursor-pointer"
            >
              Keluar
            </button>
          </li>
        </ul>
      )}

      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 cursor-pointer"
              onClick={closeProfileModal}
              aria-label="Close modal"
              onKeyDown={(e) => e.key === 'Escape' && closeProfileModal()}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Detail Profil
            </h2>
            <div className="flex flex-col items-center space-y-4">
              <img
                src={user.photoURL || '/profile.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = '/profile.png';
                }}
              />
              <div className="flex gap-4">
                <label className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 cursor-pointer">
                  Ganti foto
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                <button
                  onClick={handleRemovePhoto}
                  className="border border-purple-600 text-purple-600 px-4 py-2 rounded-full hover:bg-purple-100 cursor-pointer"
                >
                  Hapus
                </button>
              </div>
              <div className="w-full space-y-3 mt-4">
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                  <input
                    type="text"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    className="flex-1 bg-transparent text-gray-800 outline-none"
                  />
                  <span className="text-gray-500">👤</span>
                </div>
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                  <span className="flex-1 text-gray-800">{user.email}</span>
                  <span className="text-gray-500">✉️</span>
                </div>
                {user.gender && (
                  <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                    <span className="flex-1 text-gray-800">{user.gender}</span>
                    <span className="text-gray-500">⚥</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleSaveName}
                className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {notification.message && (
        <div
          className={`fixed top-4 right-4 p-2 rounded ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default WebProfileComponent;
