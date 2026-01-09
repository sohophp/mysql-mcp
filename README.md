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

```powershell
npm install
```

2. Create a development environment file from the example and fill real DB values:

```powershell
copy .env.dev.example .env.dev
# edit .env.dev and fill MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
```

3. Run the server in dev mode (uses dotenv-cli to load `.env.dev`):

```powershell
npm run dev
```

The server expects to be run as a stdio transport (the MCP host will start it and communicate via stdin/stdout). For local testing you can instead run the integration script or call the exported functions from a test harness.

## Local testing & diagnostics
- List tables using the project helper (reads `.env.dev` by default):

```powershell
npm run list-tables
```

- If a script times out when using a hostname, you can temporarily override `MYSQL_HOST` to the resolved IP (helps rule out name resolution vs network reachability issues):

```powershell
# set env for the session then run the script
$env:MYSQL_HOST='172.30.178.29'; npm run list-tables
```

- There's a small diagnostic helper to test name resolution and TCP connectability from the Node process:

```powershell
# Example: run the diagnoser pointing at a hostname
node scripts/diagnose-host.js rocky.wsl 3306

# If you want to use a specific .env file to provide environment variables, use dotenv-cli:
# (PowerShell: avoid using `||` in chained commands; use `;` or run commands on separate lines)
npx dotenv -e .env.dev -- node scripts/diagnose-host.js rocky.wsl 3306
```

Notes on PowerShell compatibility:
- Many README examples use bash-style `cp`/`||` etc. In PowerShell use `copy` instead of `cp` and use `;` to separate commands rather than `||`.

## Integration / real MySQL testing
If you have filled `.env.dev` with your development MySQL connection you can run the integration helpers:

```powershell
npm run list-tables
npm run integration-test
```

You can also call the scripts directly and pass a different env file (use `npx dotenv` or `dotenv-cli`):

```powershell
npx dotenv -e .env.dev -- node scripts/integration-test.js
npx dotenv -e .env.dev -- node scripts/list-tables.js
```

> Security: do not commit `.env.dev` with real credentials — `.env.dev.example` is provided as a template and `.gitignore` ignores `.env*` files.

## Tests
Unit tests use Vitest. Run:

```powershell
npm test
```

## Files of interest
- `index.js` - main MCP server implementation
- `stdio-transport.js` - small fallback stdio transport (used if SDK does not provide one)
- `scripts/` - integration helpers (`integration-test.js`, `list-tables.js`, `diagnose-host.js`)
- `test/` - unit tests

## Development notes
- The code attempts to import the SDK-provided `StdioServerTransport` and falls back to the local implementation if not present. This keeps the project resilient when the SDK changes exports.
- Use `scripts/diagnose-host.js` to quickly check DNS resolution and TCP connectivity from the Node environment.

## Documentation links
- English README: `README.md`
- 简体中文 README: `README.zh-CN.md`
- Docs folder: `docs/` (contains development and usage guides in both languages)

## License
MIT
