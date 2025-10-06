import { resourceAllocation } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const galacticCommunicator: LorcanaItemCardDefinition = {
  id: "ryf",
  missingTestCase: true,
  name: "Galactic Communicator",
  characteristics: ["item"],
  text: "RESOURCE ALLOCATION 1 {I}, Banish this item - Return chosen character with 2 {S} or less to their player's hand.",
  type: "item",
  abilities: [resourceAllocation],
  inkwell: false,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Jiahui Eva Gao",
  number: 99,
  set: "006",
  rarity: "common",
};
