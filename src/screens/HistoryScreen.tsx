import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { Button, Dialog, FAB, List, Text, TouchableRipple } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, TAB_BAR_HEIGHT } from '../utils/constants';
import {
  removeFromHistory,
  clearSearchHistory,
  getSearchHistory,
} from '../services/StorageService';

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <List.Icon icon="history" color={COLORS.warning} style={styles.emptyIcon} />
    <Text variant="titleLarge" style={styles.emptyText}>
      No Search History
    </Text>
    <Text variant="bodyMedium" style={styles.emptySubtext}>
      Your search history will appear here
    </Text>
  </View>
);

const LeftIcon = (props: any) => <List.Icon {...props} icon="map-marker" />;

const RightIconWrapper = (
  props: any,
  item: Place,
  onDelete: (id: string) => void,
): React.ReactElement => {
  return <RightIcon props={props} item={item} onDelete={onDelete} />;
};

const RightIcon = ({
  props,
  item,
  onDelete,
}: {
  props: any;
  item: Place;
  onDelete: (id: string) => void;
}) => (
  <TouchableRipple
    onPress={() => item.place_id && onDelete(item.place_id)}
    style={styles.deleteButton}
  >
    <List.Icon {...props} icon="delete" />
  </TouchableRipple>
);

const HistoryItem: React.FC<HistoryItemProps> = ({ item, onPress, onDelete }) => (
  <List.Item
    key={item.place_id}
    title={item.name}
    description={item.formatted_address || item.vicinity}
    left={LeftIcon}
    right={props => RightIconWrapper(props, item, onDelete)}
    onPress={() => onPress(item)}
    style={styles.listItem}
  />
);

const HistoryScreen = ({ navigation }: HistoryScreenProps) => {
  const insets = useSafeAreaInsets();
  const [history, setHistory] = useState<Place[]>([]);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      const searchHistory = await getSearchHistory();
      setHistory(searchHistory);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory]),
  );

  const handleItemPress = useCallback(
    (place: Place) => {
      navigation.navigate('MapDetail', { place });
    },
    [navigation],
  );

  const showDeleteDialog = useCallback((placeId: string) => {
    setItemToDelete(placeId);
    setDeleteDialogVisible(true);
  }, []);

  const handleDeleteItem = useCallback(async (placeId: string) => {
    try {
      await removeFromHistory(placeId);
      setHistory(prevHistory => prevHistory.filter(item => item.place_id !== placeId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }, []);

  const handleClearHistory = useCallback(() => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all search history? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearSearchHistory();
              setHistory([]);
            } catch (error) {
              console.error('Error clearing history:', error);
            }
          },
        },
      ],
    );
  }, []);

  const bottomPadding = useMemo(
    () =>
      Platform.select({
        ios: insets.bottom + TAB_BAR_HEIGHT + 16,
        android: TAB_BAR_HEIGHT + 50,
      }),
    [insets.bottom],
  );

  const fabStyle = useMemo(
    () => [styles.fab, { bottom: insets.bottom + TAB_BAR_HEIGHT + 56 }],
    [insets.bottom],
  );

  return (
    <View style={styles.container}>
      {history.length === 0 ? (
        <EmptyState />
      ) : (
        <List.Section style={[styles.listSection, { paddingBottom: bottomPadding }]}>
          {history.map(item => (
            <HistoryItem
              key={item.place_id}
              item={item}
              onPress={handleItemPress}
              onDelete={showDeleteDialog}
            />
          ))}
        </List.Section>
      )}

      {history.length > 0 && (
        <FAB icon="delete" style={fabStyle} onPress={handleClearHistory} label="Clear History" />
      )}

      <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
        <Dialog.Title>Delete History Item</Dialog.Title>
        <Dialog.Content>
          <Text>Are you sure you want to delete this item from your history?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
          <Button
            onPress={() => {
              if (itemToDelete) {
                handleDeleteItem(itemToDelete);
                setDeleteDialogVisible(false);
                setItemToDelete(null);
              }
            }}
            textColor={COLORS.error}
          >
            Delete
          </Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 64,
    height: 64,
  },
  emptyText: {
    color: COLORS.onSurface,
    marginBottom: 8,
  },
  emptySubtext: {
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
  },
  listSection: {
    flex: 1,
  },
  listItem: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    elevation: 2,
  },
  deleteButton: {
    borderRadius: 20,
    margin: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    backgroundColor: COLORS.error,
  },
});

export default HistoryScreen;
