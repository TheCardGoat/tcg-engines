import { waterHasMemoryAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export type LorcanaActionCardDefinition = any;

export const waterHasMemory: LorcanaActionCardDefinition = {
  id: "boh",
  name: "Water Has Memory",
  characteristics: ["action"],
  type: "action",
  inkwell: false,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Samoldstorre",
  number: 177,
  set: "007",
  rarity: "common",
  text: "Look at the top 4 cards of chosen player's deck. Put one on the top of their deck and the rest on the bottom of their deck in any order.",
  abilities: [waterHasMemoryAbility],
};
