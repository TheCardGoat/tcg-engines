import { restoringAtlantisAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export type LorcanaActionCardDefinition = any;

export const restoringAtlantis: LorcanaActionCardDefinition = {
  id: "m7i",
  name: "Restoring Atlantis",
  characteristics: ["action"],
  text: "Your characters can't be challenged until the start of your next turn.",
  type: "action",
  abilities: [restoringAtlantisAbility],
  inkwell: false,
  colors: ["steel"],
  cost: 5,
  illustrator: "Ricardo Gacia",
  number: 201,
  set: "007",
  rarity: "rare",
};
