import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Region as MapRegion, Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface Props {
  region: MapRegion;
  markers?: Place[];
  onMarkerPress?: (marker: Place) => void;
  onRegionChange?: (region: MapRegion) => void;
  style?: any;
}

const MapComponent = ({ region, markers = [], onMarkerPress, onRegionChange, style }: Props) => {
  const mapRef = useRef<MapView>(null);

  const handleMarkerPress = (marker: Place) => {
    if (mapRef.current && marker.geometry?.location) {
      const { lat, lng } = marker.geometry.location;
      mapRef.current.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000,
      );
    }
    onMarkerPress?.(marker);
  };

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={onRegionChange}
        showsUserLocation={true}
        showsMyLocationButton={true}
        provider={PROVIDER_GOOGLE}
        zoomEnabled={true}
        zoomControlEnabled={true}
        rotateEnabled={true}
        scrollEnabled={true}
        mapPadding={{ top: 0, right: 0, bottom: 0, left: 0 }}
        pitchEnabled={true}
        moveOnMarkerPress={true}
        minZoomLevel={2}
        maxZoomLevel={20}
        showsIndoorLevelPicker={true}
        userInterfaceStyle="dark"
        loadingEnabled={true}
        toolbarEnabled={true}
      >
        {markers.map((marker, index) => (
          <Marker
            key={`${marker.place_id || 'unknown'}-${index}`}
            coordinate={{
              latitude: marker.geometry.location.lat,
              longitude: marker.geometry.location.lng,
            }}
            title={marker.name}
            description={marker.formatted_address || marker.vicinity}
            onPress={() => handleMarkerPress(marker)}
            tracksViewChanges={false}
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
