import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '../utils/constants';

class StorageService {
  async saveSearchHistory(searchItem) {
    try {
      const existingHistory = await this.getSearchHistory();
      const updatedHistory = [
        searchItem,
        ...existingHistory.filter(
          item => item.place_id !== searchItem.place_id,
        ),
      ].slice(0, 20); // Keep only latest 20 searches

      await AsyncStorage.setItem(
        STORAGE_KEYS.SEARCH_HISTORY,
        JSON.stringify(updatedHistory),
      );
      return updatedHistory;
    } catch (error) {
      console.error('Error saving search history:', error);
      return [];
    }
  }

  async getSearchHistory() {
    try {
      const history = await AsyncStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting search history:', error);
      return [];
    }
  }

  async clearSearchHistory() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  }

  async removeFromHistory(placeId) {
    try {
      const existingHistory = await this.getSearchHistory();
      const updatedHistory = existingHistory.filter(
        item => item.place_id !== placeId,
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.SEARCH_HISTORY,
        JSON.stringify(updatedHistory),
      );
      return updatedHistory;
    } catch (error) {
      console.error('Error removing from history:', error);
      return [];
    }
  }
}

export default new StorageService();
