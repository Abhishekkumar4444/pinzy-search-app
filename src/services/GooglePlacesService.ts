import axios from 'axios';
import { BASE_URL, GOOGLE_PLACES_API_KEY, INDIA_CENTER } from '../utils/constants';

class GooglePlacesService {
  async getAutocompleteSuggestions(
    query: string,
    sessionToken: string | null = null,
  ): Promise<AutocompletePrediction[]> {
    try {
      const response = await axios.get<{
        predictions: AutocompletePrediction[];
        status: string;
      }>(`${BASE_URL}/autocomplete/json`, {
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

  async searchPlaces(query: string): Promise<PlaceSearchResult[]> {
    try {
      const response = await axios.get<PlaceSearchResponse>(`${BASE_URL}/textsearch/json`, {
        params: {
          query,
          key: GOOGLE_PLACES_API_KEY,
          location: `${INDIA_CENTER.lat},${INDIA_CENTER.lng}`,
          radius: '5000000', // 5000km radius to cover all of India
          region: 'in', // Region biasing for India
          fields: 'place_id,name,formatted_address,geometry,vicinity', // Request specific fields
        },
      });
      const results = response.data.results;
      return results;
    } catch (error) {
      console.error('Error searching places:', error);
      throw error;
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    try {
      const response = await axios.get<PlaceDetailsResponse>(`${BASE_URL}/details/json`, {
        params: {
          place_id: placeId,
          key: GOOGLE_PLACES_API_KEY,
          fields:
            'place_id,name,formatted_address,geometry,vicinity,rating,user_ratings_total,price_level,opening_hours,types,photos,formatted_phone_number,website,reviews',
          region: 'in', // Region biasing for India
        },
      });
      return response.data.result;
    } catch (error) {
      console.error('Error getting place details:', error);
      throw error;
    }
  }

  async getNearbyPlaces(
    latitude: number,
    longitude: number,
    radius: number = 5000,
    type: string = '',
  ): Promise<PlaceSearchResult[]> {
    try {
      const response = await axios.get<PlaceSearchResponse>(`${BASE_URL}/nearbysearch/json`, {
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
