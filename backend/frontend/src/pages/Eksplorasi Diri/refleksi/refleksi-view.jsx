import React, { useState } from 'react';
import Aside from '../../../components/Eksplorasi Diri/General/Aside';
import Profile from '../../../components/Eksplorasi Diri/General/profile';
import ProfileWeb from '../../../components/Eksplorasi Diri/General/profile-web';
import Header from '../../../components/Eksplorasi Diri/General/Header';
import AlertSuccess from '../../../components/General/AlertSuccess';
import AlertFailed from '../../../components/General/AlertFaill';

const RefleksiView = ({
  jawaban = [],
  onPilihJawaban,
  onSubmit,
  result,
  error,
  success,
  isLoading,
  questions,
  onDismissSuccess,
  onDismissError,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getResultEmoji = (category) => {
    switch (category) {
      case 'Normal':
        return '/emoji/happy.png';
      case 'Ringan':
        return '/emoji/happy.png';
      case 'Sedang':
        return '/emoji/sad.png';
      case 'Berat':
        return '/emoji/very-sad.png';
      case 'Sangat Berat':
        return '/emoji/very-sad.png';
      default:
        return '/emoji/happy.png';
    }
  };

  return (
    <div className="flex h-screen">
      <Aside />
      <div className="flex-1 flex flex-col bg-[#f0f0ff] overflow-y-auto">
        <Header title="Refleksi" setIsSidebarOpen={setIsSidebarOpen} />
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-opacity-40 md:hidden">
            <div className="w-3/4 max-w-sm h-full bg-[#f0f0ff] p-4 shadow-lg relative">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-4 text-xl font-bold cursor-pointer"
              >
                ×
              </button>
              <div className="mt-10 mb-6 text-center">
                <img
                  src="/profile.png"
                  alt="Profile"
                  className="w-16 h-16 rounded-full mx-auto border"
                />
                <h2 className="mt-2 font-semibold text-lg">Halo, Daniel!</h2>
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
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center space-x-3 text-gray-700 font-medium hover:text-purple-500"
                  >
                    <img src={item.icon} alt={item.label} className="w-5 h-5" />
                    <span>{item.label}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            {questions.map((text, index) => (
              <div
                key={index}
                className={`bg-white p-5 rounded-xl shadow-md border-l-8 ${
                  jawaban?.[index] ? 'border-purple-400' : 'border-gray-300'
                }`}
              >
                <p className="font-semibold mb-3">Pertanyaan {index + 1}</p>
                <p className="text-gray-700 mb-4">{text}</p>
                <div className="flex gap-4 justify-between text-sm text-gray-500">
                  <span>Tidak Pernah</span>
                  <span>Sangat Sering</span>
                </div>
                <div className="flex gap-4 justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => onPilihJawaban(index, val)}
                      className={`w-6 h-6 rounded-full border-2 ${
                        jawaban?.[index] === val
                          ? 'bg-purple-400 border-purple-600'
                          : 'border-gray-400'
                      }`}
                    ></button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-purple-200 rounded-xl p-5 h-fit space-y-4 shadow-md">
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
            <button
              onClick={onSubmit}
              disabled={isLoading}
              className={`bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-md w-full ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {isLoading ? 'Memproses...' : 'Lihat Hasil'}
            </button>
            <div className="bg-white p-5 rounded-xl text-center shadow space-y-2">
              {result ? (
                <>
                  <img
                    src={getResultEmoji(result.category)}
                    alt="Result"
                    className="w-10 h-10 mx-auto"
                  />
                  <p className="text-lg font-semibold">
                    Skor: {result.scaledScore}
                  </p>
                  <p className="text-sm text-gray-600">
                    Kategori: {result.category}
                  </p>
                  <p className="text-sm text-gray-600">
                    Refleksi ini menunjukkan tingkat distres psikologis Anda.
                    {result.category === 'Berat' ||
                    result.category === 'Sangat Berat'
                      ? ' Pertimbangkan untuk berkonsultasi dengan profesional kesehatan mental.'
                      : ' Terus jaga kesehatan mental Anda!'}
                  </p>
                </>
              ) : (
                <>
                  <img
                    src="/emoji/happy.png"
                    alt="Result"
                    className="w-10 h-10 mx-auto"
                  />
                  <p className="text-sm text-gray-600">
                    Yuk isi semua pertanyaan terlebih dahulu
                    <br /> untuk melihat hasil refleksimu di sini!
                  </p>
                </>
              )}
            </div>
            <div className="bg-white p-4 rounded-xl shadow space-y-2">
              <h3 className="text-sm font-semibold mb-2">
                📊 Interpretasi Skor
              </h3>
              {[
                { label: 'Sangat Berat', range: '80-100' },
                { label: 'Berat', range: '61-79' },
                { label: 'Sedang', range: '44-60' },
                { label: 'Ringan', range: '35-43' },
                { label: 'Normal', range: '0-34' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-yellow-100 px-3 py-1 rounded text-xs"
                >
                  <span>{item.range}</span>
                  <span className="font-semibold">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefleksiView;
