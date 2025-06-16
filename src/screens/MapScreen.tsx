import { RouteProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Button, Card, Chip, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MapComponent from '../components/MapComponent';
import GooglePlacesService from '../services/GooglePlacesService';
import { COLORS, TAB_BAR_HEIGHT } from '../utils/constants';

const MapScreen = ({ route }: { route?: RouteProp<any, any> }) => {
  const insets = useSafeAreaInsets();
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markers, setMarkers] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);

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
      loadNearbyPlaces(place.geometry.location.lat, place.geometry.location.lng);
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

        // Create a current location place object
        const currentLocationPlace: Place = {
          name: 'Current Location',
          place_id: 'current_location',
          formatted_address: 'Your current location',
          geometry: {
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          },
        };

        setSelectedPlace(currentLocationPlace);
        setMarkers([currentLocationPlace]);
        loadNearbyPlaces(position?.coords?.latitude, position?.coords?.longitude);
      },
      error => {
        console.error('Location error:', error);
        Alert.alert('Error', 'Unable to get current location');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const loadNearbyPlaces = async (latitude: number, longitude: number, radius = 5000) => {
    try {
      const places = await GooglePlacesService.getNearbyPlaces(latitude, longitude, radius);
      setNearbyPlaces(places);
      if (!route?.params?.place) {
        setMarkers(places);
      }
    } catch (error) {
      console.error('Error loading nearby places:', error);
      Alert.alert('Error', 'Failed to load nearby places. Please try again.', [{ text: 'OK' }]);
    }
  };

  const handleMarkerPress = (marker: Marker): void => {
    setSelectedPlace(marker);
  };

  const handleRegionChange = (newRegion: Region): void => {
    setRegion(newRegion);
  };

  const showAllPlaces = () => {
    const allPlaces = selectedPlace ? [selectedPlace, ...nearbyPlaces] : nearbyPlaces;
    setMarkers(allPlaces);
  };

  const showOnlySelected = () => {
    if (selectedPlace) {
      setMarkers([selectedPlace]);
      setRegion({
        latitude: selectedPlace.geometry.location.lat,
        longitude: selectedPlace.geometry.location.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  };

  const renderPlaceDetails = () => {
    if (!selectedPlace) {
      return null;
    }

    const bottomPadding = Platform.select({
      ios: insets.bottom + TAB_BAR_HEIGHT + 16,
      android: TAB_BAR_HEIGHT + 50,
    });

    return (
      <Card style={[styles.detailsCard, { marginBottom: bottomPadding }]}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.placeName}>
            {selectedPlace.name}
          </Text>
          <Text variant="bodyMedium" style={styles.placeAddress}>
            {selectedPlace.formatted_address || selectedPlace.vicinity}
          </Text>

          <View style={styles.placeInfo}>
            {selectedPlace.rating && (
              <Chip
                icon="star"
                mode="outlined"
                compact
                style={[styles.infoChip, { backgroundColor: COLORS.closedStatusBackground }]}
              >
                {selectedPlace.rating.toFixed(1)}
              </Chip>
            )}
            {selectedPlace.price_level !== undefined && (
              <Chip
                mode="outlined"
                compact
                style={[styles.infoChip, { backgroundColor: COLORS.openStatusBackground }]}
              >
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
                    backgroundColor: selectedPlace.opening_hours?.open_now
                      ? COLORS.openStatusBackground
                      : COLORS.closedStatusBackground,
                  },
                ]}
                icon={selectedPlace.opening_hours?.open_now ? 'check-circle' : 'close'}
              >
                {selectedPlace.opening_hours?.open_now ? 'Open' : 'Closed'}
              </Chip>
            )}
          </View>

          <View style={styles.actions}>
            <Button
              mode="outlined"
              compact
              onPress={showAllPlaces}
              style={styles.actionButton}
              icon="map-marker-multiple"
            >
              Show All Places
            </Button>
            <Button
              mode="contained"
              compact
              onPress={showOnlySelected}
              style={styles.actionButton}
              icon="map-marker"
            >
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

      {selectedPlace && <View style={styles.detailsContainer}>{renderPlaceDetails()}</View>}
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
    paddingHorizontal: 16,
  },
  detailsCard: {
    elevation: 8,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  placeName: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: COLORS.textPrimary,
  },
  placeAddress: {
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  placeInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  infoChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
});

export default MapScreen;
