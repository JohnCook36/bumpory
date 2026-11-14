import * as SQLite from 'expo-sqlite';

export type JournalEntry = {
  id: string; week: number; note: string; photo_uri: string | null; created_at: string;
};

let databasePromise: Promise<SQLite.SQLiteDatabase> | undefined;
async function connection(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = (async () => {
      const db = await SQLite.openDatabaseAsync('bumpory.db');
      await db.execAsync(`
        PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS preferences (
          key TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS journal_entries (
          id TEXT PRIMARY KEY NOT NULL,
          week INTEGER NOT NULL CHECK (week BETWEEN 1 AND 42),
          note TEXT NOT NULL,
          photo_uri TEXT,
          created_at TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS journal_week_idx ON journal_entries(week, created_at);
        CREATE TABLE IF NOT EXISTS task_progress (
          task_key TEXT PRIMARY KEY NOT NULL,
          is_complete INTEGER NOT NULL DEFAULT 0
        );
      `);
      return db;
    })().catch(error => {
      databasePromise = undefined;
      throw error;
    });
  }
  return databasePromise;
}

export async function getLmp(): Promise<string | null> {
  const db = await connection();
  const row = await db.getFirstAsync<{value: string}>('SELECT value FROM preferences WHERE key = ?', 'lmp');
  return row?.value ?? null;
}

export async function saveLmp(date: string): Promise<void> {
  const db = await connection();
  await db.runAsync('INSERT INTO preferences(key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value', 'lmp', date);
}

export async function getEntries(): Promise<JournalEntry[]> {
  const db = await connection();
  return db.getAllAsync<JournalEntry>('SELECT id,week,note,photo_uri,created_at FROM journal_entries ORDER BY week DESC, created_at DESC');
}

export async function getEntry(id: string): Promise<JournalEntry | null> {
  const db = await connection();
  return (await db.getFirstAsync<JournalEntry>('SELECT * FROM journal_entries WHERE id = ?', id)) ?? null;
}

export async function saveEntry(entry: JournalEntry): Promise<void> {
  const db = await connection();
  await db.runAsync(`INSERT INTO journal_entries(id,week,note,photo_uri,created_at)
    VALUES ($id,$week,$note,$photo,$created)
    ON CONFLICT(id) DO UPDATE SET week=excluded.week,note=excluded.note,photo_uri=excluded.photo_uri`, {
    $id: entry.id, $week: entry.week, $note: entry.note,
    $photo: entry.photo_uri, $created: entry.created_at
  });
}

export async function deleteEntry(id: string): Promise<void> {
  const db = await connection();
  await db.runAsync('DELETE FROM journal_entries WHERE id = ?', id);
}

export async function getTaskDone(key: string): Promise<boolean> {
  const db = await connection();
  const row = await db.getFirstAsync<{is_complete: number}>('SELECT is_complete FROM task_progress WHERE task_key = ?', key);
  return row?.is_complete === 1;
}

export async function setTaskDone(key: string, done: boolean): Promise<void> {
  const db = await connection();
  await db.runAsync('INSERT INTO task_progress(task_key,is_complete) VALUES (?,?) ON CONFLICT(task_key) DO UPDATE SET is_complete=excluded.is_complete', key, done ? 1 : 0);
}
