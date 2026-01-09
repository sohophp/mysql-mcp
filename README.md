mysql-mcp
=========

A small MCP (Model Context Protocol) server that exposes read-only MySQL tools over stdio.

Overview
--------
This project implements a lightweight MCP server (entry point: `index.js`) that provides read-only inspection tools for a MySQL database via stdio. It is intended for development, testing, and small integrations where a simple, local-to-process protocol is useful.

Highlights
- Exposes handlers such as `list_tables`, `describe_table`, and `show_indexes` (see `index.js`).
- Designed so handlers can be required and unit tested without starting the stdio server.

Quick start
-----------
1. Install dependencies:

```bash
npm install
```

2. For local development against a real MySQL database, create a temporary development env file and run the server with it (see next section).

Development environment configuration
-------------------------------------
To make it convenient to run the server against a real MySQL instance in development, create a `.env.dev` file with your database credentials. An example file is provided as `.env.dev.example`.

Copy and edit the example:

```bash
cp .env.dev.example .env.dev
# edit .env.dev and set values for MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
```

Then run the server with the development env loaded. The project uses `dotenv-cli` in the `dev` npm script to load `.env.dev` into `process.env` before starting `node index.js`.

Start the server in development mode:

```bash
npm run dev
```

What `npm run dev` does
-----------------------
- Loads `.env.dev` into `process.env` using `dotenv-cli` (so you can keep credentials out of your shell/CI). 
- Runs `node index.js` to start the MCP server.

Example `.env.dev` contents
--------------------------
```
MYSQL_HOST=127.0.0.1
MYSQL_USER=readonly_user
MYSQL_PASSWORD=yourpassword
MYSQL_DATABASE=your_database
```

Running tests
-------------
The project includes unit tests (Vitest). Run them with:

```bash
npm test
```

Integration testing with a real DB
----------------------------------
If you want to run integration tests or exercise the server against a real MySQL instance, use `.env.dev` with real credentials and then run the integration script (if provided) or start the server with `npm run dev` and run the client that talks MCP over stdio.

Security notes
--------------
- Do NOT commit `.env.dev` or files containing secrets to version control. Use `.env.dev.example` to share the shape of the config without secrets.
- For CI or shared environments, prefer the platform's secret storage rather than checked-in files.

Repository layout
-----------------
- `index.js` — main server code and exported factory functions for tests
- `test/` — unit tests (e.g., `test/index.test.js`)
- `scripts/` — helper scripts (integration test runner, etc.)
- `package.json` — scripts and dependencies

Recommended `.gitignore`
------------------------
Don't commit local environment files and node modules. A minimal `.gitignore` should include:

```
node_modules/
.env
.env.*
.DS_Store
```

If you prefer, add `.env.dev` explicitly to your personal/global gitignore so it is never accidentally committed.

Troubleshooting
---------------
- If the server won't start, ensure Node.js (v16+) is installed and dependencies are present (`npm install`).
- If database connections fail, verify the `.env.dev` credentials and that the MySQL server allows connections from your host.
- For test failures, run `npm test -- -t <name>` to run a specific test in Vitest.

Contributing
------------
Contributions are welcome. Open an issue with a reproducible problem or a short PR with tests. Keep changes small and add tests for new behavior.

License
-------
MIT
