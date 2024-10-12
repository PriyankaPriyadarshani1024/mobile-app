import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Button, Linking, Alert } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

export default function App({ contacts }) {
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [locationLink, setLocationLink] = useState('');

  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    const { latitude, longitude } = location.coords;

    setMapRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });

    // Create a Google Maps link
    const LocationLink = `http://www.google.com/maps?q=${latitude},${longitude}`;
    setLocationLink(LocationLink);
    console.log(LocationLink); // Log the link to see it in the console


  };

  useEffect(() => {
    userLocation();
  }, []);


  const openLocationLink = () => {
    if (locationLink) {
      Linking.openURL(locationLink);
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={mapRegion}>
        <Marker coordinate={mapRegion} title="You are here" />
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Get Location" onPress={userLocation} />
        {locationLink ? (
          <Text style={styles.linkText} onPress={openLocationLink}>
            Open Location in Google Maps
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});
