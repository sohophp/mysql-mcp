# Usage / Run Guide

This document explains how to run the `mysql-mcp` server and use the provided scripts.

## Running as MCP stdio server
The MCP host will typically start this process and communicate via stdin/stdout.

For local development you can start the server with environment variables loaded from `.env.dev`:

```bash
npm run dev
```

## Tools exposed
- `list_tables` — List all tables in the configured MySQL database
- `describe_table` — Describe columns and types of a table
- `show_indexes` — Show indexes for a table

## Integration script
To quickly call the tool handlers against a real MySQL instance, use:

```bash
npx dotenv -e .env.dev -- node scripts/integration-test.js
```

This script will call `list_tables` and then run `describe_table` and `show_indexes` against the first detected table.

## Logs
- The server writes errors to stderr and JSON responses to stdout (newline-delimited JSON). Use tooling that understands this format when integrating.

