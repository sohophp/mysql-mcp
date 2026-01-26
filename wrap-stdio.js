#!/usr/bin/env node
import { spawn } from 'node:child_process';
import readline from 'node:readline';
import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';

const indexPath = path.resolve(path.dirname(process.argv[1]), 'index.js');

// Add env validation before spawning child
const requiredEnv = ['MYSQL_HOST','MYSQL_USER','MYSQL_DATABASE'];
const missing = requiredEnv.filter(k => !process.env[k]);
if (missing.length) {
	console.error(`Missing required environment variables. Please set ${missing.join(', ')}.`);
	process.exit(1);
}

const child = spawn(process.execPath, [indexPath], {
  cwd: process.cwd(),
  env: process.env,
  stdio: ['pipe', 'pipe', 'pipe']
});

// Forward wrapper stdin to child stdin so child's stdio transport sees a live stdin
if (process.stdin && child.stdin) {
  process.stdin.setEncoding('utf8');
  process.stdin.pipe(child.stdin);
}

// Forward signals to child
['SIGINT', 'SIGTERM', 'SIGHUP'].forEach((sig) => {
  process.on(sig, () => {
    try { child.kill(sig); } catch (e) {}
  });
});

// Helper: route a line — if it's valid JSON, write to stdout, otherwise stderr
function routeLine(line) {
  if (!line) return;
  try {
    JSON.parse(line);
    process.stdout.write(line + '\n');
  } catch (e) {
    process.stderr.write(line + '\n');
  }
}

const logPath = path.resolve(process.cwd(), 'mcp-child.log');
function appendLog(channel, line) {
  const ts = new Date().toISOString();
  try { fs.appendFileSync(logPath, `${ts} [${channel}] ${line}\n`); } catch (e) { /* ignore log failures */ }
}

const rlOut = readline.createInterface({ input: child.stdout, terminal: false });
rlOut.on('line', (line) => { appendLog('child.stdout', line); routeLine(line); });

const rlErr = readline.createInterface({ input: child.stderr, terminal: false });
rlErr.on('line', (line) => { appendLog('child.stderr', line); process.stderr.write(line + '\n'); });

child.on('exit', (code, signal) => {
  appendLog('child.exit', `code=${code} signal=${signal}`);
  process.stderr.write(`Child exited with code=${code} signal=${signal}\n`);
  // propagate exit
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});

child.on('error', (err) => {
  process.stderr.write(`Wrapper failed to spawn child: ${err}\n`);
  process.exit(1);
});
