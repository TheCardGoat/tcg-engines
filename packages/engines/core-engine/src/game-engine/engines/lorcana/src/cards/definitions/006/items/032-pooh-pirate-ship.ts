import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { makeARescue } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/abilities";

export const poohPirateShip: LorcanaItemCardDefinition = {
  id: "snl",
  missingTestCase: true,
  name: "Pooh Pirate Ship",
  characteristics: ["item"],
  text: "MAKE A RESCUE {E}, 3 {I} – Return a Pirate character card from your discard to your hand.",
  type: "item",
  abilities: [makeARescue],
  inkwell: false,
  colors: ["amber"],
  cost: 1,
  illustrator: "Kaitlin Cuthbertson",
  number: 32,
  set: "006",
  rarity: "rare",
};
