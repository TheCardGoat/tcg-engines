import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const packageRoot = process.cwd();
const srcRoot = join(packageRoot, "src");

const allowedRawFetchFiles = new Set([
  join(srcRoot, "lib/data/transport/http-client.ts"),
  join(srcRoot, "lib/server/fetch-with-cf.ts"),
]);

function walkFiles(dir: string, output: string[]): void {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walkFiles(fullPath, output);
      continue;
    }

    if (/\.(ts|svelte)$/.test(entry)) {
      output.push(fullPath);
    }
  }
}

const files: string[] = [];
walkFiles(srcRoot, files);

const offenders: string[] = [];

for (const file of files) {
  if (allowedRawFetchFiles.has(file)) {
    continue;
  }

  const contents = readFileSync(file, "utf8");
  if (/\bfetch\s*\(/.test(contents)) {
    offenders.push(relative(packageRoot, file));
  }
}

if (offenders.length > 0) {
  console.error("Raw fetch usage found outside allowed transport files:");
  for (const file of offenders) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log("No disallowed raw fetch usage found.");
