export const TAB_BAR_HEIGHT = 49; // Standard tab bar height
export const INDIA_CENTER = {
  lat: 20.5937,
  lng: 78.9629,
}; // India's approximate center coordinates
export const BASE_URL = process.env.BASE_URL;

export const COLORS = {
  // Primary colors
  primary: '#2196F3',
  primaryLight: '#64B5F6',
  primaryDark: '#1976D2',
  onPrimary: '#FFFFFF',

  // Secondary colors
  secondary: '#FF4081',
  secondaryLight: '#FF80AB',
  secondaryDark: '#F50057',

  // Status colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  info: '#2196F3',

  // Text colors
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textHint: '#9E9E9E',
  textDisabled: '#BDBDBD',

  // Background colors
  background: '#FFFFFF',
  surface: '#F5F5F5',
  card: '#FFFFFF',
  onSurface: '#1A1A1A',

  // Rating colors
  rating: '#FFD700',
  ratingBackground: '#FFF9C4',

  // Status indicators
  openStatus: '#4CAF50',
  closedStatus: '#F44336',
  openStatusBackground: '#E8F5E9',
  closedStatusBackground: '#FFEBEE',

  // Chip colors
  chipBackground: '#F5F5F5',
  chipBorder: '#E0E0E0',
  priceChipBackground: '#E8F5E9',
  priceChipBorder: '#C8E6C9',
  priceChipText: '#2E7D32',
  bottomTab: '#40E0D0',

  // Border colors
  border: '#E0E0E0',
  divider: '#F5F5F5',

  // Button colors
  buttonText: '#FFFFFF',
  buttonDisabled: '#BDBDBD',

  surfaceVariant: '#F5F5F5',
  onSurfaceVariant: '#666666',
};

export const STORAGE_KEYS = {
  SEARCH_HISTORY: '@search_history',
};

export const getIconName = (type: string): string => {
  switch (type) {
    case 'restaurant':
      return 'restaurant';
    case 'cafe':
      return 'local-cafe';
    case 'bar':
      return 'local-bar';
    case 'lodging':
      return 'hotel';
    case 'shopping_mall':
      return 'shopping-cart';
    case 'store':
      return 'store';
    case 'gas_station':
      return 'local-gas-station';
    case 'parking':
      return 'local-parking';
    case 'atm':
      return 'atm';
    case 'bank':
      return 'account-balance';
    case 'hospital':
      return 'local-hospital';
    case 'pharmacy':
      return 'local-pharmacy';
    case 'school':
      return 'school';
    case 'university':
      return 'account-balance';
    case 'museum':
      return 'museum';
    case 'art_gallery':
      return 'photo-library';
    case 'church':
      return 'church';
    case 'mosque':
      return 'mosque';
    case 'synagogue':
      return 'synagogue';
    case 'hindu_temple':
      return 'temple-hindu';
    case 'stadium':
      return 'sports-soccer';
    case 'gym':
      return 'fitness-center';
    case 'beach':
      return 'beach-access';
    case 'park':
      return 'park';
    case 'zoo':
      return 'pets';
    case 'aquarium':
      return 'pool';
    case 'movie_theater':
      return 'movie';
    case 'night_club':
      return 'nightlife';
    case 'amusement_park':
      return 'attractions';
    case 'bowling_alley':
      return 'sports-cricket';
    case 'casino':
      return 'casino';
    case 'spa':
      return 'spa';
    case 'hair_care':
      return 'content-cut';
    case 'beauty_salon':
      return 'face';
    case 'car_wash':
      return 'local-car-wash';
    case 'car_repair':
      return 'build';
    case 'car_dealer':
      return 'directions-car';
    case 'dentist':
      return 'medical-services';
    case 'doctor':
      return 'medical-services';
    case 'veterinary_care':
      return 'pets';
    case 'post_office':
      return 'local-post-office';
    case 'police':
      return 'local-police';
    case 'fire_station':
      return 'local-fire-department';
    case 'embassy':
      return 'account-balance';
    case 'city_hall':
      return 'account-balance';
    case 'courthouse':
      return 'gavel';
    case 'library':
      return 'local-library';
    case 'transit_station':
      return 'train';
    case 'subway_station':
      return 'subway';
    case 'train_station':
      return 'train';
    case 'bus_station':
      return 'directions-bus';
    case 'taxi_stand':
      return 'local-taxi';
    case 'airport':
      return 'flight';
    case 'ferry_terminal':
      return 'directions-boat';
    case 'light_rail_station':
      return 'tram';
    case 'point_of_interest':
    default:
      return 'place';
  }
};
