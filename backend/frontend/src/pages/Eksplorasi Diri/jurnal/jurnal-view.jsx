import React, { useState, useEffect } from 'react';
import Aside from '../../../components/Eksplorasi Diri/General/Aside';
import Profile from '../../../components/Eksplorasi Diri/General/profile';
import ProfileWeb from '../../../components/Eksplorasi Diri/General/profile-web';
import JurnalPresenter from './jurnal-presnter';
import JurnalModel from './jurnal-model';
import { fetchJournalHistory } from '../../../firebase-firestore';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import id from 'date-fns/locale/id';
import Header from '../../../components/Eksplorasi Diri/General/Header';
import AlertSuccess from '../../../components/General/AlertSuccess';
import AlertFailed from '../../../components/General/AlertFaill';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.props.setError(
      `Terjadi error: ${error.message}. Silakan coba lagi atau refresh halaman.`,
    );
    this.setState({ hasError: false });
  }

  render() {
    return this.props.children;
  }
}

const JurnalView = ({
  isAuthenticated,
  success,
  error,
  setSuccess,
  setError,
  onDismissSuccess,
  onDismissError,
}) => {
  const [jurnalHariIni, setJurnalHariIni] = useState('');
  const [mood, setMood] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [journalHistory, setJournalHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    toZonedTime(new Date(), 'Asia/Jakarta'),
  );
  const [editingJournal, setEditingJournal] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [journalIdToDelete, setJournalIdToDelete] = useState(null);

  const model = new JurnalModel();
  const presenter = new JurnalPresenter(model, {
    updateMood: (newMood, newConfidence) => {
      setMood(newMood);
      setConfidence(newConfidence);
    },
    clearInput: () => {
      setJurnalHariIni('');
      setEditingJournal(null);
    },
    showSuccess: (message) => setSuccess(message),
    showError: (message) => setError(message),
    renderJournalList: (history) => setJournalHistory(history),
  });

  useEffect(() => {
    if (isAuthenticated) {
      const loadInitialHistory = async () => {
        try {
          const history = await model.getJournalHistory();
          setJournalHistory(history);
        } catch (err) {
          setError('Gagal memuat riwayat jurnal awal.');
        }
      };
      loadInitialHistory();

      const { unsubscribe } = fetchJournalHistory((history) => {
        setJournalHistory(history);
      });
      return () => unsubscribe();
    }
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    setJurnalHariIni(e.target.value);
  };

  const handleSubmit = () => {
    if (!isAuthenticated) {
      setError('Silakan login terlebih dahulu!');
      return;
    }
    if (!jurnalHariIni.trim()) {
      setError('Jurnal tidak boleh kosong!');
      return;
    }
    setError('');
    setSuccess('');
    presenter.handleSubmit(jurnalHariIni);
  };

  const handleEdit = (journal) => {
    setEditingJournal(journal);
    setJurnalHariIni(journal.text);
  };

  const handleSaveEdit = () => {
    if (!isAuthenticated) {
      setError('Silakan login terlebih dahulu!');
      return;
    }
    if (!jurnalHariIni.trim()) {
      setError('Jurnal tidak boleh kosong!');
      return;
    }
    if (editingJournal) {
      setError('');
      setSuccess('');
      presenter.handleEdit(editingJournal.id, jurnalHariIni);
    }
  };

  const handleDelete = (journalId) => {
    if (!isAuthenticated) {
      setError('Silakan login terlebih dahulu!');
      return;
    }
    setJournalIdToDelete(journalId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (journalIdToDelete) {
      setError('');
      setSuccess('');
      presenter.handleDelete(journalIdToDelete);
      setIsDeleteModalOpen(false);
      setJournalIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setJournalIdToDelete(null);
  };

  const getMoodEmoji = (mood) => {
    const moodMap = {
      angry: '/emoji/angry.png',
      fear: '/emoji/sad.png',
      happy: '/emoji/happy.png',
      love: '/emoji/very-happy.png',
      sadness: '/emoji/very-sad.png',
    };
    return moodMap[mood] || '/emoji/happy.png';
  };

  return (
    <ErrorBoundary setError={setError}>
      <div className="flex h-screen">
        <Aside />
        <div className="flex-1 flex flex-col bg-[#f0f0ff] overflow-y-auto">
          <Header title="Jurnal Harian" setIsSidebarOpen={setIsSidebarOpen} />
          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 bg-opacity-40 md:hidden">
              <div className="w-3/4 max-w-sm h-full bg-[#f0f0ff] p-4 shadow-lg relative">
                <button
                  className="absolute top-4 right-4 text-lg md:text-xl font-bold cursor-pointer"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  ×
                </button>
                <div className="mt-10 mb-6 text-center">
                  <img
                    src="/profile.png"
                    alt="Profile"
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full mx-auto border"
                  />
                  <h2 className="mt-2 font-semibold text-base md:text-lg">
                    Halo, Daniel!
                  </h2>
                  <Profile />
                </div>
                <hr className="my-4 border-gray-300" />
                <nav className="space-y-4 px-2">
                  {[
                    {
                      label: 'Beranda',
                      path: '/',
                      icon: '/icons/home-mobile.png',
                    },
                    {
                      label: 'Catatan Mood',
                      path: '/catatan',
                      icon: '/icons/catatan-mobile.png',
                    },
                    {
                      label: 'Jurnal Harian',
                      path: '/jurnal',
                      icon: '/icons/jurnal-mobile.png',
                    },
                    {
                      label: 'Refleksi Diri',
                      path: '/refleksi',
                      icon: '/icons/refleksi-mobile.png',
                    },
                  ].map((item) => (
                    <a
                      key={item.path}
                      href={item.path}
                      className="flex items-center space-x-3 text-gray-700 font-medium hover:text-purple-500 text-sm md:text-base"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <img
                        src={item.icon}
                        alt={item.label}
                        className="w-4 h-4 md:w-5 md:h-5"
                      />
                      <span>{item.label}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          )}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="col-span-2 space-y-4">
              <section className="bg-white p-4 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-2 flex items-center">
                  📝 Jurnal Hari Ini
                </h2>
                {success && (
                  <div className="mb-4">
                    <AlertSuccess
                      message={success}
                      autoDismiss={true}
                      duration={5000}
                      onDismiss={onDismissSuccess}
                    />
                  </div>
                )}
                {error && (
                  <div className="mb-4">
                    <AlertFailed
                      message={error}
                      autoDismiss={true}
                      duration={5000}
                      onDismiss={onDismissError}
                    />
                  </div>
                )}
                <textarea
                  placeholder="Hari ini belum ada cerita. Apa pun yang kamu rasakan, kamu bisa mulai menuliskannya di sini."
                  className="w-full h-32 border rounded-md p-3"
                  value={jurnalHariIni}
                  onChange={handleInputChange}
                  disabled={!isAuthenticated}
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={editingJournal ? handleSaveEdit : handleSubmit}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-md cursor-pointer"
                    disabled={!isAuthenticated}
                  >
                    {editingJournal ? 'Simpan Perubahan' : 'Selanjutnya'}
                  </button>
                </div>
                {mood && (
                  <div className="mt-3 text-sm">
                    <p>Mood Terdeteksi: {mood.replace('_', ' ')}</p>
                    <p>Tingkat Keyakinan: {(confidence * 100).toFixed(2)}%</p>
                  </div>
                )}
              </section>

              <section className="bg-purple-300 p-4 rounded-xl shadow">
                <h2 className="text-md font-semibold mb-2">
                  Detail Jurnal Tanggal{' '}
                  {format(selectedDate, 'dd MMMM yyyy', { locale: id })}
                </h2>
                {journalHistory.length > 0 && (
                  <div className="bg-white p-4 rounded-md shadow space-y-4 text-sm overflow-y-auto max-h-64">
                    {journalHistory
                      .filter(
                        (j) =>
                          new Date(j.date).toDateString() ===
                          selectedDate.toDateString(),
                      )
                      .map((j) => (
                        <div key={j.id} className="flex items-start gap-2">
                          <img
                            src={getMoodEmoji(j.mood)}
                            alt={`${j.mood} emoji`}
                            className="w-6 h-6"
                          />
                          <div>
                            <p className="font-medium flex items-center gap-2">
                              📅{' '}
                              {format(
                                toZonedTime(new Date(j.date), 'Asia/Jakarta'),
                                'dd MMMM yyyy',
                                { locale: id },
                              )}
                            </p>
                            <p>{j.text}</p>
                            <p>Mood: {j.mood.replace('_', ' ')}</p>
                            <p>
                              Confidence: {(j.confidence * 100).toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </section>
            </div>

            <section className="bg-purple-300 p-4 rounded-xl shadow h-fit space-y-4">
              <h2 className="text-md font-semibold">
                Jurnal Harian Sebelumnya
              </h2>
              <div className="overflow-y-auto max-h-64">
                {journalHistory.map((journal) => (
                  <div
                    key={journal.id}
                    className="bg-white p-3 rounded-lg shadow space-y-2 text-sm mb-2"
                  >
                    <div className="flex items-start gap-2">
                      <img
                        src={getMoodEmoji(journal.mood)}
                        alt={`${journal.mood} emoji`}
                        className="w-6 h-6"
                      />
                      <div>
                        <p className="font-medium">
                          📅{' '}
                          {format(
                            toZonedTime(new Date(journal.date), 'Asia/Jakarta'),
                            'dd MMMM yyyy',
                            { locale: id },
                          )}
                        </p>
                        <p>{journal.text}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-purple-500">
                      <span
                        className="cursor-pointer"
                        onClick={() => handleEdit(journal)}
                      >
                        Edit →
                      </span>
                      <div className="space-x-2 text-black">
                        <button onClick={() => handleDelete(journal.id)}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4">
                  Konfirmasi Penghapusan
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Apakah Anda yakin ingin menghapus jurnal ini? Tindakan ini
                  tidak dapat dibatalkan.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={cancelDelete}
                    className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default JurnalView;
