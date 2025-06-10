import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { COLORS, getIconName } from '../utils/constants';

const PlaceIcon = ({ type }: { type: string }) => {
  return <Icon name={getIconName(type)} size={24} color={COLORS.primary} style={styles.icon} />;
};

const PlaceItem = ({ place, onPress, onViewMap }: PlaceItemProps) => {
  const renderRating = () =>
    place.rating && (
      <Animated.View style={styles.ratingContainer}>
        <Icon name="star" size={18} color="#FFD700" />
        <Text style={styles.ratingText}>
          {place.rating.toFixed(1)}
          {place.user_ratings_total && (
            <Text style={styles.ratingCount}> · {place.user_ratings_total}</Text>
          )}
        </Text>
      </Animated.View>
    );

  const handlePress = () => {
    onPress(place);
  };

  const handleViewMap = () => {
    if (onViewMap) {
      onViewMap(place);
    }
  };
  const walkIcon = () => <Icon name="directions-walk" size={16} color={COLORS.primary} />;
  const circleIcon = () => (
    <Icon
      name="check-circle"
      size={16}
      color={place.opening_hours?.open_now ? COLORS.success : COLORS.error}
    />
  );
  const scheduleIcon = () => (
    <Icon
      name="schedule"
      size={16}
      color={place.opening_hours?.open_now ? COLORS.success : COLORS.error}
    />
  );

  return (
    <Card style={styles.card} onPress={handlePress}>
      <Card.Content style={styles.content}>
        <View style={styles.headerContainer}>
          <View style={styles.titleSection}>
            <Text style={styles.title} numberOfLines={1}>
              {place.name}
            </Text>
            {renderRating()}
          </View>

          <View style={styles.locationInfo}>
            <PlaceIcon type={place.types?.[0] || 'point_of_interest'} />
            <Text style={styles.address} numberOfLines={1}>
              {place.formatted_address || place.vicinity}
            </Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          {place.distance && (
            <Chip style={styles.chip} icon={walkIcon}>
              {place.distance.toFixed(1)}km
            </Chip>
          )}

          {place.price_level !== undefined && (
            <Chip style={styles.chip}>{'$'.repeat(place.price_level + 1)}</Chip>
          )}

          {place.opening_hours && (
            <Chip
              style={[
                styles.chip,
                {
                  backgroundColor: place.opening_hours.open_now ? '#E8F5E9' : '#FFEBEE',
                },
              ]}
              icon={place.opening_hours.open_now ? circleIcon : scheduleIcon}
            >
              {place.opening_hours.open_now ? 'Open' : 'Closed'}
            </Chip>
          )}
        </View>

        <View style={styles.tagContainer}>
          {place.types?.slice(0, 3).map((type, index) => (
            <Chip key={index} style={styles.typeChip} textStyle={styles.chipText}>
              {type.replace(/_/g, ' ')}
            </Chip>
          ))}
        </View>

        {onViewMap && (
          <Button
            mode="contained"
            onPress={handleViewMap}
            icon="map-marker"
            style={styles.mapButton}
            contentStyle={styles.buttonContent}
          >
            View on Map
          </Button>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  content: {
    padding: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFA000',
  },
  ratingCount: {
    color: '#757575',
    fontSize: 12,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  chip: {
    backgroundColor: '#F5F5F5',
    height: 32,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeChip: {
    backgroundColor: COLORS.primary + '15',
    height: 28,
  },
  chipText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  mapButton: {
    marginTop: 8,
    borderRadius: 12,
    elevation: 0,
    backgroundColor: COLORS.primary,
  },
  buttonContent: {
    height: 44,
  },
  icon: {
    margin: 0,
  },
});

export default PlaceItem;
