import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { LogBox, StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/utils/constants';

// Ignore all warning messages
LogBox.ignoreAllLogs();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.info} />
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
