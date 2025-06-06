import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, IconButton, Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../utils/constants';

const SearchHistoryItem = ({item, onPress, onDelete}) => {
  const theme = useTheme();

  return (
    <Card style={styles.card} mode="elevated" onPress={() => onPress(item)}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.mainContent}>
          <View style={styles.iconContainer}>
            <Icon name="history" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
              {item.name}
            </Text>
            <Text
              variant="bodyMedium"
              style={styles.description}
              numberOfLines={2}>
              {item.formatted_address || item.vicinity}
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          <IconButton
            icon="map"
            size={20}
            mode="contained-tonal"
            containerColor={COLORS.primary + '15'}
            iconColor={COLORS.primary}
            onPress={() => onPress(item)}
            style={styles.actionButton}
          />
          <IconButton
            icon="delete"
            size={20}
            mode="contained-tonal"
            containerColor={COLORS.error + '15'}
            iconColor={COLORS.error}
            onPress={() => onDelete(item.place_id)}
            style={styles.actionButton}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    padding: 12,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontWeight: '600',
    color: COLORS.onSurface,
    marginBottom: 4,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  actionButton: {
    margin: 0,
    marginLeft: 8,
  },
});

export default SearchHistoryItem;
