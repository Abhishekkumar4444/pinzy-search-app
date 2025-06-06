import debounce from 'lodash/debounce';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  ActivityIndicator,
  Card,
  FAB,
  List,
  Searchbar,
  Snackbar,
  Text,
} from 'react-native-paper';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        await requestLocationPermission();
        await loadSearchHistory();
      } catch (error) {
        console.warn('Location initialization failed:', error);
        showSnackbar('Location services are not available');
      }
    };

    initializeLocation();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const history = await StorageService.getSearchHistory();
      setSearchHistory(history);
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

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

  const handleHistorySearch = async item => {
    setSearchQuery(item.name);
    setShowSuggestions(false);
    setLoading(true);

    try {
      const results = await GooglePlacesService.searchPlaces(item.name);
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

  const handleHistoryViewMap = item => {
    navigation.navigate('MapDetail', {place: item});
  };

  const renderPlaceItem = ({item}) => (
    <PlaceItem
      place={item}
      onPress={() => handlePlacePress(item)}
      onViewMap={() => handleViewMap(item)}
    />
  );

  const renderHistoryItem = ({item}) => (
    <Card style={styles.historyCard} mode="elevated">
      <Card.Content style={styles.historyCardContent}>
        <View style={styles.historyIconContainer}>
          <Icon name="history" size={24} color={COLORS.primary} />
        </View>
        <View style={styles.historyTextContainer}>
          <Text
            variant="titleMedium"
            numberOfLines={1}
            style={styles.historyName}>
            {item.name}
          </Text>
          <Text
            variant="bodySmall"
            style={styles.historyAddress}
            numberOfLines={1}>
            {item.vicinity || item.formatted_address}
          </Text>
        </View>
      </Card.Content>
      <Card.Actions style={styles.historyCardActions}>
        <Pressable
          onPress={() => handleHistorySearch(item)}
          style={styles.historyAction}>
          <Icon name="search" size={20} color={COLORS.primary} />
          <Text style={styles.historyActionText}>Search</Text>
        </Pressable>
        <View style={styles.historyActionDivider} />
        <Pressable
          onPress={() => handleHistoryViewMap(item)}
          style={styles.historyAction}>
          <Icon name="map" size={20} color={COLORS.primary} />
          <Text style={styles.historyActionText}>View Map</Text>
        </Pressable>
      </Card.Actions>
    </Card>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Searching places...</Text>
        </View>
      );
    }

    if (places.length > 0) {
      return (
        <FlatList
          data={places}
          renderItem={renderPlaceItem}
          keyExtractor={item =>
            String(item?.place_id || item?.id || Math.random())
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingVertical: 8}}
          ItemSeparatorComponent={() => <View style={{height: 12}} />}
        />
      );
    }

    return (
      <View style={styles.historyContainer}>
        <View style={styles.historyHeader}>
          <Text variant="headlineSmall" style={styles.historyTitle}>
            Recent Searches
          </Text>
          {searchHistory.length > 0 && (
            <Pressable
              onPress={() => {
                StorageService.clearSearchHistory();
                setSearchHistory([]);
              }}
              style={styles.clearHistoryButton}>
              <Icon name="delete-sweep" size={20} color={COLORS.primary} />
              <Text style={styles.clearHistoryText}>Clear All</Text>
            </Pressable>
          )}
        </View>
        {searchHistory.length > 0 ? (
          <FlatList
            data={searchHistory}
            renderItem={renderHistoryItem}
            keyExtractor={item => String(item.place_id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.historyList}
            ItemSeparatorComponent={() => <View style={{height: 12}} />}
          />
        ) : (
          <View style={styles.emptyState}>
            <Icon
              name="search"
              size={48}
              color={COLORS.primary}
              style={styles.emptyIcon}
            />
            <Text variant="headlineSmall" style={styles.emptyTitle}>
              Discover Places
            </Text>
            <Text variant="bodyLarge" style={styles.emptySubtitle}>
              Search for restaurants, hotels, attractions, and more
            </Text>
          </View>
        )}
      </View>
    );
  };

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
          onClearIconPress={() => {
            setSearchQuery('');
            setShowSuggestions(false);
            setSuggestions([]);
            setPlaces([]);
          }}
          onFocus={() => setShowSuggestions(true)}
        />
      </View>
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsWrapper}>
          <View style={styles.suggestionsContainer}>
            <ScrollView
              style={styles.suggestionsList}
              contentContainerStyle={styles.suggestionsContent}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}>
              {suggestions.map(item => (
                <List.Item
                  key={item.place_id}
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
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      <View style={styles.content}>{renderContent()}</View>

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
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    marginTop: 12,
    color: COLORS.text,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.8,
  },
  emptyTitle: {
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  emptySubtitle: {
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
  },
  suggestionsWrapper: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
  },
  suggestionsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: 300,
  },
  suggestionsList: {
    maxHeight: 300,
  },
  suggestionsContent: {
    paddingVertical: 8,
  },
  suggestionItem: {
    paddingVertical: 4,
  },
  suggestionTitle: {
    fontSize: 14,
    color: COLORS.text,
  },
  suggestionDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  historyContainer: {
    flex: 1,
    paddingTop: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  historyTitle: {
    color: COLORS.text,
    fontWeight: '600',
  },
  clearHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  clearHistoryText: {
    color: COLORS.primary,
    marginLeft: 4,
    fontSize: 14,
  },
  historyCard: {
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    elevation: 2,
  },
  historyCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyTextContainer: {
    flex: 1,
  },
  historyName: {
    color: COLORS.text,
    fontWeight: '500',
  },
  historyAddress: {
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  historyCardActions: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 8,
  },
  historyAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  historyActionText: {
    marginLeft: 4,
    color: COLORS.primary,
    fontSize: 14,
  },
  historyActionDivider: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.border,
  },
  historyList: {
    paddingBottom: 16,
  },
});

export default HomeScreen;
