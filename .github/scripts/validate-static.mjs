// Dependency-free static validation for CI.
// - Every JSON file under "ensa-android (1)" must parse.
// - Every inline <script> block (without src) in www/*.html must compile.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import vm from 'node:vm';

const ROOT = 'ensa-android (1)';
let failures = 0;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    if (name === 'node_modules') return [];
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk(ROOT);

for (const file of files.filter((f) => extname(f) === '.json')) {
  try {
    JSON.parse(readFileSync(file, 'utf8'));
    console.log(`OK   json   ${file}`);
  } catch (e) {
    failures++;
    console.error(`FAIL json   ${file}: ${e.message}`);
  }
}

const scriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
for (const file of files.filter((f) => extname(f) === '.html')) {
  const html = readFileSync(file, 'utf8');
  let m;
  let i = 0;
  while ((m = scriptRe.exec(html))) {
    const [, attrs, code] = m;
    if (/\bsrc\s*=/.test(attrs) || !code.trim()) continue;
    if (/type\s*=\s*["']?module/i.test(attrs)) {
      console.log(`SKIP module script #${i} in ${file}`);
      continue;
    }
    i++;
    try {
      new vm.Script(code, { filename: `${file}#script${i}` });
      console.log(`OK   script ${file} #${i}`);
    } catch (e) {
      failures++;
      console.error(`FAIL script ${file} #${i}: ${e.message}`);
    }
  }
}

if (failures) {
  console.error(`\n${failures} validation error(s).`);
  process.exit(1);
}
console.log('\nAll static checks passed.');
