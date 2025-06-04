import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Card, Chip, Divider, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PlaceItem = ({place, onPress, onViewMap}) => {
  const getRating = () => {
    if (place.rating) {
      return (
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#ffc107" />
          <Text variant="bodySmall" style={styles.ratingText}>
            {place.rating.toFixed(1)}
            {place.user_ratings_total && (
              <Text style={styles.ratingCount}>
                {' '}
                ({place.user_ratings_total})
              </Text>
            )}
          </Text>
        </View>
      );
    }
    return null;
  };

  const getPriceLevel = () => {
    if (place.price_level !== undefined) {
      return (
        <Chip compact mode="outlined" style={styles.priceChip}>
          {'$'.repeat(place.price_level + 1)}
        </Chip>
      );
    }
    return null;
  };

  const getDistance = () => {
    if (place.distance) {
      return (
        <View style={styles.distanceContainer}>
          <Icon name="directions-walk" size={16} color="#666" />
          <Text variant="bodySmall" style={styles.distanceText}>
            {place.distance.toFixed(1)} km
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium" style={styles.name}>
            {place.name}
          </Text>
          {getRating()}
        </View>

        <View style={styles.addressContainer}>
          <Icon
            name="location-on"
            size={16}
            color="#666"
            style={styles.addressIcon}
          />
          <Text variant="bodyMedium" style={styles.address}>
            {place.formatted_address || place.vicinity}
          </Text>
        </View>

        {getDistance()}

        <Divider style={styles.divider} />

        <View style={styles.footer}>
          <View style={styles.tagsContainer}>
            {place.types &&
              place.types.slice(0, 2).map((type, index) => (
                <Chip
                  key={index}
                  compact
                  mode="outlined"
                  style={styles.typeChip}>
                  {type.replace(/_/g, ' ')}
                </Chip>
              ))}
            {getPriceLevel()}
          </View>

          {place.opening_hours && (
            <View style={styles.openStatusContainer}>
              <Icon
                name={
                  place.opening_hours.open_now ? 'schedule' : 'schedule-off'
                }
                size={16}
                color={place.opening_hours.open_now ? '#4caf50' : '#f44336'}
              />
              <Text
                variant="bodySmall"
                style={[
                  styles.openStatus,
                  {
                    color: place.opening_hours.open_now ? '#4caf50' : '#f44336',
                  },
                ]}>
                {place.opening_hours.open_now ? 'Open now' : 'Closed'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <Button
            mode="outlined"
            compact
            onPress={onViewMap}
            icon="map"
            style={styles.mapButton}>
            View on Map
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    flex: 1,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
  },
  ratingCount: {
    color: '#666',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  addressIcon: {
    marginTop: 2,
    marginRight: 4,
  },
  address: {
    color: '#666',
    flex: 1,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  distanceText: {
    marginLeft: 4,
    color: '#666',
  },
  divider: {
    marginVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  typeChip: {
    marginRight: 6,
    marginBottom: 4,
  },
  priceChip: {
    marginRight: 6,
    marginBottom: 4,
  },
  openStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  openStatus: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  mapButton: {
    borderColor: '#6200ee',
  },
});

export default PlaceItem;
