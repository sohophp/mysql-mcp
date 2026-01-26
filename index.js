import process from 'node:process';
import mysql from "mysql2/promise";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Note: do not create an McpServer at module scope; this file exports factory functions
 * that create servers/handlers when called. Creating a server at import time causes
 * side-effects and makes testing difficult.
 */

/**
 * Tools declaration (exported for testing)
 */
export function getTools() {
  return [
    {
      name: "list_tables",
      description: "List all tables in the current MySQL database"
    },
    {
      name: "describe_table",
      description: "Describe table structure",
      inputSchema: {
        type: "object",
        properties: {
          table: { type: "string" }
        },
        required: ["table"]
      }
    },
    {
      name: "show_indexes",
      description: "Show indexes of a table",
      inputSchema: {
        type: "object",
        properties: {
          table: { type: "string" }
        },
        required: ["table"]
      }
    }
  ];
}

/**
 * Create a CallTool request handler bound to the provided MySQL pool.
 * This is exported so tests can pass a fake pool.
 */
export function createCallToolHandler(pool) {
  return async (request) => {
    const { name, arguments: args } = request.params;

    // Log incoming tool calls for visibility when running in stdio mode
    try {
      console.error(`Received tools/call request: ${name}`);
    } catch (e) {
      // ignore logging errors
    }

    const anyPool = /** @type {any} */ (pool);
    const conn = await anyPool.getConnection();
    try {
      if (name === "list_tables") {
        const [rows] = await conn.query("SHOW TABLES");
        return { content: [{ type: "json", value: rows }] };
      }

      if (name === "describe_table") {
        const [rows] = await conn.query(
          `DESCRIBE \`${args.table}\``
        );
        return { content: [{ type: "json", value: rows }] };
      }

      if (name === "show_indexes") {
        const [rows] = await conn.query(
          `SHOW INDEX FROM \`${args.table}\``
        );
        return { content: [{ type: "json", value: rows }] };
      }

      throw new Error(`Unknown tool: ${name}`);
    } finally {
      try {
        conn.release();
      }
      catch (err) {
        // ignore release errors
      }
    }
  };
}

/**
 * Create and wire an McpServer using a provided pool.
 */
export function createMcpServer(pool) {
  // Build tools map expected by MCP host
  const toolsArray = getTools();
  const toolsMap = Object.fromEntries(toolsArray.map(t => [t.name, { description: t.description, inputSchema: t.inputSchema || {} }]));

  // Use the higher-level McpServer API (recommended over the deprecated Server class)
  const server = new McpServer({
    name: "mysql-mcp",
    version: "0.1.0"
  }, { capabilities: { tools: toolsMap } });

  // McpServer wraps a lower-level Server instance at `.server`.
  // Use the underlying server to install request handlers directly.
  server.server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: getTools() }));
  server.server.setRequestHandler(CallToolRequestSchema, createCallToolHandler(pool));

  return server;
}

// Helper to load the stdio transport from the SDK if available, otherwise use local fallback
async function loadStdioTransport() {
  try {
    // prefer SDK provided transport when available
    const mod = await import('@modelcontextprotocol/sdk/server/stdio.js');
    if (mod && mod.StdioServerTransport) return mod.StdioServerTransport;
  }
  catch (err) {
    // ignore and fallback
  }

  // fallback to local implementation
  const local = await import('./stdio-transport.js');
  return local.StdioServerTransport;
}

// CLI / runtime entrypoint
async function main() {
  if (!process.env.MYSQL_HOST || !process.env.MYSQL_USER || !process.env.MYSQL_DATABASE) {
    console.error(
      "Missing required environment variables. Please set MYSQL_HOST, MYSQL_USER and MYSQL_DATABASE."
    );
    process.exit(1);
  }

  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 3
  });

  const server = createMcpServer(pool);

  const StdioServerTransport = await loadStdioTransport();
  const transport = new StdioServerTransport();
  transport.onerror = (err) => {
    // Ignore known benign parse error that can occur during stream chunking
    try {
      if (err && err.message && typeof err.message === 'string' && err.message.includes('Unexpected end of JSON input')) {
        return;
      }
    } catch (e) {
      // fall through to logging
    }
    console.error("Transport error:", err);
  };

  transport.onclose = () => {
    console.error("Transport closed, shutting down.");
    process.exit(0);
  };

  console.error("Connecting MCP server to stdio transport...");

  // connect will call transport.start() internally
  await server.connect(transport);

  console.error("MCP server connected and listening (stdio transport). Waiting for messages on stdin...");

  // Graceful shutdown
  const shutdown = async () => {
    console.error("Shutting down...");
    try {
      await pool.end();
    }
    catch (err) {
      // ignore
    }
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// Only run main when executed directly
if (process.argv[1] && process.argv[1].endsWith('index.js')) {
  main().catch((err) => {
    console.error("Failed to start MCP server:", err);
    process.exit(1);
  });
}
