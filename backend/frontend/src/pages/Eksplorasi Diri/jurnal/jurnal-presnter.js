// jurnal-presnter.js
import { updateJournalEntry, deleteJournalEntry } from '../../../firebase-firestore';

class JurnalPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async handleSubmit(text) {
    try {
      const result = await this.model.submitJournal(text);
      this.view.updateMood(result.mood, result.confidence);
      const updatedHistory = await this.model.getJournalHistory();
      this.view.renderJournalList(updatedHistory); // Perbarui UI dengan data baru
      this.view.clearInput();
      this.view.showSuccess('Jurnal berhasil disimpan!');
    } catch (error) {
      this.view.showError('Gagal menyimpan jurnal. Coba lagi.');
    }
  }

  async handleEdit(journalId, text) {
    try {
      const { mood, confidence } = await this.model.predictMood(text);
      await updateJournalEntry(journalId, text, mood, confidence);
      const updatedHistory = await this.model.getJournalHistory();
      this.view.renderJournalList(updatedHistory);
      this.view.clearInput();
      this.view.showSuccess('Jurnal berhasil diperbarui!');
    } catch (error) {
      this.view.showError('Gagal memperbarui jurnal. Coba lagi.');
    }
  }

  async handleDelete(journalId) {
    try {
      await deleteJournalEntry(journalId);
      const updatedHistory = await this.model.getJournalHistory();
      this.view.renderJournalList(updatedHistory);
      this.view.showSuccess('Jurnal berhasil dihapus!');
    } catch (error) {
      this.view.showError('Gagal menghapus jurnal. Coba lagi.');
    }
  }
}

export default JurnalPresenter;