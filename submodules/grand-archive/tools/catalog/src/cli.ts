import path from "node:path";
import { fileURLToPath } from "node:url";
import { readdir } from "node:fs/promises";
import { readAndNormalizeGrandArchiveSnapshot, writeGrandArchiveCatalog } from "./index.ts";

const SNAPSHOT_DIRECTORY = "tools/catalog/snapshots";

async function latestSnapshot(root: string): Promise<string> {
  const snapshots = (await readdir(path.resolve(root, SNAPSHOT_DIRECTORY)))
    .filter((name) => /^gatcg-index-.+\.json\.gz$/u.test(name))
    .sort();
  const latest = snapshots.at(-1);
  if (!latest) throw new Error(`No Grand Archive snapshot found in ${SNAPSHOT_DIRECTORY}.`);
  return path.join(SNAPSHOT_DIRECTORY, latest);
}

function option(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}
const command = process.argv[2];
if (command !== "generate" && command !== "verify")
  throw new Error("Usage: generate|verify [--input <raw-snapshot>] [--out <directory>]");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const input = option("input") ?? (await latestSnapshot(root));
const catalog = await readAndNormalizeGrandArchiveSnapshot(path.resolve(root, input));
if (command === "generate") {
  await writeGrandArchiveCatalog(
    catalog,
    path.resolve(root, option("out") ?? "packages/cards/src/generated"),
  );
}
console.log(`Verified ${catalog.cards.length} Grand Archive cards.`);
