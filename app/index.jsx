import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login");
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BroCap</Text>
      <Text style={styles.title1}>Where you can wish your dream cap</Text>

      <View style={styles.buttonRow}>
        {/* Cap Wishlist button → now first, goes to /goals */}
        <Pressable style={styles.squareButton} onPress={() => router.push("/goals")}>
          <Ionicons name="school-outline" size={28} color="white" />
          <Text style={styles.buttonText}>Find more cap</Text>
        </Pressable>

        {/* Your Wishlist button → now second, goes to /goals/create */}
        <Pressable style={styles.squareButton} onPress={() => router.push("/goals/create")}>
          <Ionicons name="heart-outline" size={28} color="white" />
          <Text style={styles.buttonText}>Your Wishlist</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e2e0e0ff"
  },
  title: {
    color: "#c57518d7",
    marginVertical: 40,
    fontSize: 50,
    fontWeight: "bold",
  },
  title1: {
    marginVertical: 20,
    fontSize: 20,
    marginTop: -20,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 30,
  },
  squareButton: {
    backgroundColor: "#c57518d7",
    width: 130,
    height: 130,
    marginHorizontal: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    marginTop: 8,
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
});

export default Home;
