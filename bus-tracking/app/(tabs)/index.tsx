import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const BUS_ID = "42"; // each bus/driver gets a unique ID
const BACKEND_URL = "http://192.168.29.178:4000"; // 👈 change to your PC IP

export default function App() {

  const startTracking = async () => {
    // Ask permission
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission denied');
      return;
    }

    // Watch location
    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 60000, // every 60s
        distanceInterval: 50 // or every 50 meters
      },
      (loc) => {
        const { latitude, longitude } = loc.coords;
        console.log("Location:", latitude, longitude);
        sendToServer(latitude, longitude);
      }
    );
  };

  const sendToServer = async (lat, lng) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/bus/location`, {
        busId: BUS_ID,
        lat,
        lng,
        timestamp: new Date().toISOString()
      });
      console.log("Sent:", res.data);
    } catch (err) {
      console.log("Error:", err.message);
    }
  };

  useEffect(() => {
    startTracking();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Driver App - Sending Live Location</Text>
      <Button title="Start Tracking" onPress={startTracking} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" }
});
