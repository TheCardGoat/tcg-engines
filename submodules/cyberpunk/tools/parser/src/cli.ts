import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateStructuredCardFiles } from "./generate.ts";

const currentDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(currentDir, "../../..");

const generatedFilePath = resolve(repoRoot, "packages/cards/src/generated.ts");
const outputDir = resolve(repoRoot, "packages/cards/src");

const {
  alphaCards,
  spoilerCards,
  promoCards,
  prm01Cards,
  boxToppersRetailCards,
  theHeistRetailStarterDeckCards,
  embracingPowerRetailStarterDeckCards,
  welcomeToNightCityRetailCards,
} = await generateStructuredCardFiles({
  generatedFilePath,
  outputDir,
});

const generatedCounts = [
  `${alphaCards.length} alpha`,
  `${spoilerCards.length} spoiler`,
  `${promoCards.length} promo`,
  `${prm01Cards.length} PRM01`,
  `${boxToppersRetailCards.length} box toppers retail`,
  `${theHeistRetailStarterDeckCards.length} The Heist retail starter deck`,
  `${embracingPowerRetailStarterDeckCards.length} Embracing Power retail starter deck`,
  `${welcomeToNightCityRetailCards.length} Welcome to Night City retail`,
].join(", ");

console.log(`Generated ${generatedCounts} cards in ${outputDir}`);
