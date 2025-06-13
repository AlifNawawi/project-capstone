import { auth } from "../../../firebase";
import { collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../../firebase-firestore";

const RefleksiModel = {
  async saveReflection(rawScore, scaledScore, category, answers) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const reflectionData = {
        userId: user.uid,
        date: new Date().toISOString(),
        rawScore,
        scaledScore,
        category,
        answers,
      };

      const docRef = await addDoc(collection(db, "self_reflections"), reflectionData);
      console.log("Reflection saved with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error saving reflection:", error);
      throw error;
    }
  },

  async fetchReflectionHistory() {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const q = query(
        collection(db, "self_reflections"),
        where("userId", "==", user.uid),
        orderBy("date", "desc")
      );
      const querySnapshot = await getDocs(q);
      const history = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return history;
    } catch (error) {
      console.error("Error fetching reflection history:", error);
      throw error;
    }
  },
};

export default RefleksiModel;