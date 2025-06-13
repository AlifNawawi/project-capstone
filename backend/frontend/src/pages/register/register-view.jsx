import React, { useState } from 'react';

export const RegisterView = ({
  username,
  email,
  password,
  gender,
  onUsernameChange,
  onEmailChange,
  onPasswordChange,
  onGenderChange,
  onSubmit,
  error,
  success,
  isLoading,
  onSocialLogin,
  AlertSuccess,
  AlertFailed,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F1EDFF]">
      {/* Bagian Form Register */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-10 md:px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Yuk, <span className="text-purple-600">Daftar!</span>
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Biar kamu bisa mulai pantau suasana hati setiap hari.
        </p>

        <div className="w-full max-w-sm">
          {/* Alert Messages */}
          {success && (
            <div className="mb-4">
              <AlertSuccess message={success} />
            </div>
          )}

          {error && (
            <div className="mb-4">
              <AlertFailed message={error} />
            </div>
          )}

          <input
            type="text"
            placeholder="Nama Pengguna"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          />

          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Kata Sandi"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          />

          <input
            type="text"
            placeholder="Jenis Kelamin (male/female/laki-laki/perempuan)"
            value={gender}
            onChange={(e) => onGenderChange(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          />

          <div className="flex justify-between items-center mb-4">
            <label className="text-sm flex items-center">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-1"
                disabled={isLoading}
              />
              Tampilkan kata sandi
            </label>
          </div>

          <button
            onClick={onSubmit}
            disabled={isLoading}
            className={`w-full text-white rounded-full py-2 shadow-md transition-all duration-200 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 cursor-pointer'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Mendaftar...
              </div>
            ) : (
              'Daftar'
            )}
          </button>

          <div className="text-center my-4 text-sm text-gray-500">
            atau daftar dengan akun sosial media
          </div>

          <div className="flex justify-center gap-4">
            <img
              src="/google.png"
              alt="Google"
              className={`w-6 h-6 transition-opacity ${
                isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer hover:opacity-80'
              }`}
              onClick={() => !isLoading && onSocialLogin('google')}
            />
            <img
              src="/facebook.png"
              alt="Facebook"
              className={`w-6 h-6 transition-opacity ${
                isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer hover:opacity-80'
              }`}
              onClick={() => !isLoading && onSocialLogin('facebook')}
            />
            <img
              src="/github.png"
              alt="GitHub"
              className={`w-6 h-6 transition-opacity ${
                isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer hover:opacity-80'
              }`}
              onClick={() => !isLoading && onSocialLogin('github')}
            />
          </div>
        </div>
      </div>

      {/* Bagian Gambar dan Info */}
      <div className="flex-1 flex justify-center items-center bg-[#BFA5FF] text-black py-10 px-6 md:px-20 md:py-0 rounded-t-[4rem] md:rounded-t-none md:rounded-l-full">
        <div className="text-center max-w-md">
          <img
            src="/emoji1.png"
            alt="Emojis"
            className="h-24 w-auto mb-4 object-contain mx-auto"
          />
          <h1 className="text-2xl font-bold">Halo, Senang Ketemu Lagi!</h1>
          <p className="mt-2 text-center">
            Mamood senang banget kamu kembali, siap melangkah lebih jauh? Yuk,
            masuk sekarang dan lanjutkan perjalanan kenal dirimu lebih dalam.
          </p>
          <a
            href="/login"
            className="bg-purple-600 text-white px-4 py-2 rounded-full shadow mt-6 inline-block hover:bg-purple-700 transition-colors"
          >
            Yuk, masuk lagi!
          </a>
        </div>
      </div>
    </div>
  );
};
