import RefleksiModel from "./refleksi-model";

const RefleksiPresenter = {
  // Daftar 20 pertanyaan DASS-42 dari dokumen
  questions: [
    "Saya merasa bahwa diri saya menjadi marah karena hal hal sepele.",
    "Saya cenderung bereaksi berlebihan terhadap suatu situasi.",
    "Saya sulit untuk bersantai.",
    "Saya menemukan diri saya mudah merasa kesal.",
    "Saya merasa telah menghabiskan banyak energi untuk merasa cemas.",
    "Saya menemukan diri saya menjadi tidak sabar ketika mengalami penundaan (misalnya: kemacetan lalu lintas, menunggu sesuatu).",
    "Saya merasa bahwa saya mudah tersinggung.",
    "Saya merasa sulit untuk beristirahat.",
    "Saya merasa bahwa saya sangat mudah marah.",
    "Saya merasa sulit untuk tenang setelah sesuatu membuat saya kesal.",
    "Saya sulit untuk sabar dalam menghadapi gangguan terhadap hal yang sedang saya lakukan.",
    "Saya sedang merasa gelisah.",
    "Saya tidak dapat memaklumi hal apapun yang menghalangi saya untuk menyelesaikan hal yang sedang saya lakukan.",
    "Saya menemukan diri saya mudah gelisah.",
    "Saya merasa bibir saya sering kering.",
    "Saya mengalami kesulitan bernafas (misalnya; seringkali terengah-engah atau tidak dapat bernafas padahal tidak melakukan aktifitas fisik sebelumnya).",
    "Saya sepertinya tidak kuat lagi untuk melakukan suatu kegiatan.",
    "Saya merasa goyah (misalnya, kaki terasa mau 'mau copot').",
    "Saya berkeringat secara berlebihan (misalnya: Tangan berkeringat), padahal temperatur tidak panas atau tidak melakukan aktivitas fisik sebelumnya.",
    "Saya menyadari kegiatan jantung, walaupun saya tidak sehabis melakukan aktivitas fisik, (misalnya: merasa detak jantung meningkat atau melemah).",
  ],

  // Hitung skor dan kategori
  calculateScore(answers) {
    // Skor mentah: jumlah jawaban (0-4 untuk 20 pertanyaan)
    const rawScore = answers.reduce((sum, answer) => sum + (answer || 0), 0);
    // Skor skala 0-100: (rawScore / 80) * 100
    const scaledScore = Math.round((rawScore / 80) * 100);

    // Tentukan kategori berdasarkan skala 0-100 (Tabel 2 dokumen)
    let category;
    if (scaledScore <= 34) category = "Normal";
    else if (scaledScore <= 43) category = "Ringan";
    else if (scaledScore <= 60) category = "Sedang";
    else if (scaledScore <= 79) category = "Berat";
    else category = "Sangat Berat";

    return { rawScore, scaledScore, category };
  },

  async saveReflection(answers) {
    try {
      const { rawScore, scaledScore, category } = this.calculateScore(answers);
      const reflectionId = await RefleksiModel.saveReflection(rawScore, scaledScore, category, answers);
      return { reflectionId, rawScore, scaledScore, category };
    } catch (error) {
      throw error;
    }
  },

  async getReflectionHistory() {
    try {
      const history = await RefleksiModel.fetchReflectionHistory();
      return history;
    } catch (error) {
      throw error;
    }
  },
};

export default RefleksiPresenter;