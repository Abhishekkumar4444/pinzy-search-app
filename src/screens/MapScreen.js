import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import {Text, Button, Card, Chip} from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';

import MapComponent from '../components/MapComponent';
import GooglePlacesService from '../services/GooglePlacesService';
import {COLORS} from '../utils/constants';

const MapScreen = ({route, navigation}) => {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [markers, setMarkers] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);

  useEffect(() => {
    if (route?.params?.place) {
      const place = route.params.place;
      setSelectedPlace(place);
      setMarkers([place]);
      setRegion({
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      loadNearbyPlaces(
        place.geometry.location.lat,
        place.geometry.location.lng,
      );
    } else {
      getCurrentLocation();
    }
  }, [route?.params?.place]);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const newRegion = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        setRegion(newRegion);
        loadNearbyPlaces(position.coords.latitude, position.coords.longitude);
      },
      error => {
        console.error('Location error:', error);
        Alert.alert('Error', 'Unable to get current location');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const loadNearbyPlaces = async (latitude, longitude) => {
    try {
      const places = await GooglePlacesService.getNearbyPlaces(
        latitude,
        longitude,
        5000,
      );
      setNearbyPlaces(places);
      if (!route?.params?.place) {
        setMarkers(places);
      }
    } catch (error) {
      console.error('Error loading nearby places:', error);
    }
  };

  const handleMarkerPress = marker => {
    setSelectedPlace(marker);
  };

  const handleRegionChange = newRegion => {
    setRegion(newRegion);
  };

  const showAllPlaces = () => {
    const allPlaces = selectedPlace
      ? [selectedPlace, ...nearbyPlaces]
      : nearbyPlaces;
    setMarkers(allPlaces);
  };

  const showOnlySelected = () => {
    if (selectedPlace) {
      setMarkers([selectedPlace]);
    }
  };

  const renderPlaceDetails = () => {
    if (!selectedPlace) return null;

    return (
      <Card style={styles.detailsCard}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.placeName}>
            {selectedPlace.name}
          </Text>
          <Text variant="bodyMedium" style={styles.placeAddress}>
            {selectedPlace.formatted_address || selectedPlace.vicinity}
          </Text>

          <View style={styles.placeInfo}>
            {selectedPlace.rating && (
              <Chip icon="star" mode="outlined" compact style={styles.infoChip}>
                {selectedPlace.rating.toFixed(1)}
              </Chip>
            )}
            {selectedPlace.price_level !== undefined && (
              <Chip mode="outlined" compact style={styles.infoChip}>
                {'$'.repeat(selectedPlace.price_level + 1)}
              </Chip>
            )}
            {selectedPlace.opening_hours && (
              <Chip
                mode="outlined"
                compact
                style={[
                  styles.infoChip,
                  {
                    backgroundColor: selectedPlace.opening_hours.open_now
                      ? '#e8f5e8'
                      : '#ffeaea',
                  },
                ]}>
                {selectedPlace.opening_hours.open_now ? 'Open' : 'Closed'}
              </Chip>
            )}
          </View>

          <View style={styles.actions}>
            <Button
              mode="outlined"
              compact
              onPress={showAllPlaces}
              style={styles.actionButton}>
              Show All Places
            </Button>
            <Button
              mode="contained"
              compact
              onPress={showOnlySelected}
              style={styles.actionButton}>
              Focus Here
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <MapComponent
        region={region}
        markers={markers}
        onMarkerPress={handleMarkerPress}
        onRegionChange={handleRegionChange}
        style={styles.map}
      />

      {selectedPlace && (
        <View style={styles.detailsContainer}>{renderPlaceDetails()}</View>
      )}
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
  detailsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  detailsCard: {
    margin: 16,
    elevation: 8,
  },
  placeName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  placeAddress: {
    color: '#666',
    marginBottom: 12,
  },
  placeInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  infoChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default MapScreen;
