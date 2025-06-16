type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};
interface Place {
  place_id?: string;
  id?: string;
  geometry: Geometry;
  name: string;
  formatted_address?: string;
  vicinity?: string;
  rating?: number;
  price_level?: number;
  opening_hours?: {
    open_now: boolean;
  };
  user_ratings_total?: number;
  distance?: number; // Optional distance property
  photos?: Array<{
    height: number;
    width: number;
    photo_reference: string;
    html_attributions?: Array<string>;
  }>;
  icon?: string;
  types?: Array<string>;
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: Array<string>;
  }>;
}

interface HistoryItem {
  name: string;
  vicinity?: string;
  formatted_address?: string;
}

interface SearchResults {
  place_id?: string;
  name: string;
  vicinity?: string;
  formatted_address?: string;
}
interface PlaceSuggestion {
  description: string;
  place_id: string;
}
interface HistoryItem {
  place_id?: string;
  name: string;
  vicinity?: string;
  formatted_address?: string;
  geometry?: Geometry;
  timestamp?: number;
}

interface RootStackParamList {
  Home: { screen: string; params: { place: HistoryItem } };
  MapDetail: { place: HistoryItem };
  [key: string]: object | undefined;
}
interface SearchHistoryItemProps {
  item: {
    name: string;
    formatted_address?: string;
    vicinity?: string;
    place_id: string;
  };
  onPress: (item: any) => void;
  onDelete: (placeId: string) => void;
}
interface LoadNearbyPlacesParams {
  latitude?: number;
  longitude?: number;
  radius?: number;
}
interface Marker extends Place {
  id?: string; // Optional ID for the marker
  title?: string; // Optional title for the marker
  description?: string; // Optional description for the marker
}
interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
}
interface Props {
  region: Region;
  markers?: Array<any>;
  onMarkerPress?: (marker: any) => void;
  onRegionChange?: (region: Region) => void;
  style?: any;
}
interface HistoryItemProps {
  item: Place;
  onPress: (place: Place) => void;
  onDelete: (placeId: string) => void;
}

interface PlaceItemProps {
  place: Place;
  onPress: (place: Place) => void;
  onViewMap?: (place: Place) => void;
}
interface RootStackParamList extends ParamListBase {
  MapDetail: { place: Place };
}
interface HomeScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}
interface HistoryScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

interface Suggestion {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

interface SuggestionListProps {
  suggestions: Suggestion[];
  onSuggestionPress: (suggestion: Suggestion) => void;
  visible: boolean;
  searchQuery: string;
}
interface AutocompletePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  terms: Array<{
    offset: number;
    value: string;
  }>;
  types: string[];
}

interface PlaceSearchResult {
  name: string;
  place_id: string;
  formatted_address: string;
  vicinity?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };
}

interface PlaceSearchResponse {
  results: PlaceSearchResult[];
  status: string;
}
interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  opening_hours?: {
    open_now: boolean;
    periods: Array<{
      open: { day: number; time: string };
      close: { day: number; time: string };
    }>;
  };
  types: string[];
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  formatted_phone_number?: string;
  website?: string;
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
}

interface PlaceDetailsResponse {
  result: PlaceDetails;
  status: string;
}
interface SearchLocation {
  name: string;
  place_id: string;
  formatted_address?: string;
  vicinity?: string;
  geometry: Geometry;
}
interface Geometry {
  location: {
    lat: number;
    lng: number;
  };
}
