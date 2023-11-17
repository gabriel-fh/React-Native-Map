import React from "react";
import { View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { StyleSheet } from "react-native";
import { GOOGLE_API_KEY } from "./../../environments";

import {} from "../../environments";

export default function LocationSearchbar() {
  return (
    <View style={styles.searchContainer}>
      <GooglePlacesAutocomplete
        styles={{
          container: styles.autocompleteContainer,
          textInput: styles.textInput,
          predefinedPlacesDescription: styles.description,
        }}
        placeholder="Procure seu endereço ou região de entrega"
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
        }}
        query={{
          key: { GOOGLE_API_KEY },
          language: "pt-BR", // Idioma da pesquisa
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    position: "absolute",
    top: 100,
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
  autocompleteContainer: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    borderRadius: 8,
  },
  textInput: {
    height: 40,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    width: "100%",
    alignSelf: "center",
    fontSize: 14,
    paddingLeft:40
  },
  description: {
    fontWeight: "bold",
  },
});
