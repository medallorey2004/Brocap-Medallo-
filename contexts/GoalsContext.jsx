// contexts/GoalsContext.js
import { createContext, useState } from "react"
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { db, auth } from "../firebaseConfig"

export const GoalsContext = createContext()

export const GoalsProvider = ({ children }) => {
  const [goals, setGoals] = useState([])

  // 🔄 Realtime load of user goals
  const loadGoals = (userId) => {
    const q = query(collection(db, "goals"), where("userId", "==", userId))
    return onSnapshot(q, (snapshot) => {
      setGoals(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
    })
  }

  // ➕ Create new goal (make sure to add userId + createdAt)
  const createGoal = async (goal) => {
    if (!auth.currentUser) return
    await addDoc(collection(db, "goals"), {
      ...goal,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    })
  }

  // ✏️ Update goal
  const updateGoal = async (id, updates) => {
    const ref = doc(db, "goals", id)
    await updateDoc(ref, updates)
  }

  // ❌ Delete goal
  const deleteGoal = async (id) => {
    const ref = doc(db, "goals", id)
    await deleteDoc(ref)
  }

  return (
    <GoalsContext.Provider value={{ goals, loadGoals, createGoal, updateGoal, deleteGoal }}>
      {children}
    </GoalsContext.Provider>
  )
}
