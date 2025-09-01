import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as Location from "expo-location";
import axios from "axios";

const BUS_ID = "42"; // each bus/driver gets a unique ID
// ✅ Use HTTPS with Railway URL
const BACKEND_URL = "https://tracker-backend-production-b041.up.railway.app";

export default function App() {
  const startTracking = async () => {
    // Ask for location permission
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied for location");
      return;
    }

    // Watch location with accuracy, update every 60s or 50m
    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 60000, // every 60s
        distanceInterval: 50, // or every 50 meters
      },
      (loc) => {
        const { latitude, longitude } = loc.coords;
        console.log("📍 Location:", latitude, longitude);
        sendToServer(latitude, longitude);
      }
    );
  };

  const sendToServer = async (lat: number, lng: number) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/bus/location`, {
        busId: BUS_ID,
        lat,
        lng,
        timestamp: new Date().toISOString(),
      });
      console.log("✅ Sent:", res.data);
    } catch (err: any) {
      console.log("❌ Error sending:", err.message);
    }
  };

  useEffect(() => {
    startTracking();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver App - Sending Live Location</Text>
      <Button title="Start Tracking" onPress={startTracking} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 18, marginBottom: 10 },
});
