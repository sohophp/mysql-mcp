/* eslint-env node */
import dotenv from 'dotenv';
import process from 'node:process';
import mysql from 'mysql2/promise';

// Usage: node scripts/list-tables.js .env.dev
dotenv.config({ path: process.argv[2] || '.env' });

async function main() {
  if (!process.env.MYSQL_HOST || !process.env.MYSQL_USER || !process.env.MYSQL_DATABASE) {
    console.error('Missing MYSQL_HOST / MYSQL_USER / MYSQL_DATABASE in environment.');
    process.exit(2);
  }

  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 2
  });

  try {
    const [rows] = await pool.query('SHOW TABLES');
    console.log('Tables:');
    for (const r of rows) {
      // Print the first column of each row which holds the table name
      const name = Object.values(r)[0];
      console.log('-', name);
    }
  } catch (err) {
    console.error('Failed to list tables:', err);
    process.exitCode = 1;
  } finally {
    try { await pool.end(); } catch (e) {}
  }
}

main();

