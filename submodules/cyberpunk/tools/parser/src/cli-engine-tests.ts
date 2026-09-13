import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateEngineTestFiles } from "./generate-engine-tests.ts";

const currentDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(currentDir, "../../..");

const generatedFilePath = resolve(repoRoot, "packages/cards/src/generated.ts");
const outputDir = resolve(repoRoot, "packages/engine/src");

const { promoCards } = await generateEngineTestFiles({
  generatedFilePath,
  outputDir,
});

console.log(`Generated engine tests for ${promoCards.length} promo cards in ${outputDir}`);
