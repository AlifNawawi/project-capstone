import React, { useEffect, useState } from "react";

export const LoginView = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  error,
  isLoading,
  onGoToRegister,
  onSocialLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-screen bg-[#EEE9FF]">
      <div
        className="flex-1 flex flex-col justify-center items-center bg-[#BFA5FF] text-black p-8 md:p-12 
  rounded-t-[5rem] rounded-b-[5rem] 
  md:rounded-t-none md:rounded-b-none 
  md:rounded-tr-full md:rounded-br-full">
        <img
          src="/emoji1.png"
          alt="Emojis"
          className="h-20 md:h-24 w-auto mb-4 object-contain"
        />
        <h1 className="text-xl md:text-2xl font-bold text-center">
          Halo, Siap Jelajahi Mamood?
        </h1>
        <p className="mt-2 text-center max-w-sm px-2 md:px-0">
          Senang banget kamu mau mulai perjalanan baru bareng Mamood! Yuk, buat
          akun sekarang dan mulai kenali suasana hatimu setiap hari, biar kamu
          makin dekat dengan dirimu sendiri.
        </p>
        <button
          onClick={onGoToRegister}
          className="mt-6 bg-[#8854D0] px-6 py-2 rounded-full text-white font-semibold shadow cursor-pointer">
          Yuk, daftar dulu!
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-6 md:px-8 py-8 md:py-0">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
          Yuk, <span className="text-purple-600">Masuk!</span>
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Biar kamu bisa lanjut nge-track mood kamu hari ini.
        </p>
        <div className="w-full max-w-sm">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-full border focus:outline-none"
            disabled={isLoading}
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Kata Sandi"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="w-full mb-2 px-4 py-2 rounded-full border focus:outline-none"
            disabled={isLoading}
          />
          {error && <p className="text-red-500 text-sm mb-2 px-2">{error}</p>}
          <div className="flex justify-between items-center mb-4 text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-1"
              />
              Tampilkan kata sandi
            </label>
            <a href="/forgot-password" className="text-purple-600">
              Lupa sandi?
            </a>
          </div>
          <button
            onClick={onSubmit}
            className={`w-full bg-purple-600 text-white rounded-full py-2 shadow-md relative ${
              isLoading ? "opacity-75 cursor-wait" : "cursor-pointer"
            }`}
            disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </span>
            ) : (
              "Masuk"
            )}
          </button>
          <div className="text-center my-4 text-sm text-gray-500">
            atau masuk dengan akun sosial media
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => onSocialLogin("google")}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              disabled={isLoading}>
              <img src="/google.png" alt="Google" className="w-6 h-6" />
            </button>
            <button
              onClick={() => onSocialLogin("facebook")}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              disabled={isLoading}>
              <img src="/facebook.png" alt="Facebook" className="w-6 h-6" />
            </button>
            <button
              onClick={() => onSocialLogin("github")}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              disabled={isLoading}>
              <img src="/github.png" alt="GitHub" className="w-6 h-6" />
            </button>
            <button
              onClick={() => onSocialLogin("linkedin")}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              disabled={isLoading}>
              <img src="/linkedin.png" alt="LinkedIn" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
