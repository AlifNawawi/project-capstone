import { saveMoodEntry, fetchMoodHistory } from '../../../firebase-firestore';

class CatatanModel {
    async saveMood(mood, journal) {
        try {
            await saveMoodEntry(mood, journal);
        } catch (error) {
            throw new Error('Failed to save mood: ' + error.message);
        }
    }

    async getMoodHistory() {
        try {
            const history = await fetchMoodHistory();
            return history;
        } catch (error) {
            throw new Error('Failed to fetch mood history: ' + error.message);
        }
    }
}

export default CatatanModel;