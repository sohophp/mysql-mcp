const fs = require('fs');
const path = require('path');

const patterns = [/copilot/i, /chat-sessions/i, /nitrite/i, /chat/i, /\.db$/i];
const maxResults = 500;
const results = [];

function matches(name) {
  return patterns.some(p => p.test(name));
}

function walk(start) {
  const stack = [start];
  while (stack.length && results.length < maxResults) {
    const cur = stack.pop();
    try {
      const stat = fs.statSync(cur);
      if (stat.isDirectory()) {
        let entries;
        try {
          entries = fs.readdirSync(cur);
        } catch (e) {
          continue; // permission or other error
        }
        for (const e of entries) {
          const full = path.join(cur, e);
          // skip node_modules and large hidden dirs
          if (e === 'node_modules' || e === '.git') continue;
          stack.push(full);
        }
      } else if (stat.isFile()) {
        const name = path.basename(cur);
        if (matches(name) || matches(cur)) {
          results.push(cur);
        }
      }
    } catch (e) {
      // ignore
    }
  }
}

const starts = [];
if (process.env.USERPROFILE) starts.push(process.env.USERPROFILE);
if (process.env.LOCALAPPDATA) starts.push(process.env.LOCALAPPDATA);
starts.push(path.join(process.env.USERPROFILE || 'C:\Users\Public', 'AppData', 'Roaming', 'JetBrains'));
starts.push(path.join(process.env.USERPROFILE || 'C:\Users\Public', 'AppData', 'Local', 'JetBrains'));
starts.push('C:\ProgramData');
starts.push('C:\Program Files');

for (const s of starts) {
  try {
    if (fs.existsSync(s)) {
      console.error(`Searching: ${s}`);
      walk(s);
      if (results.length >= maxResults) break;
    } else {
      // console.error(`Not found: ${s}`);
    }
  } catch (e) {
    // ignore
  }
}

// Print results
if (results.length === 0) {
  console.log('No candidates found.');
} else {
  for (const r of results) console.log(r);
}

// summary
console.error(`Found ${results.length} candidate(s).`);
