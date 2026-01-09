# Development Guide

This document explains how to develop and test the mysql-mcp project.

## Prerequisites
- Node.js 18+ (recommended)
- A MySQL database for integration testing (optional, but recommended)

## Setup
1. Install dependencies:

```bash
npm install
```

2. Create a development environment file from the example and fill real DB values if you plan to run integration tests:

```bash
cp .env.dev.example .env.dev
# edit .env.dev and fill MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
```

## Running unit tests

```bash
npm test
```

## Running integration test against a real MySQL database

```bash
npx dotenv -e .env.dev -- node scripts/integration-test.js
```

## Code structure
- `index.js` - main MCP server factory & CLI entrypoint
- `stdio-transport.js` - local fallback stdio transport used when SDK export is unavailable
- `scripts/integration-test.js` - script to test handlers against a real MySQL DB
- `test/` - unit tests (Vitest)

## Contributing
- Keep changes small and focused; include tests for behavior changes.
- If changing public behavior, add CHANGELOG entry.

