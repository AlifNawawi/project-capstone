import React, { useState, useEffect } from 'react';
import JurnalView from '../jurnal/jurnal-view';
import { auth } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function JurnalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const authStatus = !!user;
      setIsAuthenticated(authStatus);
      if (!user) {
        setError('Silakan login terlebih dahulu!');
        window.location.href = '/login';
      }
    });
    return unsubscribe;
  }, []);

  const handleDismissSuccess = () => {
    setSuccess('');
  };

  const handleDismissError = () => {
    setError('');
  };

  return (
    <JurnalView
      isAuthenticated={isAuthenticated}
      success={success}
      error={error}
      setSuccess={setSuccess}
      setError={setError}
      onDismissSuccess={handleDismissSuccess}
      onDismissError={handleDismissError}
    />
  );
}
