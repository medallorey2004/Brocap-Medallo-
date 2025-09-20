import { useState, useContext, useEffect } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { StyleSheet, Text, TextInput, Pressable, View, Image, ScrollView } from "react-native"
import { GoalsContext } from "../../contexts/GoalsContext"
import { auth } from "../../firebaseConfig"
import { Ionicons } from "@expo/vector-icons"  // ✅ icons for edit & delete

// ✅ Map filenames saved in Firestore to local assets
const capImages = {
  "cap1.jpg": require("../../assets/images/cap1.png"),
  "cap2.jpg": require("../../assets/images/cap2.png"),
  "cap3.jpg": require("../../assets/images/cap3.avif"),
  "cap4.jpg": require("../../assets/images/cap4.jpg"),
  "cap5.jpg": require("../../assets/images/cap5.png"),
  "cap6.jpg": require("../../assets/images/cap6.jpg"),
  "cap7.jpg": require("../../assets/images/cap7.png"),
  "cap8.jpg": require("../../assets/images/cap8.jpg"),
}

export default function CreateGoal() {
  const { goals, updateGoal, deleteGoal, loadGoals } = useContext(GoalsContext)
  const [editingId, setEditingId] = useState(null)
  const [description, setDescription] = useState("")

  useEffect(() => {
    const unsubscribe = loadGoals(auth.currentUser.uid) // realtime listener
    return unsubscribe
  }, [])

  const handleUpdate = async (goalId) => {
    await updateGoal(goalId, { description })
    setEditingId(null)
    setDescription("")
    alert("Wishlist updated ✅")
  }

  const handleDelete = async (goalId) => {
    await deleteGoal(goalId)
    alert("Wishlist removed 🗑️")
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Your Wishlist</Text>

      <ScrollView>
        {goals.length === 0 ? (
          <Text style={styles.emptyText}>No items in your wishlist yet.</Text>
        ) : (
          <View style={styles.grid}>
            {goals.map((goal) => (
              <View key={goal.id} style={styles.card}>
                {/* ✅ Show saved cap image using filename mapping */}
                {goal.image && capImages[goal.image] ? (
                  <Image source={capImages[goal.image]} style={styles.cardImage} />
                ) : (
                  <View style={[styles.cardImage, styles.placeholder]}>
                    <Text style={{ color: "#888" }}>No image</Text>
                  </View>
                )}

                <Text style={styles.cardTitle}>{goal.title}</Text>

                {editingId === goal.id ? (
                  <>
                    <TextInput
                      style={[styles.input, { height: 80 }]}
                      value={description}
                      onChangeText={setDescription}
                      placeholder="Edit your note..."
                      multiline
                    />
                    <Pressable
                      style={styles.saveButton}
                      onPress={() => handleUpdate(goal.id)}
                    >
                      <Text style={styles.saveButtonText}>Save</Text>
                    </Pressable>
                  </>
                ) : (
                  <Text style={styles.note}>{goal.description}</Text>
                )}

                <View style={styles.actions}>
                  <Pressable
                    style={styles.iconButton}
                    onPress={() => {
                      setEditingId(goal.id)
                      setDescription(goal.description)
                    }}
                  >
                    <Ionicons name="create-outline" size={22} color="#4CAF50" />
                  </Pressable>
                  <Pressable
                    style={styles.iconButton}
                    onPress={() => handleDelete(goal.id)}
                  >
                    <Ionicons name="trash-outline" size={22} color="#f44336" />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
     padding: 12, 
     backgroundColor: "#d4aa7ace"
     },
  heading: { 
    color: "#ffffffd7",
    fontSize: 24,
     fontWeight: "bold",
      marginBottom: 20, 
      textAlign: "center" 
    },
  emptyText: { 
    fontSize: 16, 
    color: "#888", 
    textAlign: "center", 
    marginTop: 50 
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#e0c6a8ef",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    width: "48%", 
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#c5741873",
  },
  cardTitle: { 
    color: "#c57418ee",
    fontSize: 14,
     fontWeight: "bold", 
     marginBottom: 6,
      textAlign: "center"
     },
  note: { 
    fontSize: 13,
     marginBottom: 8, 
     textAlign: "center" 
    },
  input: {
    borderWidth: 1,
    borderColor: "#c5741873",
    borderRadius: 6,
    padding: 8,
    fontSize: 13,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: "#c57518d7",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 8,
  },
  saveButtonText: { 
    color: "white", 
    fontWeight: "bold", 
    fontSize: 13 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 6,
  },
  iconButton: {
    padding: 6,
  },
})
