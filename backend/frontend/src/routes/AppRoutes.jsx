import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/login/login-page";
import RegisterPage from "../pages/register/register-page";
import LandingPage from "../pages/landing page/landing-page";
import LandingSudahPage from "../pages/landing page sudah login/landing-sudah-page";
import CatatanPage from "../pages/Eksplorasi Diri/catatan/catatan-page";
import JurnalHarian from "../pages/Eksplorasi Diri/jurnal/jurnal-page";
import RefleksiDiri from "../pages/Eksplorasi Diri/refleksi/refleksi-page";

import PrivateRoute from "../utils/PrivateRoute";
import { useEffect } from "react";

export default function AppRoutes() {
  useEffect(() => {
    const handlePopstate = () => {
      // Periksa apakah rute saat ini adalah '/'
      if (window.location.pathname === "/") {
        console.log("Rute / tercapai, menghapus localStorage");
        localStorage.removeItem("user");
      }
    };

    // Tambahkan event listener untuk mendeteksi perubahan riwayat (tombol back/forward)
    window.addEventListener("popstate", handlePopstate);

    // Bersihkan event listener saat komponen unmount
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/catatan"
          element={
            <PrivateRoute>
              {" "}
              <CatatanPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/jurnal"
          element={
            <PrivateRoute>
              <JurnalHarian />
            </PrivateRoute>
          }
        />
        <Route
          path="/refleksi"
          element={
            <PrivateRoute>
              <RefleksiDiri />
            </PrivateRoute>
          }
        />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <LandingSudahPage />
            </PrivateRoute>
          }
        />
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}
