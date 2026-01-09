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

## Tests
Unit tests use Vitest. Run:

```bash
npm test
```

## Files of interest
- `index.js` - main MCP server implementation
- `stdio-transport.js` - small fallback stdio transport (used if SDK does not provide one)
- `test/` - unit tests

## Development notes
- The code attempts to import the SDK-provided `StdioServerTransport` and falls back to the local implementation if not present. This keeps the project resilient when the SDK changes exports.

## License
MIT
