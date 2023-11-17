import React, { useEffect, useState, useRef } from "react";
import { View, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  watchPositionAsync,
  LocationObject,
  LocationAccuracy,
} from "expo-location";

export default function MapScreen() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [markerCoordinate, setMarkerCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const mapRef = useRef<MapView>(null);

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync({});
      setLocation(currentPosition);
      setMarkerCoordinate({
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      });
    }
  }

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (response) => {
        setLocation(response);
        setMarkerCoordinate({
          latitude: response.coords.latitude,
          longitude: response.coords.longitude,
        });
        mapRef.current?.animateCamera({
          center: response.coords,
        });
      }
    );
  }, []);

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setMarkerCoordinate(coordinate);
    setLocation({
      coords: {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      },
    });
  };

  console.log(location)

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          onPress={handleMapPress}
        >
          {markerCoordinate && (
            <Marker
              coordinate={markerCoordinate}
              title="Você está aqui"
              description="Sua localização atual"
            />
          )}
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
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
