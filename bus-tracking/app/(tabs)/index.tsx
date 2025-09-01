import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const BUS_ID = "42"; 
const BACKEND_URL = "https://vehicle-tracker-production-00ee.up.railway.app"; // use your deployed URL

export default function App() {

  const startTracking = async () => {
    if (Platform.OS === 'web') return; // skip web

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission denied');
      return;
    }

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 60000, // 1 min
        distanceInterval: 50 // 50 meters
      },
      (loc) => {
        const { latitude, longitude } = loc.coords;
        console.log("Location:", latitude, longitude);
        sendToServer(latitude, longitude);
      }
    );

    console.log("🚀 Location tracking started");
  };

  const sendToServer = async (lat: number, lng: number) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/bus`, {
        busId: BUS_ID,
        lat,
        lng,
        timestamp: new Date().toISOString()
      });
      console.log("Sent:", res.data);
    } catch (err: any) {
      console.log("ERROR sending location:", err.message);
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
