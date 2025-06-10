import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Place } from '../types/navigation';
import { COLORS } from '../utils/constants';

interface PlaceItemProps {
  place: Place;
  onPress: () => void;
  onViewMap: () => void;
}

const PlaceIcon: React.FC<{ type: string }> = ({ type }) => {
  const getIconName = (type: string): string => {
    switch (type) {
      case 'restaurant':
        return 'restaurant';
      case 'cafe':
        return 'local-cafe';
      case 'bar':
        return 'local-bar';
      case 'hotel':
        return 'hotel';
      case 'shopping':
        return 'shopping-bag';
      case 'attraction':
        return 'attractions';
      default:
        return 'place';
    }
  };

  return (
    <View style={styles.iconContainer}>
      <Icon name={getIconName(type)} size={20} color={COLORS.primary} />
    </View>
  );
};

const PlaceItem: React.FC<PlaceItemProps> = ({ place, onPress, onViewMap }) => {
  const handlePress = () => {
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Card style={styles.card} mode="elevated">
        <Card.Content style={styles.cardContent}>
          <View style={styles.mainContent}>
            <PlaceIcon type={place.types?.[0] || 'place'} />
            <View style={styles.textContainer}>
              <Text variant="titleMedium" style={styles.name} numberOfLines={1}>
                {place.name}
              </Text>
              <Text variant="bodySmall" style={styles.address} numberOfLines={1}>
                {place.formatted_address || place.vicinity}
              </Text>
            </View>
            <IconButton
              icon="map"
              size={20}
              iconColor={COLORS.primary}
              onPress={onViewMap}
              style={styles.mapButton}
            />
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    color: '#1F2937',
    fontWeight: '600',
    marginBottom: 2,
  },
  address: {
    color: '#6B7280',
  },
  mapButton: {
    margin: 0,
    marginLeft: 'auto',
    backgroundColor: COLORS.primary + '10',
  },
});

export default PlaceItem;
