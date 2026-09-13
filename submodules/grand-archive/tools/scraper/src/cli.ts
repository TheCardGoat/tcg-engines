import path from "node:path";
import { fileURLToPath } from "node:url";
import { scrapeGrandArchiveIndex, writeRawSnapshot } from "./index.ts";

const configuredOutput = process.argv.at(2) ?? "tools/catalog/snapshots";
const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
writeRawSnapshot(await scrapeGrandArchiveIndex(), path.resolve(workspaceRoot, configuredOutput))
  .then(console.log)
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
