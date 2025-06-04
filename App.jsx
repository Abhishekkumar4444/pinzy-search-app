import React from 'react';
import {StatusBar, LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';

// Ignore all warning messages
LogBox.ignoreAllLogs();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#6200ee" />
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
