// Minimal stdio transport fallback for environments where the SDK doesn't export
// StdioServerTransport. The real SDK may provide a richer implementation; this
// fallback implements the minimal surface used by createMcpServer + Server.connect.

export class StdioServerTransport {
  constructor() {
    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
    this._listening = false;
    this._init();
  }

  _init() {
    // prepare stdin as text stream
    if (process.stdin.setEncoding) process.stdin.setEncoding('utf8');

    // accumulate and parse lines as JSON-RPC-like messages (MCP uses JSON transport)
    let buf = '';
    const onData = (chunk) => {
      buf += chunk;
      // Messages are newline-delimited
      let idx;
      while ((idx = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, idx).trim();
        buf = buf.slice(idx + 1);
        if (!line) continue;
        try {
          const msg = JSON.parse(line);
          if (this.onmessage) this.onmessage(msg);
        } catch (err) {
          if (this.onerror) this.onerror(err);
        }
      }
    };

    this._onData = onData;
  }

  // start listening to stdin
  start() {
    if (this._listening) return;
    process.stdin.on('data', this._onData);
    process.stdin.on('end', () => {
      if (this.onclose) this.onclose();
    });
    this._listening = true;
  }

  // send a message to stdout as JSON newline-delimited
  send(message) {
    try {
      const line = JSON.stringify(message);
      process.stdout.write(line + '\n');
    } catch (err) {
      if (this.onerror) this.onerror(err);
    }
  }

  // allow Server.connect to call close/stop
  close() {
    try {
      if (this._listening) {
        process.stdin.off('data', this._onData);
        this._listening = false;
      }
      if (this.onclose) this.onclose();
    } catch (err) {
      if (this.onerror) this.onerror(err);
    }
  }
}
