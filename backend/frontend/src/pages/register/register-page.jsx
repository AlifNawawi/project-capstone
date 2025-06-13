import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterPresenter } from './register-presenter';
import { RegisterView } from './register-view';
import {
  googleProvider,
  facebookProvider,
  githubProvider,
} from '../../firebase';
import AlertSuccess from '../../components/General/AlertSuccess';
import AlertFailed from '../../components/General/AlertFaill';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const presenter = new RegisterPresenter({
    onRegisterSuccess: (user) => {
      localStorage.setItem('user', JSON.stringify(user));
      setSuccess(
        `Berhasil daftar sebagai ${user.username}! Mengalihkan ke halaman utama...`,
      );
      setError('');
      setIsLoading(false);

      // Redirect setelah 2 detik untuk memberi waktu user melihat pesan sukses
      setTimeout(() => {
        navigate('/');
      }, 2000);
    },
    onRegisterError: (errorMessage) => {
      setError(errorMessage);
      setSuccess('');
      setIsLoading(false);

      if (errorMessage === 'Silahkan login, akun sudah ada.') {
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    },
  });

  const handleSubmit = () => {
    // Clear previous messages
    setError('');
    setSuccess('');

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedGender = gender.trim();

    if (
      !trimmedUsername ||
      !trimmedEmail ||
      !trimmedPassword ||
      !trimmedGender
    ) {
      setError('Semua field wajib diisi');
      return;
    }

    if (trimmedPassword.length < 6) {
      setError('Kata sandi harus minimal 6 karakter');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Format email tidak valid');
      return;
    }

    const validGenders = [
      'male',
      'female',
      'laki-laki',
      'perempuan',
      'laki',
      'cowo',
      'cewe',
    ];
    if (!validGenders.includes(trimmedGender.toLowerCase())) {
      setError(
        'Jenis kelamin harus salah satu dari: male, female, laki-laki, perempuan, laki, cowo, cewe',
      );
      return;
    }

    setIsLoading(true);
    presenter.register(
      trimmedUsername,
      trimmedEmail,
      trimmedPassword,
      trimmedGender,
    );
  };

  const handleSocialLogin = async (providerName) => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    const providers = {
      google: googleProvider,
      facebook: facebookProvider,
      github: githubProvider,
    };

    const provider = providers[providerName];
    if (provider) {
      try {
        await presenter.handleSocialLogin(provider);
      } catch (error) {
        setError('Gagal login dengan sosial media');
        setIsLoading(false);

        if (error === 'Silahkan login, akun sudah ada.') {
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      }
    } else {
      setError('Provider tidak valid');
      setIsLoading(false);
    }
  };

  return (
    <RegisterView
      username={username}
      email={email}
      password={password}
      gender={gender}
      onUsernameChange={setUsername}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onGenderChange={setGender}
      onSubmit={handleSubmit}
      error={error}
      success={success}
      isLoading={isLoading}
      onSocialLogin={handleSocialLogin}
      AlertSuccess={AlertSuccess}
      AlertFailed={AlertFailed}
    />
  );
};

export default RegisterPage;
