import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HistoryScreen from '../screens/HistoryScreen';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import SplashScreen from '../screens/SplashScreen';
import { RootStackParamList, TabParamList } from '../types/navigation';
import { COLORS } from '../utils/constants';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const HomeStack: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Search Places' }} />
    <Stack.Screen name="MapDetail" component={MapScreen} options={{ title: 'Place Details' }} />
  </Stack.Navigator>
);
HomeStack.displayName = 'HomeStack';

const getTabBarIcon = (route: keyof TabParamList) =>
  function TabBarIcon({ focused, color, size }: TabBarIconProps) {
    let iconName: string;
    switch (route) {
      case 'Home':
        iconName = 'search';
        break;
      case 'Map':
        iconName = 'map';
        break;
      case 'History':
        iconName = 'history';
        break;
      default:
        iconName = 'search';
    }
    return (
      <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
        <Icon name={iconName} size={size} color={color} />
      </View>
    );
  };

const MainTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: getTabBarIcon(route.name as keyof TabParamList),
      tabBarActiveTintColor: '#40E0D0',
      tabBarInactiveTintColor: '#B8E0E0',
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabBarLabel,
      tabBarShowLabel: true,
      tabBarHideOnKeyboard: true,
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: 'Search' }} />
    <Tab.Screen name="Map" component={MapScreen} options={{ tabBarLabel: 'Map' }} />
    <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarLabel: 'History' }} />
  </Tab.Navigator>
);

MainTabs.displayName = 'MainTabs';

const AppNavigator: React.FC = () => {
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsSplashComplete(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isSplashComplete ? (
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : (
        <Stack.Screen name="Main" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
};
AppNavigator.displayName = 'AppNavigator';

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    elevation: 0,
    backgroundColor: '#374151',
    borderRadius: 16,
    height: 70,
    borderTopWidth: 0,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    paddingBottom: 0,
    paddingTop: 0,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  activeIconContainer: {
    backgroundColor: COLORS.primary + '15',
  },
});

export default AppNavigator;
