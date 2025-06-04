import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../utils/constants';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="location-on" size={100} color={COLORS.secondary} />
        </View>
        <Text variant="headlineLarge" style={styles.title}>
          Location Search
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Discover places around you
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    marginTop: 20,
    color: COLORS.primary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    color: '#666666',
    textAlign: 'center',
  },
});

export default SplashScreen;
