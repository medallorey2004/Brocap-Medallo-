import { useEffect, useState, useContext } from "react"
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Image, ScrollView, TextInput } from "react-native"
import { router } from "expo-router"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../firebaseConfig"
import { GoalsContext } from "../../contexts/GoalsContext"

const hatItems = [
  { id: "1", title: "cap1.jpg", image: require("../../assets/images/cap1.png") },
  { id: "2", title: "cap2.jpg", image: require("../../assets/images/cap2.png") },
  { id: "3", title: "cap3.jpg", image: require("../../assets/images/cap3.avif") },
  { id: "4", title: "cap4.jpg", image: require("../../assets/images/cap4.jpg") },
  { id: "5", title: "cap5.jpg", image: require("../../assets/images/cap5.png") },
  { id: "6", title: "cap6.jpg", image: require("../../assets/images/cap6.jpg") },
  { id: "7", title: "cap7.jpg", image: require("../../assets/images/cap7.png") },
  { id: "8", title: "cap8.jpg", image: require("../../assets/images/cap8.jpg") },
]

const Home = () => {
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState({})
  const { createGoal } = useContext(GoalsContext)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login")
      } else {
        setLoading(false)
      }
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  const handleAddToWishlist = async (item) => {
    const message = notes[item.id] || "Someday I will buy it"

    await createGoal({
      title: item.title,
      description: message,
      image: item.title, // ✅ save image URI
      userId: auth.currentUser.uid, // ✅ so CreateGoal can query by user
      createdAt: new Date(),
    })

    router.push("/goals/create") // go to wishlist after adding
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Find Your Favorite Cap </Text>

      <View style={styles.grid}>
        {hatItems.map((item, index) => {
          if (index % 2 === 0) {
            return (
              <View key={item.id} style={styles.column}>
                <View style={styles.card}>
                  <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder='Someday I will buy it...'
                    value={notes[item.id] || ""}
                    onChangeText={(text) => setNotes({ ...notes, [item.id]: text })}
                  />
                  <Pressable style={styles.button} onPress={() => handleAddToWishlist(item)}>
                    <Text style={styles.buttonText}>Add to Wishlist</Text>
                  </Pressable>
                </View>

                {hatItems[index + 1] && (
                  <View style={styles.card}>
                    <Image source={hatItems[index + 1].image} style={styles.cardImage} resizeMode="cover" />
                    <Text style={styles.cardTitle}>{hatItems[index + 1].title}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder='Someday I will buy it...'
                      value={notes[hatItems[index + 1].id] || ""}
                      onChangeText={(text) => setNotes({ ...notes, [hatItems[index + 1].id]: text })}
                    />
                    <Pressable style={styles.button} onPress={() => handleAddToWishlist(hatItems[index + 1])}>
                      <Text style={styles.buttonText}>Add to Wishlist</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            )
          }
          return null
        })}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
     flex: 1, 
     backgroundColor: "#d4aa7ace",
      padding: 12 
    },
  title: { 
    color: "#ffffffff",
    fontSize: 30, 
    fontWeight: "bold",
     marginBottom: 16,
      textAlign: "center" 
    },
  grid: { 
    flexDirection: "row",
     flexWrap: "wrap", 
     justifyContent: "space-between"
     },
  column: { 
    flexDirection: "column", 
    width: "48%" 
  },
  card: {
    backgroundColor: "#e0c6a8ef",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
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
     marginBottom: 8 
    },
  cardTitle: { 
    color: "#c57418ee",
    fontSize: 14, 
    fontWeight: "bold",
     marginBottom: 6, 
     textAlign: "center" 
    },
  input: { 
    borderWidth: 1,
     borderColor: "#c5741873",
      borderRadius: 6, 
      padding: 8, 
      fontSize: 13, 
      marginBottom: 10 
    },
  button: { 
    backgroundColor: "#c57518d7",
     padding: 10,
      borderRadius: 6, 
      alignItems: "center" 
    },
  buttonText: {
     color: "white", 
     fontWeight: "bold", 
     fontSize: 13 
    },
})

export default Home
