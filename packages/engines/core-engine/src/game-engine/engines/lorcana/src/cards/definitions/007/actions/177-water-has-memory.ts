import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { waterHasMemoryAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";

export const waterHasMemory: LorcanitoActionCard = {
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
