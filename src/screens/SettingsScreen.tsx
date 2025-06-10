import React, { useCallback } from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../utils/constants';
import {
  getResponsiveFontSize,
  getResponsiveMargin,
  getResponsivePadding,
} from '../utils/responsive';

const SettingsScreen = () => {
  const openSettings = useCallback(async () => {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');
      } else {
        await Linking.openSettings();
      }
    } catch (error) {
      console.error('Error opening settings:', error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.iconContainer}>
            <Icon name="location-on" size={48} color={COLORS.primary} />
          </View>
          <Text variant="headlineSmall" style={styles.title}>
            Location Access Required
          </Text>
          <Text variant="bodyLarge" style={styles.description}>
            To show nearby places and provide accurate search results, we need access to your
            location. Please enable location services in your device settings.
          </Text>
          <Button
            mode="contained"
            onPress={openSettings}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Open Settings
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: getResponsivePadding(16),
  },
  card: {
    marginTop: getResponsiveMargin(16),
    borderRadius: getResponsivePadding(16),
    elevation: 2,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: getResponsiveMargin(24),
  },
  title: {
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: getResponsiveMargin(16),
    fontSize: getResponsiveFontSize(24),
    fontWeight: '600',
  },
  description: {
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: getResponsiveMargin(24),
    fontSize: getResponsiveFontSize(16),
    lineHeight: getResponsiveFontSize(24),
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: getResponsivePadding(12),
  },
  buttonContent: {
    paddingVertical: getResponsivePadding(8),
  },
});

export default SettingsScreen;
