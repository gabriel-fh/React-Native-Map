import React, { useEffect, useState, useRef } from "react";
import { View, Button, TextInput } from "react-native";
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

  return (
    <View style={styles.container}>
      {location ? (
        <>
          <LocationSearchbar />
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            }}
            showsUserLocation={true}
            loadingEnabled={true}
          />
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
});
