import { useState } from 'react';
import { auth } from '../../../firebase';
import { saveTestimonial } from '../../../firebase-firestore';
import AlertSuccess from '../../General/AlertSuccess';
import AlertFailed from '../../General/AlertFaill';

export default function TestimoniModal({ onClose, onTestimonialAdded }) {
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [isDisplayed, setIsDisplayed] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setIsSubmitting(true);

    if (!rating || !status || !message.trim() || !isDisplayed) {
      setError('Semua kolom harus diisi!');
      setIsSubmitting(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Pengguna tidak terautentikasi');

      await saveTestimonial({
        rating,
        status,
        message,
        isDisplayed,
        displayName: user.displayName || null,
      });

      setSuccess('Testimoni berhasil dikirim!');

      // Panggil callback untuk refresh data testimoni
      if (onTestimonialAdded) {
        onTestimonialAdded();
      }

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError('Gagal menyimpan testimoni: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismissSuccess = () => setSuccess('');
  const handleDismissError = () => setError('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-10 backdrop-blur-sm">
      <div className="bg-[#f3f0ff] p-6 rounded-lg w-[90%] max-w-md relative">
        <button
          className="absolute top-4 right-4 text-gray-500 text-xl font-bold cursor-pointer"
          onClick={onClose}
          disabled={isSubmitting}
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">Testimoni</h2>

        {success && (
          <div className="mb-4">
            <AlertSuccess
              message={success}
              autoDismiss={true}
              duration={5000}
              onDismiss={handleDismissSuccess}
            />
          </div>
        )}
        {error && (
          <div className="mb-4">
            <AlertFailed
              message={error}
              autoDismiss={true}
              duration={5000}
              onDismiss={handleDismissError}
            />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex items-center mb-4 cursor-pointer">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                onClick={() => !isSubmitting && setRating(i)}
                className={`text-3xl ${
                  i <= rating ? 'text-yellow-400' : 'text-gray-300'
                } hover:scale-110 transition`}
              >
                ★
              </span>
            ))}
          </div>

          <div className="mb-4 relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-md py-2 px-3 appearance-none cursor-pointer"
              required
              disabled={isSubmitting}
            >
              <option value="">Pilih Status</option>
              <option value="Mahasiswa">Mahasiswa</option>
              <option value="Pekerja">Pekerja</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            <span className="absolute top-2.5 right-3 text-gray-500 pointer-events-none">
              ▼
            </span>
          </div>

          <div className="mb-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border rounded-md p-3 text-sm"
              rows="3"
              placeholder="Kamu merasa terbantu? Ceritain dong!"
              required
              disabled={isSubmitting}
            ></textarea>
          </div>

          <div className="mb-4 text-sm">
            <p className="mb-2">
              Mau testimoni kamu kami tampilkan di halaman Mamood?
            </p>
            <label className="block">
              <input
                type="radio"
                name="isDisplayed"
                value="ya"
                checked={isDisplayed === 'ya'}
                onChange={(e) => setIsDisplayed(e.target.value)}
                className="mr-2"
                required
                disabled={isSubmitting}
              />
              Boleh banget!
            </label>
            <label className="block">
              <input
                type="radio"
                name="isDisplayed"
                value="tidak"
                checked={isDisplayed === 'tidak'}
                onChange={(e) => setIsDisplayed(e.target.value)}
                className="mr-2"
                disabled={isSubmitting}
              />
              Jangan dulu ya, cukup tim Mamood aja
            </label>
          </div>

          <button
            type="submit"
            className={`bg-purple-600 text-white py-2 px-6 rounded-full hover:bg-purple-700 transition font-medium w-full ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim'}
          </button>
        </form>
      </div>
    </div>
  );
}
