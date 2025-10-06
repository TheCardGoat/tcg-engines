import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { spycraft } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/abilities";

export const sunglasses: LorcanaItemCardDefinition = {
  id: "lqp",
  missingTestCase: true,
  name: "Sunglasses",
  characteristics: ["item"],
  text: "SPYCRAFT {E} - Draw a card, then choose and discard a card.",
  type: "item",
  abilities: [spycraft],
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  illustrator: "Kuya Jaypi",
  number: 202,
  set: "006",
  rarity: "common",
};
