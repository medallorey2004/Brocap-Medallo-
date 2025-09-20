import { useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Pressable,
} from "react-native"
import { auth, db } from "../../firebaseConfig"
import { doc, collection, query, where, onSnapshot } from "firebase/firestore"
import { signOut } from "firebase/auth"
import { useRouter } from "expo-router"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"

export default function Profile() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const user = auth.currentUser
    if (!user) {
      setLoading(false)
      return
    }

    const refUser = doc(db, "users", user.uid)

    // Real-time listener for user data
    const unsubscribeUser = onSnapshot(
      refUser,
      (snap) => {
        if (snap.exists()) {
          setUserData((prev) => ({
            ...(prev || {}),
            ...snap.data(),
          }))
        }
      },
      (err) => console.error("Error fetching user profile:", err)
    )

    // Real-time listener for goals count
    const goalsQuery = query(collection(db, "goals"), where("userId", "==", user.uid))
    const unsubscribeGoals = onSnapshot(goalsQuery, (snapshot) => {
      setUserData((prev) => ({
        ...(prev || {}),
        goalCount: snapshot.size,
      }))
    })

    setLoading(false)

    return () => {
      unsubscribeUser()
      unsubscribeGoals()
    }
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.replace("/auth/login")
    } catch (error) {
      console.log("Error logging out:", error)
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}> Profile</Text>

      <View style={styles.profileBox}>
        {/* ✅ Cap Icon instead of image */}
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="hat-fedora" size={100} color="#0f67cc" />
        </View>

        {/* User Info */}
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={18} color="#333" style={styles.icon} />
            <Text style={styles.rowText}>
              {userData?.firstName} {userData?.mi ? userData.mi + "." : ""} {userData?.lastName}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="at-outline" size={18} color="#333" style={styles.icon} />
            <Text style={styles.rowText}>@{userData?.username}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="book-outline" size={18} color="#333" style={styles.icon} />
            <Text style={styles.rowText}>{userData?.bio || "No bio yet"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="heart-outline" size={18} color="#333" style={styles.icon} />
            <Text style={styles.rowText}>Wishlist added: {userData?.goalCount || 0}</Text>
          </View>
        </View>
      </View>

      {/* Logout button */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="white" style={{ marginRight: 6 }} />
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
     flex: 1, 
     padding: 20, 
     backgroundColor: "#d4aa7ace" 
    },
  heading: { 
    color: "#ffffffff",
    fontSize: 30, 
    fontWeight: "bold", 
    marginBottom: 20, 
    textAlign: "center" 
  },

  profileBox: { alignItems: "center" },

  iconContainer: {
    marginBottom: 20,
    backgroundColor: "#e6f0ff",
    padding: 30,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },

  infoBox: {
    width: "95%",
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  infoRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 8 
  },
  icon: { marginRight: 10 },
  rowText: { 
    fontSize: 16, 
    color: "#333",
     flexShrink: 1 
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "#c57518d7",
    paddingVertical: 14,
    borderRadius: 8,
  },
  logoutText: { 
    color: "white", 
    fontWeight: "bold", 
    fontSize: 16
   },
})
