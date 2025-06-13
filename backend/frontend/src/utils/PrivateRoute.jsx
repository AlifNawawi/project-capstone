import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, onAuthStateChanged } from '../firebase';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Pengguna sudah login
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.uid === user.uid) {
          setIsAuthenticated(true);
        } else {
          // Data localStorage tidak valid, hapus dan redirect ke login
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        }
      } else {
        // Pengguna belum login
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Tampilkan loading saat memeriksa status
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
