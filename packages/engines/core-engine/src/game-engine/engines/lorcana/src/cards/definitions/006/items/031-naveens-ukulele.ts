import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { makeItSings } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/abilities";

export const naveensUkulele: LorcanaItemCardDefinition = {
  id: "zt0",
  missingTestCase: true,
  name: "Naveen's Ukulele",
  characteristics: ["item"],
  text: "MAKE IT SING 1 {I}, Banish this item - Chosen character counts as having +3 cost to sing songs this turn.",
  type: "item",
  abilities: [makeItSings],
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  illustrator: "Levi Rogers",
  number: 31,
  set: "006",
  rarity: "common",
};
