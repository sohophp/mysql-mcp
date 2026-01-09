# Development Guide

This document explains how to develop and test the mysql-mcp project.

## Prerequisites
- Node.js 18+ (recommended)
- A MySQL database for integration testing (optional, but recommended)

## Setup
1. Install dependencies:

```powershell
npm install
```

2. Create a development environment file from the example and fill real DB values if you plan to run integration tests:

```powershell
copy .env.dev.example .env.dev
# edit .env.dev and fill MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
```

## Running unit tests

```powershell
npm test
```

## Running integration test against a real MySQL database

```powershell
npx dotenv -e .env.dev -- node scripts/integration-test.js
```

## Diagnostic helper (DNS & TCP checks)

If you experience intermittent `ETIMEDOUT` or host-resolution problems when running scripts from different environments (PowerShell, IDE, WSL), use the diagnoser to run DNS and TCP checks from the Node runtime:

```powershell
# Run diagnoser directly against a hostname and port
node scripts/diagnose-host.js rocky.wsl 3306

# If you want the diagnoser to load env vars from .env.dev first, use dotenv-cli
npx dotenv -e .env.dev -- node scripts/diagnose-host.js rocky.wsl 3306
```

Notes on PowerShell and command chaining:
- PowerShell does not support `||` like POSIX shells. Use `;` to run multiple commands or separate them on multiple lines.

## Code structure
- `index.js` - main MCP server factory & CLI entrypoint
- `stdio-transport.js` - local fallback stdio transport used when SDK export is unavailable
- `scripts/integration-test.js` - script to test handlers against a real MySQL DB
- `scripts/diagnose-host.js` - helper to check DNS resolution and TCP connectivity from Node
- `test/` - unit tests (Vitest)

## Contributing
- Keep changes small and focused; include tests for behavior changes.
- If changing public behavior, add CHANGELOG entry.
