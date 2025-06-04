import debounce from 'lodash/debounce';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  ActivityIndicator,
  FAB,
  List,
  Searchbar,
  Snackbar,
  Text,
} from 'react-native-paper';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';

import PlaceItem from '../components/PlaceItem';
import GooglePlacesService from '../services/GooglePlacesService';
import StorageService from '../services/StorageService';
import {COLORS} from '../utils/constants';

const HomeScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        await requestLocationPermission();
      } catch (error) {
        console.warn('Location initialization failed:', error);
        showSnackbar('Location services are not available');
      }
    };

    initializeLocation();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs location access to show nearby places.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Android location granted');
          await getCurrentLocation();
        } else {
          showSnackbar('Location permission denied');
        }
      } catch (err) {
        console.warn('Error requesting Android location:', err);
        showSnackbar('Error requesting location permission');
      }
    } else {
      try {
        const permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
        const result = await request(permission);

        if (result === RESULTS.GRANTED) {
          await getCurrentLocation();
        } else if (result === RESULTS.DENIED) {
          showSnackbar('Location permission is required for nearby places');
        } else if (result === RESULTS.BLOCKED) {
          Alert.alert(
            'Permission Required',
            'Please enable location permission in settings.',
          );
        } else {
          showSnackbar('Unable to get location permission');
        }
      } catch (error) {
        console.warn('iOS permission error:', error);
        showSnackbar('Error requesting location permission');
      }
    }
  };

  const getCurrentLocation = async () => {
    if (!Geolocation) {
      console.warn('Geolocation service not available');
      showSnackbar('Geolocation service not available');
      return;
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          try {
            const {latitude, longitude} = position.coords;

            if (
              typeof latitude !== 'number' ||
              typeof longitude !== 'number' ||
              isNaN(latitude) ||
              isNaN(longitude)
            ) {
              throw new Error('Invalid coordinates received');
            }

            const location = {latitude, longitude};

            setCurrentLocation(location);
            resolve(position);
          } catch (error) {
            console.error('[Location Parse Error]', error);
            showSnackbar('Failed to process location data');
            reject(error);
          }
        },
        error => {
          console.warn('[Geolocation Error]', error);

          const errorMessages = {
            1: 'Location permission denied',
            2: 'Location unavailable',
            3: 'Location request timed out',
          };

          const errorMessage =
            errorMessages[error.code] || `Location error: ${error.message}`;

          showSnackbar(errorMessage);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          forceRequestLocation: true,
        },
      );
    });
  };

  const searchPlaces = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setLoading(true);
    try {
      const results = await GooglePlacesService.searchPlaces(searchQuery);
      setPlaces(results || []);

      if (!results || results.length === 0) {
        showSnackbar('No places found for your search');
      }
    } catch (error) {
      console.error('Search error:', error);
      showSnackbar('Error searching places. Please try again.');
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const searchNearbyPlaces = async () => {
    if (!currentLocation) {
      showSnackbar('Location not available');
      return;
    }

    setLoading(true);
    try {
      const results = await GooglePlacesService.getNearbyPlaces(
        currentLocation.latitude,
        currentLocation.longitude,
      );
      setPlaces(results || []);
      showSnackbar(`Found ${results?.length || 0} nearby places`);
    } catch (error) {
      console.warn('Nearby search error:', error);
      showSnackbar('Error finding nearby places');
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlacePress = async place => {
    try {
      await StorageService.saveSearchHistory(place);
      navigation.navigate('MapDetail', {place});
    } catch (error) {
      console.error('Error saving to history:', error);
      navigation.navigate('MapDetail', {place});
    }
  };

  const handleViewMap = place => {
    navigation.navigate('MapDetail', {place});
  };

  const showSnackbar = message => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const renderPlaceItem = ({item}) => (
    <PlaceItem
      place={item}
      onPress={() => handlePlacePress(item)}
      onViewMap={() => handleViewMap(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        Discover Places
      </Text>
      <Text variant="bodyLarge" style={styles.emptySubtitle}>
        Search for restaurants, hotels, attractions, and more
      </Text>
    </View>
  );

  // Debounced function for getting autocomplete suggestions
  const getSuggestions = useCallback(
    debounce(async query => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const results = await GooglePlacesService.getAutocompleteSuggestions(
          query,
        );
        setSuggestions(results);
      } catch (error) {
        console.warn('Error getting suggestions:', error);
      }
    }, 300),
    [],
  );

  // Update suggestions when search query changes
  useEffect(() => {
    getSuggestions(searchQuery);
  }, [searchQuery, getSuggestions]);

  const handleSuggestionPress = async suggestion => {
    setSearchQuery(suggestion.description);
    setShowSuggestions(false);
    setLoading(true);

    try {
      const placeDetails = await GooglePlacesService.getPlaceDetails(
        suggestion.place_id,
      );
      setPlaces([placeDetails]);
    } catch (error) {
      console.error('Error getting place details:', error);
      showSnackbar('Error getting place details');
    } finally {
      setLoading(false);
    }
  };

  const renderSuggestion = ({item}) => (
    <List.Item
      title={item.description}
      onPress={() => handleSuggestionPress(item)}
      left={props => (
        <List.Icon
          {...props}
          icon="map-marker"
          color={COLORS.primary}
          size={10}
          style={{marginRight: 4}}
        />
      )}
      titleStyle={styles.suggestionTitle}
      style={[
        styles.suggestionItem,
        {
          backgroundColor: 'white',
          borderLeftWidth: 1,
          borderLeftColor: COLORS.primary + '40',
        },
      ]}
      rippleColor={COLORS.primary + '20'}
      description={item.structured_formatting?.secondary_text}
      descriptionStyle={styles.suggestionDescription}
    />
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search for places..."
          onChangeText={text => {
            setSearchQuery(text);
            setShowSuggestions(true);
          }}
          value={searchQuery}
          onSubmitEditing={searchPlaces}
          style={styles.searchbar}
          icon="magnify"
          clearIcon="close"
          onFocus={() => setShowSuggestions(true)}
        />
        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={suggestions}
              renderItem={renderSuggestion}
              keyExtractor={item => item.place_id}
              keyboardShouldPersistTaps="handled"
              style={styles.suggestionsList}
              contentContainerStyle={{paddingVertical: 8}}
            />
          </View>
        )}
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Searching places...</Text>
          </View>
        ) : (
          <FlatList
            data={places}
            renderItem={renderPlaceItem}
            keyExtractor={item =>
              String(item?.place_id || item?.id || Math.random())
            }
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
            contentContainerStyle={[
              places.length ? {paddingVertical: 8} : styles.emptyContainer,
            ]}
            ItemSeparatorComponent={() => <View style={{height: 12}} />}
          />
        )}
      </View>

      <FAB
        icon="near-me"
        style={styles.fab}
        onPress={searchNearbyPlaces}
        label="Nearby"
        disabled={!currentLocation}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}>
        {snackbarMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: COLORS.surface,
    elevation: 2,
    zIndex: 1,
  },
  searchbar: {
    elevation: 0,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.onBackground,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
    color: COLORS.onBackground,
  },
  emptySubtitle: {
    textAlign: 'center',
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.secondary,
    elevation: 4,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 12,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    zIndex: 1000,
    maxHeight: 300,
    marginTop: 30,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  suggestionsList: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  suggestionItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary + '15',
    backgroundColor: 'white',
  },
  suggestionTitle: {
    fontSize: 18,
    color: COLORS.primary,
    marginLeft: 4,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  suggestionDescription: {
    fontSize: 15,
    color: '#666',
    marginLeft: 4,
    marginTop: 6,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
});

export default HomeScreen;
