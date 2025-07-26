import { allCards } from "@lorcanito/lorcana-engine";
import { writeFileSync } from "fs";
import { join } from "path";

// Define card types
type CardType = "action" | "character" | "location" | "item";

// Group cards by type and extract their texts
const cardTextsByType: Record<CardType, string[]> = {
  action: [],
  character: [],
  location: [],
  item: [],
};

// Process all cards
Object.values(allCards).forEach((card) => {
  if (card.type && card.text && cardTextsByType[card.type as CardType]) {
    cardTextsByType[card.type as CardType].push(card.text);
  }
});

// Generate files for each card type
Object.entries(cardTextsByType).forEach(([cardType, texts]) => {
  const filename = `${cardType}-texts.ts`;
  const filepath = join(__dirname, filename);

  const fileContent = `// Auto-generated file containing all ${cardType} card texts
export const ${cardType}Texts: string[] = ${JSON.stringify(texts, null, 2)};

export default ${cardType}Texts;
`;

  writeFileSync(filepath, fileContent, "utf8");
  console.log(
    `Generated ${filename} with ${texts.length} ${cardType} card texts`,
  );
});

console.log("All card text files generated successfully!");
