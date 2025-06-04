import React from 'react';
import {StyleSheet, View} from 'react-native';
import {List, IconButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SearchHistoryItem = ({item, onPress, onDelete}) => {
  return (
    <List.Item
      title={item.name}
      description={item.formatted_address || item.vicinity}
      left={props => <List.Icon {...props} icon="history" />}
      right={props => (
        <View style={styles.rightActions}>
          <IconButton
            {...props}
            icon="map"
            size={20}
            onPress={() => onPress(item)}
          />
          <IconButton
            {...props}
            icon="delete"
            size={20}
            onPress={() => onDelete(item.place_id)}
          />
        </View>
      )}
      onPress={() => onPress(item)}
      style={styles.item}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SearchHistoryItem;