import path from "node:path";
import { fileURLToPath } from "node:url";

import { generateRiftboundCatalogFiles } from "../tools/parser/src/index.ts";
import { scrapeRiotCardGallery, writeRawSnapshot } from "../tools/scraper/src/index.ts";

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cacheRoot = path.join(workspaceRoot, ".cache");
const outputDirectory = path.join(cacheRoot, "card-database");

const snapshot = await scrapeRiotCardGallery("en-US", { allowIncompleteGallery: true });
const snapshotPath = await writeRawSnapshot(snapshot, path.join(cacheRoot, "raw"));
const catalog = await generateRiftboundCatalogFiles({
  snapshotPath,
  outputDirectory,
  production: false,
});
const completeness = catalog.provenance.sourceCompleteness;

console.log(`Built the local Riftbound database with ${catalog.cards.length} cards.`);
if (completeness && !completeness.complete) {
  console.warn(
    `The official gallery embedded ${completeness.importedCards} of ${completeness.reportedCards} reported cards; the local UI will display this limitation.`,
  );
}
console.log(`Catalog directory: ${outputDirectory}`);
console.log("Development API settings:");
console.log("  NODE_ENV=development");
console.log("  RIFTBOUND_LOCAL_CARD_DATABASE=true");
console.log(`  RIFTBOUND_LOCAL_CATALOG_DIR=${outputDirectory}`);
