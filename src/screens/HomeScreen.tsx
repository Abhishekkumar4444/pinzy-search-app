import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { ActivityIndicator, FAB, Searchbar, Snackbar, Text } from 'react-native-paper';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PlaceItem from '../components/PlaceItem';
import SuggestionList from '../components/SuggestionList';
import GooglePlacesService from '../services/GooglePlacesService';
import StorageService from '../services/StorageService';
import { Place } from '../types/navigation';
import { COLORS } from '../utils/constants';
import {
  getBottomTabHeight,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsivePadding,
} from '../utils/responsive';

const EmptyState = () => (
  <View style={styles.emptyState}>
    <Icon name="search" size={48} color={COLORS.primary} style={styles.emptyIcon} />
    <Text variant="headlineSmall" style={styles.emptyTitle}>
      Discover Places
    </Text>
    <Text variant="bodyLarge" style={styles.emptySubtitle}>
      Search for restaurants, hotels, attractions, and more
    </Text>
  </View>
);

const LoadingState = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLORS.primary} />
    <Text style={styles.loadingText}>Searching places...</Text>
  </View>
);

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Region | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const showSnackbar = useCallback((message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  }, []);

  const requestLocationPermission = useCallback(async () => {
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
          await getCurrentLocation();
        } else {
          navigation.navigate('Settings');
        }
      } catch (err) {
        showSnackbar('Error requesting location permission');
      }
    } else {
      try {
        const permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
        const result = await request(permission);

        if (result === RESULTS.GRANTED) {
          await getCurrentLocation();
        } else if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
          navigation.navigate('Settings');
        } else {
          showSnackbar('Unable to get location permission');
        }
      } catch (error) {
        showSnackbar('Error requesting location permission');
      }
    }
  }, [navigation, showSnackbar]);

  const getCurrentLocation = useCallback(async () => {
    if (!Geolocation) {
      showSnackbar('Geolocation service not available');
      return;
    }

    return new Promise<void>((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          try {
            const { latitude, longitude } = position.coords;

            if (
              typeof latitude !== 'number' ||
              typeof longitude !== 'number' ||
              isNaN(latitude) ||
              isNaN(longitude)
            ) {
              throw new Error('Invalid coordinates received');
            }

            setCurrentLocation({ latitude, longitude });
            resolve();
          } catch (error) {
            showSnackbar('Failed to process location data');
            reject(error);
          }
        },
        error => {
          const errorMessages: Record<number, string> = {
            1: 'Location permission denied',
            2: 'Location unavailable',
            3: 'Location request timed out',
          };

          const errorMessage =
            errorMessages[error.code as number] || `Location error: ${error.message}`;
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
  }, [showSnackbar]);

  const searchPlaces = useCallback(async () => {
    if (!searchQuery.trim()) {
      showSnackbar('Please enter a search term');
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
      showSnackbar('Error searching places. Please try again.');
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, showSnackbar]);

  const searchNearbyPlaces = useCallback(async () => {
    if (!currentLocation) {
      showSnackbar('Location not available. Please enable location services.');
      return;
    }

    setLoading(true);
    try {
      const results = await GooglePlacesService.getNearbyPlaces(
        currentLocation.latitude,
        currentLocation.longitude,
      );
      setPlaces(results || []);

      if (!results || results.length === 0) {
        showSnackbar('No places found nearby');
      } else {
        showSnackbar(`Found ${results.length} nearby places`);
      }
    } catch (error) {
      showSnackbar('Error finding nearby places. Please try again.');
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, [currentLocation, showSnackbar]);

  const handlePlacePress = useCallback(
    async (place: Place) => {
      try {
        const placeWithTimestamp = {
          ...place,
          timestamp: Date.now(),
        };
        await StorageService.saveSearchHistory(placeWithTimestamp);
        navigation.navigate('MapDetail', { place });
      } catch (error) {
        showSnackbar('Error saving to history');
        navigation.navigate('MapDetail', { place });
      }
    },
    [navigation, showSnackbar],
  );

  const handleViewMap = useCallback(
    async (place: Place) => {
      try {
        const placeWithTimestamp = {
          ...place,
          timestamp: Date.now(),
        };
        await StorageService.saveSearchHistory(placeWithTimestamp);
        navigation.navigate('MapDetail', { place });
      } catch (error) {
        showSnackbar('Error saving to history');
        navigation.navigate('MapDetail', { place });
      }
    },
    [navigation, showSnackbar],
  );

  const handleSuggestionPress = useCallback(
    async (suggestion: PlaceSuggestion) => {
      setSearchQuery(suggestion.description);
      setShowSuggestions(false);
      setLoading(true);

      try {
        const placeDetails = await GooglePlacesService.getPlaceDetails(suggestion.place_id);
        setPlaces([placeDetails]);
      } catch (error) {
        showSnackbar('Error getting place details');
      } finally {
        setLoading(false);
      }
    },
    [showSnackbar],
  );

  const getSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const results = await GooglePlacesService.getAutocompleteSuggestions(query);
        setSuggestions(results);
      } catch (error) {
        showSnackbar('Error getting suggestions');
      }
    }, 300),
    [showSnackbar],
  );

  useEffect(() => {
    getSuggestions(searchQuery);
  }, [searchQuery, getSuggestions]);

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        await requestLocationPermission();
      } catch (error) {
        showSnackbar('Location services are not available');
      }
    };

    initializeLocation();
  }, [requestLocationPermission, showSnackbar]);

  const renderPlaceItem = useCallback(
    ({ item }: { item: Place }) => (
      <PlaceItem
        place={item}
        onPress={() => handlePlacePress(item)}
        onViewMap={() => handleViewMap(item)}
      />
    ),
    [handlePlacePress, handleViewMap],
  );

  const ItemSeparator = useCallback(() => <View style={styles.separator} />, []);

  const renderContent = useMemo(() => {
    if (loading) {
      return <LoadingState />;
    }

    if (places.length > 0) {
      return (
        <FlatList
          data={places}
          keyExtractor={item => item.place_id || item.name}
          renderItem={({ item }) => (
            <PlaceItem
              place={item}
              onPress={() => handlePlacePress(item)}
              onViewMap={() => handleViewMap(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={loading ? <LoadingState /> : <EmptyState />}
        />
      );
    }

    return <EmptyState />;
  }, [loading, places, renderPlaceItem, ItemSeparator]);

  const handleSearchChange = useCallback((text: string) => {
    setPlaces([]);
    setSearchQuery(text);
    setShowSuggestions(true);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchQuery('');
    setShowSuggestions(false);
    setSuggestions([]);
    setPlaces([]);
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search for places..."
          onChangeText={handleSearchChange}
          value={searchQuery}
          onSubmitEditing={searchPlaces}
          style={styles.searchBar}
          icon="magnify"
          clearIcon="close"
          onClearIconPress={handleSearchClear}
          onFocus={() => setShowSuggestions(true)}
          placeholderTextColor={COLORS.onSurfaceVariant}
          theme={{
            fonts: {
              bodyLarge: {
                fontSize: getResponsiveFontSize(16),
              },
            },
          }}
        />
      </View>

      <SuggestionList
        suggestions={suggestions}
        onSuggestionPress={handleSuggestionPress}
        visible={showSuggestions && suggestions.length > 0}
        searchQuery={searchQuery}
      />

      <View style={styles.content}>{renderContent}</View>

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
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  searchContainer: {
    paddingHorizontal: getResponsivePadding(16),
    paddingTop: getResponsivePadding(16),
    paddingBottom: getResponsivePadding(8),
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#F3F4F6',
    borderRadius: getResponsivePadding(12),
    height: getResponsiveHeight(48),
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: getResponsiveMargin(16),
    color: COLORS.primary,
    fontSize: getResponsiveFontSize(16),
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: getResponsivePadding(32),
  },
  emptyIcon: {
    marginBottom: getResponsiveMargin(16),
  },
  emptyTitle: {
    color: COLORS.primary,
    marginBottom: getResponsiveMargin(8),
    fontSize: getResponsiveFontSize(20),
  },
  emptySubtitle: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: getResponsiveFontSize(16),
  },
  fab: {
    position: 'absolute',
    right: getResponsiveMargin(16),
    bottom: getBottomTabHeight() + getResponsiveMargin(26),
    backgroundColor: COLORS.primary,
    borderRadius: getResponsivePadding(16),
  },
  listContent: {
    flexGrow: 1,
    paddingTop: getResponsivePadding(16),
    paddingBottom: getBottomTabHeight() + getResponsivePadding(16),
    marginTop: getResponsiveMargin(5),
  },
  separator: {
    height: getResponsiveHeight(8),
  },
  snackbar: {
    position: 'absolute',
    bottom: getBottomTabHeight() + getResponsiveMargin(16),
    left: getResponsiveMargin(16),
    right: getResponsiveMargin(16),
  },
});

export default HomeScreen;
