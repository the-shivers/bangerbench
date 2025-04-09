import Database from 'better-sqlite3';

export function initializeDatabase(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tweet_batches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider TEXT NOT NULL,
      model TEXT NOT NULL,
      prompt TEXT NOT NULL,
      tweet TEXT NOT NULL,
      created_at TEXT NOT NULL,
      metadata TEXT
    );
  `);
}
