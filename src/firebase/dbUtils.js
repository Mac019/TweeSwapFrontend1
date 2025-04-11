// /firebase/dbUtils.js
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';

/**
 * Stores or updates the user's task and points in Firestore.
 * @param {string} userId - The ID of the user.
 * @param {string} taskId - The ID of the task.
 * @param {number} points - The points to add.
 */
export const storeUserTask = async (userId, taskId, points) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    // User exists, update their points
    await updateDoc(userRef, {
      [`tasks.${taskId}`]: points,
      totalPoints: (userSnap.data().totalPoints || 0) + points,
    });
  } else {
    // New user, create their record
    await setDoc(userRef, {
      tasks: { [taskId]: points },
      totalPoints: points,
    });
  }
};
