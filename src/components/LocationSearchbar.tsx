import React from "react";
import { View } from "react-native";
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { StyleSheet } from "react-native";
import { GOOGLE_API_KEY } from "../../environments";
import {} from "../../environments";
import  Constants  from "expo-constants";

interface Coords {
  latitude: number;
  longitude: number;
}

interface Location {
  coords: Coords;
}

export default function LocationSearchbar({setLocation}: any) {
  
  function onPlaceSelected(data: GooglePlaceData | null, details: GooglePlaceDetail | null) {

    // console.log(details)

    const location: Location = {
      coords: {
        latitude: details?.geometry.location.lat || 0,
        longitude: details?.geometry.location.lng || 0,
      }
    }
    setLocation(location)
  }



  return (
    <View style={styles.searchContainer}>
      <GooglePlacesAutocomplete
        styles={{
          textInput: styles.textInput,
          listView: {
            alignSelf: "center",
            // Estilos para a lista de sugestões
            borderRadius: 8,
            flex: 1,
          },
          description: {
            // Estilos para a descrição das sugestões
            paddingLeft: 33,
          },
          row: {
            // Estilos para a linha individual de cada sugestão
          },
          separator: {
            height: 0,
          },
        }}
        
        placeholder="Procure seu endereço ou região de entrega"
        fetchDetails
        onPress={onPlaceSelected}
        query={{
          key: GOOGLE_API_KEY,
          language: "pt-BR", // Idioma da pesquisa
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    position: "absolute",
    top: Constants.statusBarHeight,
    left: 10,
    right: "50%",
    width: "95%",
    height: "auto",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    borderRadius: 8,
    zIndex: 999,
    flex: 1,
    justifyContent: "center",
  },
  textInput: {
    height: 40,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    width: "100%",
    alignSelf: "center",
    fontSize: 14,
    paddingLeft: 40,
  },
});
