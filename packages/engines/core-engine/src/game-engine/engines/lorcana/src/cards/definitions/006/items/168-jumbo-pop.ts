import { thereYouGo } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jumboPop: LorcanaItemCardDefinition = {
  id: "z6k",
  missingTestCase: true,
  name: "Jumbo Pop",
  characteristics: ["item"],
  text: "HERE YOU GO Banish this item – Remove up to 2 damage from each of your characters. Draw a card.",
  type: "item",
  abilities: [thereYouGo],
  inkwell: false,
  colors: ["sapphire"],
  cost: 3,
  illustrator: "Alexandra Hefez",
  number: 168,
  set: "006",
  rarity: "common",
};
