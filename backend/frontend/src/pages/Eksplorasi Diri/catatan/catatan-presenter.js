class CatatanPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async saveMood(mood, journal) {
    try {
      await this.model.saveMood(mood, journal);
      const updatedHistory = await this.model.getMoodHistory();
      this.view.updateMoodHistory(updatedHistory);
      this.view.showSuccess('Data mood berhasil disimpan ke database!');
      this.view.resetForm();
      this.view.onNextClick();
    } catch (error) {
      this.view.showError('Terjadi kesalahan saat menyimpan data: ' + error.message);
    }
  }

  async loadMoodHistory() {
    try {
      const history = await this.model.getMoodHistory();
      this.view.updateMoodHistory(history);
    } catch (error) {
      this.view.showError('Gagal memuat riwayat mood: ' + error.message);
    }
  }

  setAuthenticated(isAuthenticated) {
    this.view.setAuthenticated(isAuthenticated);
  }
}

export default CatatanPresenter;