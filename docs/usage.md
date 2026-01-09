# Usage / Run Guide

This document explains how to run the `mysql-mcp` server and use the provided scripts.

## Running as MCP stdio server
The MCP host will typically start this process and communicate via stdin/stdout.

For local development you can start the server with environment variables loaded from `.env.dev`:

```powershell
npm run dev
```

## Tools exposed
- `list_tables` — List all tables in the configured MySQL database
- `describe_table` — Describe columns and types of a table
- `show_indexes` — Show indexes for a table

## Integration script
To quickly call the tool handlers against a real MySQL instance, use:

```powershell
npx dotenv -e .env.dev -- node scripts/integration-test.js
```

This script will call `list_tables` and then run `describe_table` and `show_indexes` against the first detected table.

## Diagnostic helper
If you have intermittent hostname / connectivity issues, `scripts/diagnose-host.js` helps debug from within the Node runtime. It will resolve the hostname and attempt a TCP connection to the provided port.

```powershell
# Run diagnoser against a host and port
node scripts/diagnose-host.js rocky.wsl 3306

# If your env vars are in .env.dev, load them with dotenv-cli and then run diagnoser
npx dotenv -e .env.dev -- node scripts/diagnose-host.js rocky.wsl 3306
```

Notes about PowerShell compatibility:
- Use `copy` instead of `cp`.
- Use `;` to separate commands rather than `||`.

## Logs
- The server writes errors to stderr and JSON responses to stdout (newline-delimited JSON). Use tooling that understands this format when integrating.
