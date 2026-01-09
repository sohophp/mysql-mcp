# mysql-mcp

A small Model Context Protocol (MCP) server that exposes a few MySQL-specific tools over MCP (list tables, describe table, show indexes).

## Language / 文档语言
- English README: `README.md`
- 简体中文 README: `README.zh-CN.md`

## Docs
- English
  - Development guide: `docs/development.md`
  - Usage guide: `docs/usage.md`
- 简体中文
  - 开发指南: `docs/development.zh-CN.md`
  - 使用指南: `docs/usage.zh-CN.md`

(For convenience the README links the translated README and the language-specific docs above.)

## Features
- List tables in a MySQL database
- Describe table structure
- Show table indexes

## Requirements
- Node.js 18+ (ESM)
- A MySQL server accessible from the environment where the server runs

## Setup
1. Install dependencies

```bash
npm install
```

2. Create a development environment file from the example and fill real DB values:

```bash
cp .env.dev.example .env.dev
# edit .env.dev and fill MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
```

3. Run the server in dev mode (uses dotenv-cli to load `.env.dev`):

```bash
npm run dev
```

The server expects to be run as a stdio transport (the MCP host will start it and communicate via stdin/stdout). For local testing you can instead run the integration script or call the exported functions from a test harness.

## Integration / real MySQL testing
If you have filled `.env.dev` with your development MySQL connection you can run the integration helpers:

```bash
# List tables (reads .env.dev by default)
npm run list-tables

# Run the integration script that calls list_tables, then describe_table and show_indexes on the first table
npm run integration-test
```

You can also call the scripts directly and pass a different env file:

```bash
node scripts/integration-test.js .env.dev
node scripts/list-tables.js .env.dev
```

> Security: do not commit `.env.dev` with real credentials — `.env.dev.example` is provided as a template and `.gitignore` ignores `.env*` files.

## Tests
Unit tests use Vitest. Run:

```bash
npm test
```

## Files of interest
- `index.js` - main MCP server implementation
- `stdio-transport.js` - small fallback stdio transport (used if SDK does not provide one)
- `scripts/` - integration helpers (`integration-test.js`, `list-tables.js`)
- `test/` - unit tests

## Development notes
- The code attempts to import the SDK-provided `StdioServerTransport` and falls back to the local implementation if not present. This keeps the project resilient when the SDK changes exports.

## Documentation links
- English README: `README.md`
- 简体中文 README: `README.zh-CN.md`
- Docs folder: `docs/` (contains development and usage guides in both languages)

## License
MIT
