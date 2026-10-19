import "../unpack-evaluation-data.ts";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";

// Keep the native diagnostic traces compressed in Git; scripts use local JSON.
const folder = new URL("investigation/", import.meta.url);
for (const name of readdirSync(folder).filter((name) => name.endsWith(".json.gz"))) {
  const target = new URL(name.slice(0, -3), folder);
  if (!existsSync(target)) writeFileSync(target, gunzipSync(readFileSync(new URL(name, folder))));
}
