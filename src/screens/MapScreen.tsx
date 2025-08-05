import React, {useState, useEffect} from 'react';
import {View, Text, Button, StyleSheet, Alert} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

/**
 * MapScreen displays the user’s current location and nearby friends using
 * `react-native-maps`.  When the user taps the “Start Tracking” button the
 * screen subscribes to GPS updates.  The PraxisMapper GPS plugin for Godot
 * demonstrates a similar workflow — calling `EnableGPS()` begins tracking and
 * emits `onLocationUpdates` with fields such as `latitude` and
 * `accuracy`【297930607786020†L320-L361】.  In this React implementation we use
 * the built‑in Geolocation API and react-native-permissions to request
 * location permissions.
 */
const MapScreen: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number;} | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [tracking, setTracking] = useState(false);
  const [friends, setFriends] = useState([
    {id: '1', name: 'Alice', latitude: 37.7749, longitude: -122.4194},
    {id: '2', name: 'Bob', latitude: 34.0522, longitude: -118.2437},
  ]);

  useEffect(() => {
    const requestPermission = async () => {
      const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (result === RESULTS.DENIED || result === RESULTS.LIMITED) {
        const req = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (req !== RESULTS.GRANTED) {
          Alert.alert('Permission needed', 'Location permission is required to track your position.');
        }
      }
    };
    requestPermission();
  }, []);

  useEffect(() => {
    if (tracking) {
      const id = Geolocation.watchPosition(
        (pos) => {
          const {latitude, longitude} = pos.coords;
          setUserLocation({latitude, longitude});
        },
        (err) => Alert.alert('Location error', err.message),
        {enableHighAccuracy: true, distanceFilter: 5, interval: 1000}
      );
      setWatchId(id);
    } else if (watchId != null) {
      Geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    return () => {
      if (watchId != null) Geolocation.clearWatch(watchId);
    };
  }, [tracking]);

  const toggleTracking = () => setTracking(!tracking);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.latitude ?? 37.7749,
          longitude: userLocation?.longitude ?? -122.4194,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        {friends.map(friend => (
          <Marker
            key={friend.id}
            coordinate={{latitude: friend.latitude, longitude: friend.longitude}}
            title={friend.name}
            description={friend.name}
          />
        ))}
      </MapView>
      <View style={styles.controls}>
        <Button title={tracking ? 'Stop Tracking' : 'Start Tracking'} onPress={toggleTracking} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default MapScreen;