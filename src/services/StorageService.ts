// services/StorageService.ts
import SQLite from 'react-native-sqlite-storage';

// types/SearchLocation.ts
export type SearchLocation = {
  place_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  timestamp?: number;
};

SQLite.enablePromise(true);

// Module-scoped db instance
let db: SQLite.SQLiteDatabase | null = null;

const getDB = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;

  db = await SQLite.openDatabase({ name: 'AppSearch.db', location: 'default' });
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS search_history (
      place_id TEXT PRIMARY KEY,
      json TEXT,
      timestamp INTEGER
    )
  `);

  return db;
};

// Save a search item (upsert)
export const saveSearchHistory = async (searchItem: SearchLocation): Promise<SearchLocation[]> => {
  try {
    const database = await getDB();
    const timestamp = Date.now();
    const json = JSON.stringify({ ...searchItem, timestamp });

    await database.executeSql(
      `INSERT OR REPLACE INTO search_history (place_id, json, timestamp) VALUES (?, ?, ?)`,
      [searchItem.place_id, json, timestamp],
    );

    // Keep only latest 20
    await database.executeSql(`
      DELETE FROM search_history WHERE place_id NOT IN (
        SELECT place_id FROM search_history ORDER BY timestamp DESC LIMIT 20
      )
    `);

    return getSearchHistory();
  } catch (error) {
    console.error('Error saving search history (SQLite):', error);
    return [];
  }
};

// Get all saved items
export const getSearchHistory = async (): Promise<SearchLocation[]> => {
  try {
    const database = await getDB();
    const [results] = await database.executeSql(
      `SELECT json FROM search_history ORDER BY timestamp DESC`,
    );

    const locations: SearchLocation[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      locations.push(JSON.parse(row.json));
    }

    return locations;
  } catch (error) {
    console.error('Error getting search history (SQLite):', error);
    return [];
  }
};

// Clear entire history
export const clearSearchHistory = async (): Promise<void> => {
  try {
    const database = await getDB();
    await database.executeSql(`DELETE FROM search_history`);
  } catch (error) {
    console.error('Error clearing search history (SQLite):', error);
  }
};

// Remove by place_id
export const removeFromHistory = async (placeId: string): Promise<SearchLocation[]> => {
  try {
    const database = await getDB();
    await database.executeSql(`DELETE FROM search_history WHERE place_id = ?`, [placeId]);
    return getSearchHistory();
  } catch (error) {
    console.error('Error removing from history (SQLite):', error);
    return [];
  }
};
