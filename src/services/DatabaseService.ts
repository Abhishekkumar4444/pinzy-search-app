import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

// Enable SQLite debugging
SQLite.DEBUG(true);
// Enable SQLite logging
SQLite.enablePromise(true);

interface SearchHistoryItem {
  id: number;
  query: string;
  timestamp: string;
}

class DatabaseService {
  private database: SQLiteDatabase | null = null;

  async initDB(): Promise<void> {
    try {
      const db = await SQLite.openDatabase({
        name: 'pinzy.db',
      });
      this.database = db;
      await this.createTables();
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.database) {
      throw new Error('Database not initialized');
    }

    // Create your tables here
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS search_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await this.database.executeSql(createTableQuery);
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  }

  // Add a search query to history
  async addSearchQuery(query: string): Promise<void> {
    if (!this.database) {
      throw new Error('Database not initialized');
    }

    try {
      await this.database.executeSql('INSERT INTO search_history (query) VALUES (?)', [query]);
    } catch (error) {
      console.error('Error adding search query:', error);
      throw error;
    }
  }

  // Get search history
  async getSearchHistory(): Promise<SearchHistoryItem[]> {
    if (!this.database) {
      throw new Error('Database not initialized');
    }

    try {
      const [results] = await this.database.executeSql(
        'SELECT * FROM search_history ORDER BY timestamp DESC',
      );
      const history: SearchHistoryItem[] = [];

      for (let i = 0; i < results.rows.length; i++) {
        history.push(results.rows.item(i));
      }

      return history;
    } catch (error) {
      console.error('Error getting search history:', error);
      throw error;
    }
  }

  // Clear search history
  async clearSearchHistory(): Promise<void> {
    if (!this.database) {
      throw new Error('Database not initialized');
    }

    try {
      await this.database.executeSql('DELETE FROM search_history');
    } catch (error) {
      console.error('Error clearing search history:', error);
      throw error;
    }
  }
}

export const databaseService = new DatabaseService();
