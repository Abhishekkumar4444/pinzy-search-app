import axios from 'axios';
import {GOOGLE_PLACES_API_KEY} from '../utils/constants';

const BASE_URL = 'https://maps.googleapis.com/maps/api/place';

// India's approximate center coordinates
const INDIA_CENTER = {
  lat: 20.5937,
  lng: 78.9629,
};

class GooglePlacesService {
  async getAutocompleteSuggestions(query, sessionToken = null) {
    try {
      const response = await axios.get(`${BASE_URL}/autocomplete/json`, {
        params: {
          input: query,
          key: GOOGLE_PLACES_API_KEY,
          sessiontoken: sessionToken,
          types: 'establishment',
          components: 'country:in', // Restrict to India
          location: `${INDIA_CENTER.lat},${INDIA_CENTER.lng}`,
          radius: '5000000', // 5000km radius to cover all of India
        },
      });
      return response.data.predictions;
    } catch (error) {
      console.error('Error getting autocomplete suggestions:', error);
      throw error;
    }
  }

  async searchPlaces(query) {
    try {
      const response = await axios.get(`${BASE_URL}/textsearch/json`, {
        params: {
          query,
          key: GOOGLE_PLACES_API_KEY,
          location: `${INDIA_CENTER.lat},${INDIA_CENTER.lng}`,
          radius: '5000000', // 5000km radius to cover all of India
          region: 'in', // Region biasing for India
        },
      });
      return response.data.results;
    } catch (error) {
      console.error('Error searching places:', error);
      throw error;
    }
  }

  async getPlaceDetails(placeId) {
    try {
      const response = await axios.get(`${BASE_URL}/details/json`, {
        params: {
          place_id: placeId,
          key: GOOGLE_PLACES_API_KEY,
          fields:
            'name,formatted_address,geometry,rating,user_ratings_total,price_level,opening_hours,types,photos,formatted_phone_number,website,reviews',
          region: 'in', // Region biasing for India
        },
      });
      return response.data.result;
    } catch (error) {
      console.error('Error getting place details:', error);
      throw error;
    }
  }

  async getNearbyPlaces(latitude, longitude, radius = 5000, type = '') {
    try {
      const response = await axios.get(`${BASE_URL}/nearbysearch/json`, {
        params: {
          location: `${latitude},${longitude}`,
          radius,
          type,
          key: GOOGLE_PLACES_API_KEY,
          region: 'in', // Region biasing for India
        },
      });
      return response.data.results;
    } catch (error) {
      console.error('Error getting nearby places:', error);
      throw error;
    }
  }
}

export default new GooglePlacesService();
