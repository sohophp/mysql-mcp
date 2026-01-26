# StdIO wrapper and filtering non-JSON logs

When an MCP host runs this server it expects a pure JSON-RPC stream on stdout/stdin. Any human-readable log lines emitted to stdout will break the host's JSON parsing and result in errors such as:

```
Error: Unexpected token 'C', "Connecting"... is not valid JSON
```

This repository includes `wrap-stdio.js`, a small wrapper that launches `index.js` as a child process and performs two helpful behaviors:

- Routes lines that parse as valid JSON to the wrapper's stdout (so the MCP host receives only JSON messages).
- Routes non-JSON lines to stderr and also appends them to `mcp-child.log` for later troubleshooting.

Why use the wrapper

- Many logging frameworks or accidental console.log calls may write human-readable text to stdout. The wrapper protects the host from those lines by ensuring only JSON lines are sent on stdout.
- The wrapper is a low-risk shim and requires no changes to the server code.

How it works

- The wrapper spawns `node index.js` as a child process.
- It reads the child's stdout and stderr line-by-line.
- If a line is valid JSON (JSON.parse succeeds), the wrapper writes the line to its stdout.
- If the line is not valid JSON, the wrapper writes it to its stderr and saves it to `mcp-child.log`.

Running the wrapper

PowerShell (Windows):

```powershell
# run the wrapper which starts the MCP server and filters stdout
node wrap-stdio.js
```

Bash (Linux / WSL / macOS):

```bash
node wrap-stdio.js
```

Using the wrapper with an external host

If an external MCP host launches the server, point the host's command to the wrapper so the host gets a clean JSON stream. Example host process configuration (JSON):

```json
{
  "command": "C:\\nvm4w2\\nodejs\\node.exe",
  "args": ["C:\\mcp\\mysql-mcp\\wrap-stdio.js"],
  "transport": "stdio"
}
```

Alternative: logging to stderr

If you control the server implementation and prefer not to use the wrapper, ensure all human-readable logs are written to stderr. For example, use console.error or a logger configured to write to stderr. The MCP host will then only see JSON on stdout.

Troubleshooting

- "Unexpected token" JSON errors: Likely cause is non-JSON text on stdout. Use the wrapper or move logs to stderr.
- Wrapper not starting: ensure Node.js is available and that the wrapper file is executable or explicitly run with `node wrap-stdio.js`.
- Check `mcp-child.log` for child stdout/stderr history when diagnosing issues.

Implementation notes

- The wrapper is intentionally small and uses synchronous appendFile calls to avoid losing log entries during process shutdown.
- It forwards signals (SIGINT, SIGTERM, SIGHUP) to the child process so the child can exit cleanly.

