/* eslint-env node */
import dns from 'node:dns';
import net from 'node:net';

// Improved arg handling: avoid treating a passed env-file path like ".env.dev" as the host.
// Usage:
//   node scripts/diagnose-host.js <host> [port]
// or (when using dotenv-cli):
//   dotenv -e .env.dev -- node scripts/diagnose-host.js

const rawArg = process.argv[2];
const rawPortArg = process.argv[3];
const timeoutMs = 5000;

// Detect if the first argument looks like an env filename (contains ".env")
const isEnvFileArg = typeof rawArg === 'string' && /(^\.|\.env)/i.test(rawArg);

let host;
let port = parseInt(process.env.MYSQL_PORT || '3306', 10);

if (isEnvFileArg) {
  // If user passed an env file path, don't treat it as host. Suggest proper usage.
  console.log(`Detected env-file argument: "${rawArg}".`);
  console.log('If you intended to run with that env file, run:');
  console.log(`  dotenv -e ${rawArg} -- node scripts/diagnose-host.js <host> [port]`);
  console.log('Falling back to environment variable MYSQL_HOST or default `rocky.wsl`.');
  host = process.env.MYSQL_HOST || 'rocky.wsl';
  if (rawPortArg && !isNaN(parseInt(rawPortArg, 10))) port = parseInt(rawPortArg, 10);
} else {
  host = rawArg || process.env.MYSQL_HOST || 'rocky.wsl';
  if (rawPortArg && !isNaN(parseInt(rawPortArg, 10))) port = parseInt(rawPortArg, 10);
}

console.log(`Diagnosing ${host}:${port} (timeout ${timeoutMs}ms)`);

function tryConnect(address, family) {
  return new Promise((resolve) => {
    const sock = new net.Socket();
    let done = false;
    sock.setTimeout(timeoutMs, () => {
      if (done) return;
      done = true;
      sock.destroy();
      resolve({ address, family, ok: false, reason: 'timeout' });
    });

    sock.on('error', (err) => {
      if (done) return;
      done = true;
      sock.destroy();
      resolve({ address, family, ok: false, reason: String(err) });
    });

    sock.connect(port, address, () => {
      if (done) return;
      done = true;
      sock.end();
      resolve({ address, family, ok: true });
    });
  });
}

(async () => {
  try {
    const results = [];
    // dns.lookup with all addresses
    const addrs = await new Promise((resolve, reject) => {
      dns.lookup(host, { all: true }, (err, addresses) => {
        if (err) return reject(err);
        resolve(addresses);
      });
    });

    if (!addrs || addrs.length === 0) {
      console.log('DNS lookup returned no addresses.');
    } else {
      console.log('DNS addresses:');
      for (const a of addrs) console.log(` - ${a.address} (family ${a.family})`);
    }

    // try connect each address
    for (const a of addrs) {
      process.stdout.write(`Trying ${a.address} (v${a.family})... `);
      const r = await tryConnect(a.address, a.family);
      if (r.ok) console.log('OK');
      else console.log(`FAIL (${r.reason})`);
      results.push(r);
    }

    // also try raw host name (if lookup returns IPs, this is redundant but helps)
    if (!addrs || addrs.length === 0) {
      process.stdout.write(`Trying raw host ${host}... `);
      const r = await tryConnect(host, 'unknown');
      if (r.ok) console.log('OK'); else console.log(`FAIL (${r.reason})`);
      results.push(r);
    }

    // Summary
    console.log('\nSummary:');
    for (const r of results) {
      console.log(`- ${r.address} (v${r.family}): ${r.ok ? 'reachable' : 'unreachable'}${r.ok ? '' : ' - ' + r.reason}`);
    }

    // exit with non-zero if none reachable
    if (!results.some(r => r.ok)) process.exit(2);
    process.exit(0);
  } catch (err) {
    console.error('Diagnosis failed:', err);
    process.exit(1);
  }
})();
