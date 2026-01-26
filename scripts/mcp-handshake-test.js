#!/usr/bin/env node
import { spawn } from 'node:child_process';

const env = { ...process.env, MYSQL_HOST: 'rocky.wsl', MYSQL_USER: 'readonly_user', MYSQL_PASSWORD: 'password', MYSQL_DATABASE: 'sable' };
const child = spawn(process.execPath, ['wrap-stdio.js'], { cwd: process.cwd(), env, stdio: ['pipe','pipe','pipe'] });

child.stdout.setEncoding('utf8');
child.stderr.setEncoding('utf8');

let stdoutBuf = '';
child.stdout.on('data', (d) => {
  stdoutBuf += d;
  // try to parse lines
  const lines = stdoutBuf.split('\n');
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    try {
      const msg = JSON.parse(line);
      console.error('RECEIVED JSON FROM STDOUT:', JSON.stringify(msg));
      child.kill('SIGTERM');
      process.exit(0);
    } catch (e) {
      console.error('STDOUT non-json line:', line);
    }
  }
  stdoutBuf = lines[lines.length - 1];
});

child.stderr.on('data', (d) => {
  console.error('CHILD STDERR:', d.toString());
});

child.on('error', (err) => { console.error('child error', err); process.exit(1); });

// Send a minimal MCP 'connect' request if the protocol expects it; otherwise send ListTools request
const listToolsRequest = {
  jsonrpc: '2.0',
  id: 'test-1',
  method: 'request',
  params: {
    type: 'list_tools'
  }
};

// Wait 200ms then write the request
setTimeout(() => {
  child.stdin.write(JSON.stringify(listToolsRequest) + '\n');
}, 200);

// Timeout
setTimeout(() => { console.error('timeout'); child.kill('SIGTERM'); process.exit(1); }, 3000);
