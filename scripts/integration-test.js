/* eslint-env node */
import dotenv from 'dotenv';
import process from 'node:process';
import mysql from 'mysql2/promise';
import { createCallToolHandler } from '../index.js';

// Load env from optional first arg or default to .env
dotenv.config({ path: process.argv[2] || '.env' });

async function run() {
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

  const handler = createCallToolHandler(pool);

  try {
    console.log('Running list_tables...');
    const resList = await handler({ params: { name: 'list_tables', arguments: {} } });
    console.log('list_tables result:');
    console.log(JSON.stringify(resList, null, 2));

    const rows = resList?.content?.[0]?.value;
    if (!Array.isArray(rows) || rows.length === 0) {
      console.log('No tables found.');
      return;
    }

    // Attempt to detect table name column (e.g. `Tables_in_<db>`)
    const firstRow = rows[0];
    const tableName = firstRow && Object.values(firstRow)[0];
    console.log('Detected first table:', tableName);

    if (tableName) {
      console.log(`Running describe_table for: ${tableName}`);
      const resDesc = await handler({ params: { name: 'describe_table', arguments: { table: String(tableName) } } });
      console.log('describe_table result:');
      console.log(JSON.stringify(resDesc, null, 2));

      console.log(`Running show_indexes for: ${tableName}`);
      const resIdx = await handler({ params: { name: 'show_indexes', arguments: { table: String(tableName) } } });
      console.log('show_indexes result:');
      console.log(JSON.stringify(resIdx, null, 2));
    }
  }
  catch (err) {
    console.error('Integration test failed:', err);
    process.exitCode = 1;
  }
  finally {
    try {
      await pool.end();
    }
    catch (e) {
      // ignore
    }
  }
}

run();
