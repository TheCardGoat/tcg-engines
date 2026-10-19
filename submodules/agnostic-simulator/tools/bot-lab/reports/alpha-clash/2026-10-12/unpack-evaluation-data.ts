import { existsSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";

// Generated evaluation records and native traces stay compressed in Git.
function unpack(folder: URL): void {
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const source = new URL(entry.name, folder);
    if (entry.isDirectory()) unpack(new URL(`${entry.name}/`, folder));
    else if (entry.name.endsWith(".json.gz") || entry.name.endsWith(".jsonl.gz")) {
      const target = new URL(entry.name.slice(0, -3), folder);
      if (existsSync(target)) continue;
      const temporary = new URL(`${entry.name}.tmp-${process.pid}`, folder);
      writeFileSync(temporary, gunzipSync(readFileSync(source)));
      renameSync(temporary, target);
    }
  }
}
unpack(new URL("./", import.meta.url));
