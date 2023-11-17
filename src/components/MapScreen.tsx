import React, { useEffect, useState, useRef } from "react";
import { View, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  LocationAccuracy
} from "expo-location";

export default function MapScreen() {
  const [location, setLocation] = useState<LocationObject | null>(null);

  const mapRef = useRef<MapView>(null);

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync({
        accuracy: LocationAccuracy.Highest
      });
      setLocation(currentPosition);
      mapRef.current?.animateCamera({
        center: currentPosition.coords
      });
    }
  }

  const handleGetLocation = async () => {
    await requestLocationPermissions();
  };

  return (
    <View style={styles.container}>
      <Button title="Obter Localização" onPress={handleGetLocation} />
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            }}
          />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  }
});
