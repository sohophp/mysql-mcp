mysql-mcp
=========

A small MCP (Model Context Protocol) server that exposes read-only MySQL tools over stdio.

Quick overview
--------------
- The MCP server is implemented in `index.js` and exposes three tools: `list_tables`, `describe_table`, and `show_indexes`.
- For development and testing the code exports factory functions so you can run unit tests without starting the server.

Development environment configuration
-------------------------------------
To make it convenient to run the server against a real MySQL instance in development, you can create a temporary environment file and run the process with it.

1. Copy the example development env file and fill in your database credentials:

```bash
cp .env.dev.example .env.dev
# edit .env.dev and set values for MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
```

2. Start the MCP server in development mode (uses dotenv-cli to load `.env.dev` into process.env):

```bash
# install dependencies if you haven't already
npm install

# start with the .env.dev values loaded
npm run dev
```

What `npm run dev` does
------------------------
- It uses `dotenv-cli` to load environment variables from `.env.dev` and then runs `node index.js`.
- This avoids committing secrets to the repo and keeps configuration local to your dev machine.

Example `.env.dev` contents
--------------------------
The repository contains `.env.dev.example`. It looks like:

```text
MYSQL_HOST=127.0.0.1
MYSQL_USER=readonly_user
MYSQL_PASSWORD=yourpassword
MYSQL_DATABASE=your_database
```

Security notes
--------------
- Do NOT commit `.env.dev` to version control. Keep secrets out of the repository.
- If you need to share credentials for CI or temporary testing, use secure secret managers or CI-provided secrets features.

Running tests
-------------
Unit tests are written with Vitest. Run them with:

```bash
npm test
```

Files of interest
-----------------
- `index.js` — main server code and exported factory functions for tests
- `test/index.test.js` — unit tests for handlers
- `package.json` — contains scripts; `dev` script loads `.env.dev` and runs the server

If you want more helper scripts (e.g. run integration tests with a test DB), tell me and I can add them.

