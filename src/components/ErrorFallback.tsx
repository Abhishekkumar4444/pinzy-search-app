import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Something went wrong.</Text>
    <Text style={styles.error}>{error?.toString()}</Text>
    <TouchableOpacity onPress={resetError} style={styles.buttonContainer}>
      <Text style={styles.button}>Try Again</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: 'red' },
  error: { color: 'black', marginBottom: 8 },
  buttonContainer: { marginTop: 16 },
  button: { color: 'blue', fontWeight: 'bold', fontSize: 16 },
});

export default ErrorFallback;
