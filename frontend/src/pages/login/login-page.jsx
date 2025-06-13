import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginPresenter } from './login-presenter';
import { LoginView } from './login-view';
import {
  googleProvider,
  facebookProvider,
  githubProvider,
  linkedinProvider,
} from '../../firebase';
import AlertSuccess from '../../components/General/AlertSuccess';
import AlertFailed from '../../components/General/AlertFaill';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const presenter = new LoginPresenter({
    onLoginSuccess: (user) => {
      setSuccess(
        `Berhasil login sebagai ${user.email}! Mengalihkan ke halaman utama...`,
      );
      setError('');
      setIsLoading(false);

      if (localStorage) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    },
    onLoginError: (errorMessage) => {
      setError(errorMessage);
      setSuccess('');
      setIsLoading(false);
    },
  });

  const handleSubmit = () => {
    setError('');
    setSuccess('');

    if (!email.trim() || !password.trim()) {
      setError('Email dan password wajib diisi');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Format email tidak valid');
      return;
    }

    setIsLoading(true);
    presenter.login(email, password);
  };

  const handleSocialLogin = async (providerName) => {
    if (isLoading) return;

    setError('');
    setSuccess('');
    setIsLoading(true);

    const providers = {
      google: googleProvider,
      facebook: facebookProvider,
      github: githubProvider,
      linkedin: linkedinProvider,
    };

    const provider = providers[providerName];
    if (provider) {
      try {
        const result = await presenter.handleSocialLogin(provider);
        if (result?.success) {
          presenter.view.onLoginSuccess(result.user);
        } else if (result?.error) {
          setError(result.error);
          setIsLoading(false);
        }
      } catch (error) {
        setError('Gagal login dengan sosial media');
        setIsLoading(false);
      }
    } else {
      setError('Provider tidak valid');
      setIsLoading(false);
    }
  };

  const handleGoToRegister = () => {
    navigate('/register');
  };

  const handleDismissSuccess = () => {
    setSuccess('');
    navigate('/home'); // Redirect ke halaman utama saat alert sukses ditutup
  };

  const handleDismissError = () => {
    setError('');
  };

  return (
    <LoginView
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      error={error}
      success={success}
      isLoading={isLoading}
      onSocialLogin={handleSocialLogin}
      onGoToRegister={handleGoToRegister}
      AlertSuccess={(props) => (
        <AlertSuccess
          {...props}
          autoDismiss={true}
          duration={5000}
          onDismiss={handleDismissSuccess}
        />
      )}
      AlertFailed={(props) => (
        <AlertFailed
          {...props}
          autoDismiss={true}
          duration={5000}
          onDismiss={handleDismissError}
        />
      )}
    />
  );
};

export default LoginPage;
