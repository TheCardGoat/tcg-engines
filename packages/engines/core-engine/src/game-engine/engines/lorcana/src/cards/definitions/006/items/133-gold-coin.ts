import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { glitteringAccess } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/abilities";

export const goldCoin: LorcanaItemCardDefinition = {
  id: "jmx",
  missingTestCase: true,
  name: "Gold Coin",
  characteristics: ["item"],
  text: "GLITTERING ACCESS {E}, 1 {I}, Banish this item – Ready chosen character of yours. They can't quest for the rest of this turn.",
  type: "item",
  abilities: [glitteringAccess],
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Gabriel Angelo",
  number: 133,
  set: "006",
  rarity: "common",
};
