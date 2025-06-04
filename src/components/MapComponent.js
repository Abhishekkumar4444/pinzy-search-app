import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

const MapComponent = ({
  region,
  markers = [],
  onMarkerPress,
  onRegionChange,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={onRegionChange}
        showsUserLocation={true}
        showsMyLocationButton={true}>
        {markers.map((marker, index) => (
          <Marker
            key={`${marker.place_id || 'unknown'}-${index}`}
            coordinate={{
              latitude: marker.geometry.location.lat,
              longitude: marker.geometry.location.lng,
            }}
            title={marker.name}
            description={marker.formatted_address || marker.vicinity}
            onPress={() => onMarkerPress && onMarkerPress(marker)}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapComponent;
