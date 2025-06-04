import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Alert, FlatList, StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  FAB,
  Snackbar,
  Text,
} from 'react-native-paper';

import SearchHistoryItem from '../components/SearchHistoryItem';
import StorageService from '../services/StorageService';
import {COLORS} from '../utils/constants';

const HistoryScreen = ({navigation}) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, []),
  );

  const loadHistory = async () => {
    setLoading(true);
    try {
      const searchHistory = await StorageService.getSearchHistory();
      setHistory(searchHistory);
    } catch (error) {
      console.error('Error loading history:', error);
      showSnackbar('Error loading search history');
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = item => {
    navigation.navigate('Home', {
      screen: 'MapDetail',
      params: {place: item},
    });
  };

  const handleDeleteItem = async placeId => {
    Alert.alert(
      'Remove from History',
      'Are you sure you want to remove this item from your search history?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedHistory = await StorageService.removeFromHistory(
                placeId,
              );
              setHistory(updatedHistory);
              showSnackbar('Item removed from history');
            } catch (error) {
              console.error('Error removing item:', error);
              showSnackbar('Error removing item');
            }
          },
        },
      ],
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to clear all search history? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.clearSearchHistory();
              setHistory([]);
              showSnackbar('Search history cleared');
            } catch (error) {
              console.error('Error clearing history:', error);
              showSnackbar('Error clearing history');
            }
          },
        },
      ],
    );
  };

  const showSnackbar = message => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const renderHistoryItem = ({item}) => (
    <SearchHistoryItem
      item={item}
      onPress={handleItemPress}
      onDelete={handleDeleteItem}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No Search History
      </Text>
      <Text variant="bodyLarge" style={styles.emptySubtitle}>
        Your searched places will appear here for quick access
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Home')}
        style={styles.searchButton}>
        Start Searching
      </Button>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Search History
        </Text>
        {history.length > 0 && (
          <Text variant="bodyMedium" style={styles.headerSubtitle}>
            {history.length} place{history.length !== 1 ? 's' : ''} saved
          </Text>
        )}
      </View>

      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={item =>
          item.place_id
            ? `history-${item.place_id}`
            : `history-${item.name}-${item.geometry?.location?.lat}-${item.geometry?.location?.lng}`
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={history.length ? {} : styles.emptyContainer}
      />

      {history.length > 0 && (
        <FAB
          icon="delete-sweep"
          style={styles.fab}
          onPress={handleClearAll}
          label="Clear All"
        />
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}>
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.surface,
    elevation: 2,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: COLORS.onSurface,
  },
  headerSubtitle: {
    color: '#666',
    marginTop: 4,
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
    marginBottom: 24,
  },
  searchButton: {
    paddingHorizontal: 24,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.error,
  },
});

export default HistoryScreen;
