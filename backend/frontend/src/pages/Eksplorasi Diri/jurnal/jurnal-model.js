// jurnal-model.js
import * as tf from '@tensorflow/tfjs';
import { getAuth } from 'firebase/auth';
import { saveJournalEntry, fetchJournalHistory } from '../../../firebase-firestore';

export default class JurnalModel {
  constructor() {
    this.model = null;
    this.maxLength = 100;
    this.moodLabels = ['angry', 'fear', 'happy', 'love', 'sadness'];
    this.vocabSize = 5000;

    // Dictionary kata-kata kunci untuk prediksi utama
    this.keywordMoodMap = {
      'marah': 'angry', 'kesal': 'angry', 'jengkel': 'angry', 'emosi': 'angry',
      'benci': 'angry', 'dongkol': 'angry', 'sebel': 'angry', 'geram': 'angry',
      'takut': 'fear', 'cemas': 'fear', 'khawatir': 'fear', 'panik': 'fear',
      'gelisah': 'fear', 'was-was': 'fear', 'deg-degan': 'fear',
      'senang': 'happy', 'gembira': 'happy', 'bahagia': 'happy', 'suka': 'happy',
      'riang': 'happy', 'ceria': 'happy', 'girang': 'happy', 'puas': 'happy',
      'sayang': 'love', 'cinta': 'love', 'kasih': 'love', 'rindu': 'love',
      'kangen': 'love', 'romantis': 'love',
      'sedih': 'sadness', 'kecewa': 'sadness', 'galau': 'sadness', 'murung': 'sadness',
      'down': 'sadness', 'patah hati': 'sadness', 'hancur': 'sadness'
    };
  }

  async loadModel() {
    try {
      if (!this.model) {
        // console.log('Loading TensorFlow.js model...');
        try {
          this.model = await tf.loadGraphModel('/model_tfjs/model.json');
          // console.log('Model loaded successfully as GraphModel');
        } catch (graphError) {
          // console.log('Failed to load as GraphModel, trying LayersModel...');
          try {
            this.model = await tf.loadLayersModel('/model_tfjs/model.json');
            // console.log('Model loaded successfully as LayersModel');
          } catch (layersError) {
            // console.error('Failed to load as both GraphModel and LayersModel');
            // console.log('Using keyword-based prediction only');
            this.model = null;
          }
        }
      }
      return this.model;
    } catch (error) {
      // console.error('Error loading model:', error);
      throw new Error('Gagal memuat model prediksi');
    }
  }

  predictMoodByKeywords(text) {
    const lowerText = text.toLowerCase();
    const scores = { 'angry': 0, 'fear': 0, 'happy': 0, 'love': 0, 'sadness': 0 };

    Object.entries(this.keywordMoodMap).forEach(([keyword, mood]) => {
      if (lowerText.includes(keyword)) scores[mood] += 1;
    });

    const maxMood = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const confidence = totalScore > 0 ? scores[maxMood] / totalScore : 0.1;

    return {
      mood: maxMood,
      confidence: confidence,
      method: 'keyword',
      probabilities: [0, 0, 0, 0, 0]
    };
  }

  preprocessText(text) {
    try {
      const cleanText = text.toLowerCase().replace(/[^a-zA-Z\s]/g, '');
      const words = cleanText.split(/\s+/).slice(0, this.maxLength);
      const tokens = words.map(() => 0); // Placeholder sampai tokenizer.json tersedia

      const paddedTokens = new Array(this.maxLength).fill(0);
      for (let i = 0; i < Math.min(tokens.length, this.maxLength); i++) {
        paddedTokens[i] = tokens[i];
      }

      return tf.tensor2d([paddedTokens], [1, this.maxLength], 'float32');
    } catch (error) {
      // console.error('Error in preprocessing:', error);
      throw new Error('Gagal memproses teks input');
    }
  }

  async predictMood(text) {
    try {
      if (!text || text.trim().length === 0) throw new Error('Teks tidak boleh kosong');

      const keywordPrediction = this.predictMoodByKeywords(text);
      // console.log('Keyword-based prediction:', keywordPrediction);

      if (this.model) {
        const inputTensor = this.preprocessText(text);
        // console.log('Input Tensor Shape:', inputTensor.shape);
        // console.log('Input Tensor Data:', inputTensor.dataSync());

        let prediction;
        if (this.model.predict) {
          prediction = this.model.predict(inputTensor);
        } else if (this.model.execute) {
          prediction = this.model.execute({ 'keras_tensor': inputTensor });
          if (Array.isArray(prediction)) prediction = prediction[0];
        }

        const probabilities = await prediction.data();
        const maxProb = Math.max(...probabilities);
        const maxIndex = Array.from(probabilities).indexOf(maxProb);

        inputTensor.dispose();
        prediction.dispose();

        const mlPrediction = {
          mood: this.moodLabels[maxIndex],
          confidence: maxProb,
          probabilities: Array.from(probabilities),
          method: 'ml'
        };

        // console.log('ML prediction:', mlPrediction);

        if (mlPrediction.confidence > keywordPrediction.confidence) {
          return mlPrediction;
        }
      }

      return keywordPrediction;

    } catch (error) {
      // console.error('Error predicting mood:', error);
      return this.predictMoodByKeywords(text);
    }
  }

  async submitJournal(text) {
    try {
      const auth = getAuth();
      if (!auth.currentUser) throw new Error('Pengguna belum login');

      // console.log('Predicting mood for text:', text.substring(0, 50) + '...');
      const moodPrediction = await this.predictMood(text);
      // console.log('Final mood prediction result:', moodPrediction);

      const journalEntry = await saveJournalEntry(text, moodPrediction.mood, moodPrediction.confidence);
      return {
        mood: moodPrediction.mood,
        confidence: moodPrediction.confidence,
        method: moodPrediction.method,
        journalId: journalEntry.journalId,
      };
    } catch (error) {
      // console.error('Kesalahan mengirim jurnal:', error);
      throw error;
    }
  }

  async getJournalHistory() {
    try {
      const { initialData } = await fetchJournalHistory();
      const history = await initialData;
      return history;
    } catch (error) {
      throw new Error('Gagal mengambil riwayat jurnal: ' + error.message);
    }
  }
}