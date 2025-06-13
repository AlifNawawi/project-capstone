import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../firebase';
import TestimoniModal from '../../components/Eksplorasi Diri/General/testimoni';

export default function LandingSudahView({
  user,
  moodData,
  testimonials,
  onRefreshTestimonials,
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isEksplorasiOpen, setEksplorasiOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isTestimoniModalOpen, setTestimoniModalOpen] = useState(false);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleEksplorasi = () => {
    setEksplorasiOpen((prev) => !prev);
    setProfileOpen(false);
  };
  const toggleProfile = () => {
    setProfileOpen((prev) => !prev);
    setEksplorasiOpen(false);
  };
  const openProfileModal = () => {
    setProfileModalOpen(true);
    setProfileOpen(false);
  };
  const closeProfileModal = () => setProfileModalOpen(false);

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        alert('Berhasil logout');
        navigate('/login');
      } else {
        alert('Gagal logout: ' + result.error);
      }
    } catch (error) {
      console.error('Error saat logout:', error);
      alert('Terjadi kesalahan saat logout');
    }
  };

  useEffect(() => {
    if (testimonials && testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentTestimonialIndex(
          (prevIndex) => (prevIndex + 1) % testimonials.length,
        );
      }, 5000); // Ganti setiap 5 detik
      return () => clearInterval(interval);
    }
  }, [testimonials]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
      >
        ★
      </span>
    ));
  };

  const handleTestimonialAdded = () => {
    // Refresh data testimoni setelah testimoni baru ditambahkan
    if (onRefreshTestimonials) {
      onRefreshTestimonials();
    }
  };

  return (
    <div className="min-h-screen bg-[#c9a7ff] text-gray-900">
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(-100%); opacity: 0; }
          }
          .testimonial-enter {
            animation: slideIn 0.5s forwards;
          }
          .testimonial-exit {
            animation: slideOut 0.5s forwards;
          }
        `}
      </style>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-24 py-6">
        <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
        <div className="md:hidden">
          <button className="cursor-pointer" onClick={toggleSidebar}>
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          {isSidebarOpen && (
            <div className="fixed top-0 left-0 w-64 h-full bg-[#f4f0ff] shadow-lg z-50 p-6 transition-all md:hidden">
              <button className="mb-6 cursor-pointer" onClick={toggleSidebar}>
                ❌
              </button>
              <div className="relative flex gap-3 mb-6">
                <button
                  onClick={toggleProfile}
                  className="border border-purple-700 rounded-full hover:bg-purple-100 transition cursor-pointer overflow-hidden"
                >
                  <img
                    src="/profile.png"
                    alt="Profile"
                    className="w-10 h-10 object-cover rounded-full"
                  />
                </button>
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
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 hover:bg-purple-100 cursor-pointer"
                      >
                        Keluar
                      </button>
                    </li>
                  </ul>
                )}
              </div>
              <ul className="flex flex-col gap-4 font-medium">
                <li>
                  <a href="/" className="hover:text-purple-700">
                    Beranda
                  </a>
                </li>
                <li className="relative">
                  <button
                    onClick={toggleEksplorasi}
                    className="hover:text-purple-700 cursor-pointer"
                  >
                    Eksplorasi Diri ▾
                  </button>
                  {isEksplorasiOpen && (
                    <ul className="absolute left-0 mt-2 bg-white rounded-md shadow-md text-sm py-2 w-48 z-20">
                      <li>
                        <a
                          href="#catatan"
                          className="block px-4 py-2 hover:bg-purple-100"
                        >
                          Catatan Mood
                        </a>
                      </li>
                      <li>
                        <a
                          href="#jurnal"
                          className="block px-4 py-2 hover:bg-purple-100"
                        >
                          Jurnal Harian
                        </a>
                      </li>
                      <li>
                        <a
                          href="#refleksi"
                          className="block px-4 py-2 hover:bg-purple-100"
                        >
                          Refleksi Diri
                        </a>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <a href="#tentangkami" className="hover:text-purple-700">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#testimoni" className="hover:text-purple-700">
                    Testimoni
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-6 text-base font-medium">
            <li>
              <a href="/" className="hover:text-purple-700">
                Beranda
              </a>
            </li>
            <li className="relative">
              <button
                onClick={toggleEksplorasi}
                className="hover:text-purple-700 cursor-pointer"
              >
                Eksplorasi Diri ▾
              </button>
              {isEksplorasiOpen && (
                <ul className="absolute left-0 mt-2 bg-white rounded-md shadow-md text-sm py-2 w-48 z-20">
                  <li>
                    <a
                      href="#catatan"
                      className="block px-4 py-2 hover:bg-purple-100"
                    >
                      Catatan Mood
                    </a>
                  </li>
                  <li>
                    <a
                      href="#jurnal"
                      className="block px-4 py-2 hover:bg-purple-100"
                    >
                      Jurnal Harian
                    </a>
                  </li>
                  <li>
                    <a
                      href="#refleksi"
                      className="block px-4 py-2 hover:bg-purple-100"
                    >
                      Refleksi Diri
                    </a>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <a href="#tentangkami" className="hover:text-purple-700">
                Tentang Kami
              </a>
            </li>
            <li>
              <a href="#testimoni" className="hover:text-purple-700">
                Testimoni
              </a>
            </li>
          </ul>
          <div className="relative flex gap-3">
            <button
              onClick={toggleProfile}
              className="border border-purple-700 rounded-full hover:bg-purple-100 transition cursor-pointer overflow-hidden"
            >
              <img
                src="/profile.png"
                alt="Profile"
                className="w-10 h-10 object-cover rounded-full"
              />
            </button>
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
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 hover:bg-purple-100 cursor-pointer"
                  >
                    Keluar
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      {/* Modal Profil */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 cursor-pointer"
              onClick={closeProfileModal}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Detail Profil
            </h2>
            <div className="flex flex-col items-center space-y-4">
              <img
                src="/profile.png"
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="flex gap-4">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 cursor-pointer">
                  Ganti foto
                </button>
                <button className="border border-purple-600 text-purple-600 px-4 py-2 rounded-full hover:bg-purple-100 cursor-pointer">
                  Hapus
                </button>
              </div>
              <div className="w-full space-y-3 mt-4">
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                  <span className="flex-1 text-gray-800">
                    {user?.username || 'Pengguna'}
                  </span>
                  <span className="text-gray-500">👤</span>
                </div>
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                  <span className="flex-1 text-gray-800">
                    {user?.email || 'N/A'}
                  </span>
                  <span className="text-gray-500">✉️</span>
                </div>
                {user?.gender && (
                  <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                    <span className="flex-1 text-gray-800">{user.gender}</span>
                    <span className="text-gray-500">⚥</span>
                  </div>
                )}
              </div>
              <button className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 cursor-pointer">
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-70 py-12 gap-8 md:gap-12 text-center md:text-left">
        <div className="max-w-xl">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6">
            <span className="block mb-4">Lagi Ngerasa Apa?</span>
            <span className="block">Ceritain di Mamood!</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed text-gray-800">
            Mamood siap jadi teman kamu buat pantau suasana hati setiap hari.
            Catat perasaanmu, refleksikan hari-harimu, dan temukan cara-cara
            kecil untuk bikin hidup lebih bahagia dan teratur. Dengan Mamood,
            kamu bisa kenal diri lebih dalam dan buat setiap hari lebih positif.
          </p>
        </div>
        <div className="relative">
          <img
            src="/girl.png"
            alt="Gadis meditasi"
            className="w-[220px] md:w-[420px] mx-auto drop-shadow-xl"
          />
        </div>
      </div>

      {/* Footer Wave */}
      <div>
        <img
          src="/wave.png"
          alt="Gelombang Putih"
          className="w-full object-cover -mt-6 md:-mt-12"
        />
      </div>

      {/* Catatan */}
      <section id="catatan" className="bg-[#e8e7f3] px-4 py-20">
        <div className="flex flex-col-reverse md:flex-col text-center items-center">
          <div>
            <p className="text-sm text-purple-600 font-semibold uppercase mb-2">
              Eksplorasi Diri
            </p>
            <h2 className="text-4xl font-extrabold mb-4">Catatan Mood</h2>
            <p className="max-w-2xl mx-auto text-gray-700 mb-8">
              Pantau suasana hatimu setiap hari melalui fitur Catatan Mood.
              Pilih emoji yang sesuai dengan perasaanmu, tambahkan catatan
              singkat, dan lihat pola mood-mu dari waktu ke waktu. Dengan
              mengenali emosi, kamu bisa lebih memahami dirimu sendiri.
            </p>
            <Link
              to="/catatan"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition font-medium"
            >
              Catat Mood-ku Hari Ini ↗
            </Link>
          </div>
          <div className="mt-10 md:mt-16 w-full overflow-hidden">
            <img
              src="/emoji2.png"
              alt="Emosi"
              className="w-full h-auto object-cover block"
            />
          </div>
        </div>
      </section>

      {/* Jurnal */}
      <section
        id="jurnal"
        className="bg-[#e8e7f3] min-h-screen flex items-center justify-center px-6 relative py-20"
      >
        <img
          src="/wave3.png"
          alt="Gelombang Latar"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="flex justify-center md:justify-start">
            <img
              src="/jurnal-desktop.png"
              alt="Mockup Komputer"
              className="w-[80%] md:w-full h-auto"
            />
          </div>
          <div className="text-center md:text-right px-4 md:px-0">
            <p className="uppercase text-purple-600 font-semibold tracking-widest mb-2">
              Eksplorasi Diri
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Jurnal Harian
            </h2>
            <p className="text-gray-800 mb-6 leading-relaxed">
              Luapkan perasaanmu lewat tulisan. Di Jurnal Harian, kamu bebas
              mencatat apa pun yang kamu rasakan, alami, dan pikirkan setiap
              hari. Ini tempat pribadi yang aman untuk mengekspresikan diri dan
              menyimpan momen bermakna.
            </p>
            <Link
              to="/jurnal"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full font-medium hover:bg-purple-700 transition"
            >
              Tulis Jurnal Sekarang ↗
            </Link>
          </div>
        </div>
      </section>

      {/* Refleksi diri */}
      <section
        id="refleksi"
        className="bg-[#e8e7f3] min-h-screen flex items-center justify-center px-6 py-20 relative"
      >
        <img
          src="/wave3.png"
          alt="Gelombang Latar"
          className="absolute inset-0 w-full h-full object-cover z-0 rotate-180"
        />
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="flex justify-center md:order-2">
            <img
              src="/refleksi-desktop.png"
              alt="Mockup Komputer Refleksi"
              className="w-[80%] md:w-full h-auto"
            />
          </div>
          <div className="text-center md:text-left px-4">
            <p className="uppercase text-purple-600 font-semibold tracking-widest mb-2">
              Eksplorasi Diri
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Refleksi Diri
            </h2>
            <p className="text-gray-800 mb-6 leading-relaxed">
              Kenali dirimu lebih dalam lewat pertanyaan reflektif yang
              membantumu memahami pikiran dan perasaan. Refleksi Diri membantu
              kamu mengevaluasi kondisi mental secara berkala agar tetap sadar
              dan sembuh.
            </p>
            <Link
              to="/refleksi"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full font-medium hover:bg-purple-700 transition"
            >
              Mulai Refleksi Diri ↗
            </Link>
          </div>
        </div>
      </section>

      {/* Tentang kami */}
      <section
        id="tentangkami"
        className="relative min-h-screen bg-[#e8e7f3] flex items-center justify-center px-6 py-16 overflow-hidden"
      >
        <img
          src="/wave3.png"
          alt="Latar gelombang"
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none rotate-180"
        />
        <div className="relative z-10 bg-white rounded-3xl shadow-xl max-w-6xl w-full overflow-hidden p-6 md:p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="flex justify-center mb-6 md:hidden">
              <img
                src="/logo-mobile.png"
                alt="Logo Mamood mobile"
                className="w-full"
              />
            </div>
            <div className="p-6 md:p-10 text-gray-800 space-y-6 order-2 md:order-1">
              <p className="uppercase text-purple-600 font-semibold tracking-widest">
                Tentang Kami
              </p>
              <h2 className="text-4xl font-extrabold text-gray-900">
                Cerita di Balik <span className="text-purple-600">Mamood</span>
              </h2>
              <p>
                <span className="text-purple-600 font-semibold">Mamood</span>{' '}
                adalah platform pemantauan suasana hati dan stres harian yang
                dirancang untuk membantu individu lebih sadar terhadap kondisi
                emosionalnya.
              </p>
              <p>
                Dengan fitur seperti{' '}
                <span className="text-purple-600 font-semibold">
                  pencatatan mood
                </span>
                ,
                <span className="text-purple-600 font-semibold">
                  {' '}
                  refleksi diri
                </span>
                ,
                <span className="text-purple-600 font-semibold">
                  {' '}
                  jurnal harian
                </span>
                , dan{' '}
                <span className="text-purple-600 font-semibold">
                  rekomendasi
                </span>
                , Mamood bukan alat diagnosis, melainkan sahabat digital untuk
                eksplorasi diri dan peningkatan kesejahteraan mental.
              </p>
              <blockquote className="border-l-4 pl-4 italic text-gray-700 border-gray-300">
                Proyek ini dikembangkan oleh{' '}
                <span className="font-bold">Tim CC25-CF094</span>
                dalam tema Inovasi Kesehatan, dengan pendekatan design thinking
                dan semangat kolaboratif lintas bidang.
              </blockquote>
            </div>
            <div className="hidden md:flex justify-end items-center p-10 order-1 md:order-2">
              <img
                src="/logo-miring.png"
                alt="Logo Mamood desktop"
                className="absolute -top-18 -right-25 w-full max-w-md md:max-w-lg object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimoni */}
      <section
        id="testimoni"
        style={{
          backgroundColor: '#e8e7f3',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '4rem 1rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '700px', zIndex: 1 }}>
          <div
            style={{
              backgroundColor: '#e6e0ff',
              color: '#7f6bdc',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              display: 'inline-block',
              padding: '6px 18px',
              borderRadius: '9999px',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Testimoni
          </div>
          <h2
            style={{
              fontSize: '2.25rem',
              fontWeight: '800',
              color: '#1f1f1f',
              marginBottom: '1rem',
            }}
          >
            Apa Kata Mereka?
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: '#4f4f4f',
              marginBottom: '2rem',
              lineHeight: '1.7',
            }}
          >
            Temukan bagaimana Mamood telah membantu banyak pengguna memahami dan
            merawat kesehatan mental mereka. Dari cerita perubahan positif
            hingga pengalaman inspiratif, testimoni ini membuktikan bahwa kamu
            tidak sendiri dalam perjalanan ini.
          </p>
          <button
            onClick={() => setTestimoniModalOpen(true)}
            style={{
              backgroundColor: '#7f6bdc',
              color: 'white',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '9999px',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            Yuk, Kirim Testimoni! 🌟
          </button>
        </div>
        <div className="hidden md:block">
          {testimonials && testimonials.length > 0 ? (
            <>
              <div
                key={testimonials[currentTestimonialIndex].id}
                className="testimonial-enter"
                style={{
                  position: 'absolute',
                  top: '53%',
                  left: '82%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#1f1f1f',
                  color: 'white',
                  padding: '1rem 1.2rem',
                  borderRadius: '1rem',
                  maxWidth: '300px',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    content: "''",
                    position: 'absolute',
                    top: '-12px',
                    left: '30%',
                    transform: 'translateX(-50%)',
                    width: '0',
                    height: '0',
                    borderLeft: '10px solid transparent',
                    borderRight: '10px solid transparent',
                    borderBottom: '12px solid #1f1f1f',
                  }}
                ></div>
                <div className="flex mb-2">
                  {renderStars(testimonials[currentTestimonialIndex].rating)}
                </div>
                <p style={{ marginBottom: '0.8rem', fontStyle: 'italic' }}>
                  "{testimonials[currentTestimonialIndex].message}"
                </p>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#b983ff' }}>
                    {testimonials[currentTestimonialIndex].displayName ||
                      'Anonymous'}
                  </strong>
                  <br />
                  <span style={{ fontSize: '0.8rem', color: '#ccc' }}>
                    {testimonials[currentTestimonialIndex].status}
                  </span>
                </div>
              </div>
              <img
                src={`/avatar/avatar${(currentTestimonialIndex % 8) + 1}.png`}
                alt="avatar"
                style={{
                  position: 'absolute',
                  top: '40%',
                  left: '76%',
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '6px solid #b983ff',
                  boxShadow: '0 4px 12px rgba(185,131,255,0.3)',
                  zIndex: 1,
                }}
              />
            </>
          ) : (
            <p style={{ color: '#4f4f4f', zIndex: 1 }}>
              Belum ada testimoni untuk ditampilkan.
            </p>
          )}
          {/* Placeholder avatar statis */}
          <img
            src="/avatar/avatar2.png"
            alt="avatar"
            style={{
              position: 'absolute',
              top: '5%',
              left: '14%',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 4px 12px rgba(185,131,255,0.3)',
              zIndex: 1,
            }}
          />
          <img
            src="/avatar/avatar3.png"
            alt="avatar"
            style={{
              position: 'absolute',
              top: '10%',
              left: '84%',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 4px 12px rgba(185,131,255,0.3)',
              zIndex: 1,
            }}
          />
          <img
            src="/avatar/avatar4.png"
            alt="avatar"
            style={{
              position: 'absolute',
              top: '15%',
              left: '65%',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 4px 12px rgba(185,131,255,0.3)',
              zIndex: 1,
            }}
          />
          <img
            src="/avatar/avatar5.png"
            alt="avatar"
            style={{
              position: 'absolute',
              top: '8%',
              left: '40%',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 4px 12px rgba(185,131,255,0.3)',
              zIndex: 1,
            }}
          />
          <img
            src="/avatar/avatar6.png"
            alt="avatar"
            style={{
              position: 'absolute',
              top: '25%',
              left: '25%',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 4px 12px rgba(185,131,255,0.3)',
              zIndex: 1,
            }}
          />
          <img
            src="/avatar/avatar7.png"
            alt="avatar"
            style={{
              position: 'absolute',
              top: '35%',
              left: '7%',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 4px 12px rgba(185,131,255,0.3)',
              zIndex: 1,
            }}
          />
          <img
            src="/avatar/avatar8.png"
            alt="avatar"
            style={{
              position: 'absolute',
              top: '58%',
              left: '20%',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 4px 12px rgba(185,131,255,0.3)',
              zIndex: 1,
            }}
          />
          <img
            src="/wave2.png"
            alt="footer wave"
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              width: '100%',
              zIndex: 0,
            }}
          />
        </div>
        {/* Update bagian render modal testimoni */}
        {isTestimoniModalOpen && (
          <TestimoniModal
            onClose={() => setTestimoniModalOpen(false)}
            onTestimonialAdded={handleTestimonialAdded}
          />
        )}
      </section>

      {/* Footer */}
      <section className="bg-purple-300 py-8 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/logo.png" alt="Logo Mamood" className="w-10 h-10" />
              <span className="text-xl font-bold text-gray-900">mamood</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Mamood bantu kamu lacak mood dan stres harian dengan cara yang
              simpel dan penuh empati. Kenali dirimu mulai dari hari ini.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/logo-github.png" alt="GitHub" className="w-6 h-6" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/logo-discord.png"
                  alt="Discord"
                  className="w-6 h-6"
                />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/logo-youtube.png"
                  alt="YouTube"
                  className="w-6 h-6"
                />
              </a>
            </div>
          </div>
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-purple-600 font-semibold mb-2">
                Eksplorasi Diri
              </h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>Catat Mood</li>
                <li>Jurnal Harian</li>
                <li>Refleksi Diri</li>
                <li>Rekomendasi</li>
              </ul>
            </div>
            <div>
              <h3 className="text-purple-600 font-semibold mb-2">
                Tentang Mamood
              </h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>Tentang Kami</li>
                <li>Testimoni</li>
                <li>Tim Kami</li>
              </ul>
            </div>
            <div>
              <h3 className="text-purple-600 font-semibold mb-2">
                Kontak Kami
              </h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li className="flex items-start">
                  <svg
                    className="w-4 h-4 mr-2 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                  </svg>
                  +62 895-326-57069
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-4 h-4 mr-2 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h12v2H6zm0 4h12v2H6z" />
                  </svg>
                  support@mamoodapp.com
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-600 text-sm mt-6">
          © 2025 Mamood. Hak cipta dilindungi.
        </div>
      </section>
    </div>
  );
}
