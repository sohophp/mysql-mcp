#!/usr/bin/env node
import { spawn } from 'node:child_process';

const env = {
  ...process.env,
  MYSQL_HOST: 'rocky.wsl',
  MYSQL_USER: 'readonly_user',
  MYSQL_PASSWORD: 'password',
  MYSQL_DATABASE: 'sable'
};

const child = spawn(process.execPath, ['wrap-stdio.js'], { cwd: process.cwd(), env });

let stdout = '';
let stderr = '';

child.stdout.setEncoding('utf8');
child.stderr.setEncoding('utf8');

child.stdout.on('data', (d) => { stdout += d; });
child.stderr.on('data', (d) => { stderr += d; });

child.on('error', (err) => {
  console.error('child error', err);
});

setTimeout(() => {
  child.kill('SIGTERM');
  console.log('--- CAPTURED STDOUT ---');
  console.log(stdout);
  console.log('--- CAPTURED STDERR ---');
  console.log(stderr);
  process.exit(0);
}, 2000);
