import React, { useEffect, useState, useRef } from "react";
import { View, Button, TouchableOpacity, Text } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import LocationSearchbar from "./LocationSearchbar";

import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  LocationAccuracy,
} from "expo-location";

export default function MapScreen() {
  const [location, setLocation] = useState<LocationObject | null>(null);

  const mapRef = useRef<MapView>(null);

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync({
        accuracy: LocationAccuracy.Highest,
      });
      setLocation(currentPosition);
      mapRef.current?.animateCamera({
        center: currentPosition.coords,
        zoom: 17,
      });
    }
  }

  const handleGetLocation = async () => {
    await requestLocationPermissions();
  };

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      });
    }
  }, [location]);

  return (
    <View style={styles.container}>
      {location ? (
        <>
          <LocationSearchbar setLocation={setLocation} />
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            }}
            showsUserLocation={true}
            loadingEnabled={true}
          />
          <TouchableOpacity onPress={handleGetLocation} style={styles.target}>
            <Text style={{ color: "#000", fontSize: 25, textAlign: "center" }}>
              ⌖
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <Button title="Obter Localização" onPress={handleGetLocation} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignitems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: "100%",
  },
  target: {
    width: 30,
    height: 30,
    backgroundColor: "#fff",
    position: "absolute",
    right: 15,
    bottom: 100,
    borderRadius: 4,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.17,
    shadowRadius: 2.54,
    elevation: 3,
    fontSize: 14,
    textAlign: "center",
  },
});
