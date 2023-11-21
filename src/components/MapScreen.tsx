import React, { useEffect, useState, useRef } from "react";
import { View, Button, TouchableOpacity, Text } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import LocationSearchbar from "./LocationSearchbar";
import Geocoder from "react-native-geocoding";
import { GOOGLE_API_KEY } from "../../environments";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  LocationAccuracy,
} from "expo-location";


export default function MapScreen() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);
  const [address, setAddress] = useState(null);


  Geocoder.init(GOOGLE_API_KEY);
  async function getAddressFromCoords(latitude: number, longitude: number) {
    return Geocoder.from(latitude, longitude)
      .then(json => {
        // console.log(json)
        const street = json.results[0].address_components[1].short_name;
        const number = json.results[0].address_components[0].short_name;
        const neighborhood = json.results[0].address_components[2].short_name
        const city = json.results[0].address_components[3].short_name
        const state = json.results[0].address_components[4].short_name
        const country = json.results[0].address_components[5].short_name
        const cep = json.results[0].address_components[6].short_name
        for (const iterator of json.results[0].address_components) {
          console.log(iterator)
          
        }
        return `${street}, ${number}, ${neighborhood} - ${city}, ${state}, ${country}, ${cep}`;

        // console.log(json.results[0].address_components[3])
        console.log('--------------------------------------------------')
      })
      .catch(error => {
        console.warn(error);
        return null; // Retorne null em caso de erro
      });
  }
  

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
            onRegionChangeComplete={async (region) => {
              const newAddress = await getAddressFromCoords(region.latitude, region.longitude);
              setAddress(newAddress);
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
            />
          </MapView>
          <TouchableOpacity onPress={handleGetLocation} style={styles.target}>
            <Text style={{ color: "#000", fontSize: 25, textAlign: "center" }}>
              ⌖
            </Text>
          </TouchableOpacity>
          <View style={{height: 300}}>
            <Text >{address}</Text>
          </View>
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
    bottom: 200,
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
