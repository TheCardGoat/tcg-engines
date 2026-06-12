import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateStructuredCardFiles } from "./generate.ts";

const currentDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(currentDir, "../../..");

const generatedFilePath = resolve(repoRoot, "packages/cards/src/generated.ts");
const outputDir = resolve(repoRoot, "packages/cards/src");

const { alphaCards, spoilerCards, promoCards } = await generateStructuredCardFiles({
  generatedFilePath,
  outputDir,
});

console.log(
  `Generated ${alphaCards.length} alpha, ${spoilerCards.length} spoiler, and ${promoCards.length} promo cards in ${outputDir}`,
);
