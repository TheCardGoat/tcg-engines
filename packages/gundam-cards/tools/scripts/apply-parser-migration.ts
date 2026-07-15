import type { CardDefinition } from "@tcg/gundam-types";
import { join } from "path";
import { GD01, ST01, ST02, ST03, ST04, ST05 } from "../../src";
import { generateSetIndex, saveCardFile } from "../generator/file-writer";
import { parseCardText } from "../parser/text-parser";

const allSets = [GD01, ST01, ST02, ST03, ST04, ST05];
const BASE_DIR = join(import.meta.dir, "../../src/cards");

console.log("🚀 Starting Card Parser Migration...");
console.log(`📂 Base Directory: ${BASE_DIR}`);

async function migrate() {
  let processed = 0;
  let errors = 0;

  const cardsBySet: Record<string, CardDefinition[]> = {};

  const allCards = allSets.flatMap((set) => Object.values(set));

  for (const card of allCards) {
    if (!card || typeof card !== "object" || !("text" in card) || !card.text)
      continue;

    try {
      // 1. Parse Text
      const result = parseCardText(card.text);

      // 2. Update Card Definition
      // We create a new object to avoid mutating the imported one in memory (though it doesn't matter much for file writing)
      const updatedCard: CardDefinition = {
        ...card,
        effects: result.effects.length > 0 ? result.effects : undefined,
        keywords: result.keywords.length > 0 ? result.keywords : undefined,
      } as CardDefinition;

      // 3. Save File
      // saveCardFile expects baseDir to be the parent of the set folder.
      await saveCardFile(updatedCard, BASE_DIR);

      // Collect for index generation
      if (!cardsBySet[updatedCard.setCode]) {
        cardsBySet[updatedCard.setCode] = [];
      }
      cardsBySet[updatedCard.setCode].push(updatedCard);

      processed++;
      if (processed % 10 === 0) {
        process.stdout.write(".");
      }
    } catch (e) {
      console.error(`\n❌ Error processing ${card.id}:`, e);
      errors++;
    }
  }

  // 4. Regenerate Indexes
  console.log("\n\n🔄 Regenerating Set Indexes...");
  for (const [setCode, cards] of Object.entries(cardsBySet)) {
    // Sort cards by card number to ensure stable index order
    cards.sort((a, b) => a.cardNumber.localeCompare(b.cardNumber));
    await generateSetIndex(setCode, cards, BASE_DIR);
  }

  console.log("\n\n✅ Migration Complete!");
  console.log(`   Processed: ${processed} cards`);
  console.log(`   Errors: ${errors}`);
}

migrate().catch(console.error);
