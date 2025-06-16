declare module 'react-native-sqlite-storage' {
  export interface SQLiteDatabase {
    executeSql(sqlStatement: string, params?: any[]): Promise<[SQLiteResultSet]>;
    transaction(
      txFunction: (tx: SQLiteTransaction) => void,
      errorCallback?: (error: Error) => void,
      successCallback?: () => void,
    ): void;
    close(): Promise<void>;
  }

  export interface SQLiteTransaction {
    executeSql(
      sqlStatement: string,
      params?: any[],
      callback?: (tx: SQLiteTransaction, resultSet: SQLiteResultSet) => void,
      errorCallback?: (tx: SQLiteTransaction, error: Error) => void,
    ): void;
  }

  export interface SQLiteResultSet {
    insertId: number;
    rowsAffected: number;
    rows: {
      length: number;
      item(index: number): any;
      _array: any[];
    };
  }

  export interface SQLiteDatabaseParams {
    name: string;
    location?: string;
    createFromLocation?: string;
  }

  export function openDatabase(params: SQLiteDatabaseParams): Promise<SQLiteDatabase>;

  export function DEBUG(debug: boolean): void;
  export function enablePromise(enablePromise: boolean): void;
}
