import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, getIconName } from '../utils/constants';
import {
  getResponsiveFontSize,
  getResponsiveMargin,
  getResponsivePadding,
  getResponsiveWidth,
} from '../utils/responsive';

interface PlaceItemProps {
  place: Place;
  onPress: () => void;
  onViewMap: () => void;
}

const PlaceIcon: React.FC<{ type: string }> = ({ type }) => {
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
    <TouchableOpacity onPress={handlePress} activeOpacity={1}>
      <Card style={styles.card} mode="elevated">
        <Card.Content style={styles.cardContent}>
          <View style={styles.mainContent}>
            <PlaceIcon type={place.types?.[0] || 'place'} />
            <View style={styles.textContainer}>
              <Text variant="titleMedium" style={styles.name} numberOfLines={1}>
                {place.name}
              </Text>
              <Text variant="bodySmall" style={styles.address} numberOfLines={2}>
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
    marginHorizontal: getResponsiveMargin(16),
    marginVertical: getResponsiveMargin(4),
    backgroundColor: '#FFFFFF',
    borderRadius: getResponsivePadding(12),
    elevation: 2,
  },
  cardContent: {
    paddingVertical: getResponsivePadding(8),
    paddingHorizontal: getResponsivePadding(12),
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  iconContainer: {
    width: getResponsiveWidth(36),
    height: getResponsiveWidth(36),
    borderRadius: getResponsiveWidth(18),
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getResponsiveMargin(12),
    marginTop: getResponsiveMargin(2),
  },
  textContainer: {
    flex: 1,
    marginRight: getResponsiveMargin(8),
    justifyContent: 'center',
  },
  name: {
    color: '#1F2937',
    fontWeight: '600',
    marginBottom: getResponsiveMargin(2),
    fontSize: getResponsiveFontSize(16),
  },
  address: {
    color: '#6B7280',
    fontSize: getResponsiveFontSize(14),
    lineHeight: getResponsiveFontSize(18),
  },
  mapButton: {
    margin: 0,
    marginLeft: 'auto',
    backgroundColor: COLORS.primary + '10',
    alignSelf: 'center',
  },
});

export default PlaceItem;
