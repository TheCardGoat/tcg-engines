import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { takeItForASpin } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/abilities";

export const longboat: LorcanaItemCardDefinition = {
  id: "gci",
  name: "Longboat",
  characteristics: ["item"],
  text: "TAKE IT FOR A SPIN 2 {I} – Chosen character of yours gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  type: "item",
  abilities: [takeItForASpin],
  inkwell: false,
  colors: ["ruby"],
  cost: 2,
  strength: 0,
  illustrator: "Alex Shin",
  number: 132,
  set: "006",
  rarity: "uncommon",
};
