import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { limitlessApplications } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/abilities";

export const microbots: LorcanaItemCardDefinition = {
  id: "klj",
  missingTestCase: true,
  name: "Microbots",
  characteristics: ["item"],
  text: "LIMITLESS APPLICATIONS You may have any number of cards named Microbots in your deck.\nINSPIRED TECH When you play this item, chosen character gets -1 {S} this turn for each item named Microbots you have in play.",
  type: "item",
  abilities: [limitlessApplications],
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Stefano Spagnuolo",
  number: 167,
  set: "006",
  rarity: "uncommon",
  cardCopyLimit: "no-limit",
};
