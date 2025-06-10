import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface Location {
  lat: number;
  lng: number;
}

export interface Geometry {
  location: Location;
  viewport?: {
    northeast: Location;
    southwest: Location;
  };
}

export interface Photo {
  height: number;
  width: number;
  html_attributions: string[];
  photo_reference: string;
}

export interface OpeningHours {
  open_now: boolean;
  periods?: {
    open: {
      day: number;
      time: string;
    };
    close: {
      day: number;
      time: string;
    };
  }[];
  weekday_text?: string[];
}

export interface Place {
  place_id?: string;
  name: string;
  formatted_address?: string;
  vicinity?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types?: string[];
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  opening_hours?: {
    open_now: boolean;
  };
  distance?: number;
  timestamp?: number;
}

export interface PlaceSuggestion {
  description: string;
  place_id: string;
}

export interface AutocompletePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types: string[];
}

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  MapDetail: { place: Place };
  Settings: undefined;
};

export type TabParamList = {
  Home: undefined;
  Map: undefined;
  History: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;

export type NavigationProps = RootStackNavigationProp & TabNavigationProp;
