import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HistoryScreen from '../screens/HistoryScreen';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import SplashScreen from '../screens/SplashScreen';
import {COLORS} from '../utils/constants';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{title: 'Search Places'}}
    />
    <Stack.Screen
      name="MapDetail"
      component={MapScreen}
      options={{title: 'Place Details'}}
    />
  </Stack.Navigator>
);

const getTabBarIcon =
  route =>
  ({focused, color, size}) => {
    let iconName;

    if (route.name === 'Home') {
      iconName = 'search';
    } else if (route.name === 'Map') {
      iconName = 'map';
    } else if (route.name === 'History') {
      iconName = 'history';
    }

    return <Icon name={iconName} size={size} color={color} />;
  };

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: getTabBarIcon(route),
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashComplete(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!isSplashComplete ? (
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : (
        <Stack.Screen name="Main" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
