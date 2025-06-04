import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Card, Chip, Divider, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../utils/constants';

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
          <Text
            variant="titleMedium"
            style={[styles.name, {flexShrink: 1}]}
            numberOfLines={2}>
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
          <Text variant="bodyMedium" style={styles.address} numberOfLines={2}>
            {place.formatted_address || place.vicinity}
          </Text>
        </View>

        {getDistance()}

        <Divider style={styles.divider} />

        <View style={styles.footer}>
          <View style={[styles.tagsContainer, {flexShrink: 1}]}>
            {place.types &&
              place.types.slice(0, 2).map((type, index) => (
                <Chip
                  key={index}
                  compact
                  mode="outlined"
                  style={[styles.typeChip, {maxWidth: '80%'}]}>
                  <Text numberOfLines={1} style={{fontSize: 12}}>
                    {type.replace(/_/g, ' ')}
                  </Text>
                </Chip>
              ))}
            {getPriceLevel()}
          </View>

          {place.opening_hours && (
            <View style={[styles.openStatusContainer, {marginLeft: 8}]}>
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
            style={styles.mapButton}
            labelStyle={{
              color: COLORS.primary,
              fontWeight: '600',
              fontSize: 14,
            }}
            contentStyle={{
              height: 36,
              paddingHorizontal: 16,
            }}>
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
    elevation: 3,
    backgroundColor: '#f5f7fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: COLORS.primary + '08',
    padding: 12,
    borderRadius: 8,
  },
  name: {
    flex: 1,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8e1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffc107' + '40',
  },
  ratingText: {
    marginLeft: 4,
    color: '#ffc107',
    fontWeight: '600',
  },
  ratingCount: {
    color: '#666',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
  },
  addressIcon: {
    marginTop: 2,
    marginRight: 4,
  },
  address: {
    color: '#2e7d32',
    flex: 1,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#e3f2fd',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  distanceText: {
    marginLeft: 4,
    color: '#1976d2',
    fontWeight: '500',
  },
  divider: {
    marginVertical: 8,
    backgroundColor: COLORS.primary + '15',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f3e5f5',
    padding: 12,
    borderRadius: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  typeChip: {
    marginRight: 6,
    marginBottom: 4,
    backgroundColor: '#fff',
    borderColor: COLORS.primary + '30',
  },
  priceChip: {
    marginRight: 6,
    marginBottom: 4,
    backgroundColor: '#fff',
    borderColor: COLORS.primary + '30',
  },
  openStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  openStatus: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  mapButton: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
    borderRadius: 8,
    borderWidth: 1.5,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default PlaceItem;
