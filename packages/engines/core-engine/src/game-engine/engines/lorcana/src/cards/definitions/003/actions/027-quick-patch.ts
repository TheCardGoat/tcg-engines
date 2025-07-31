import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const quickPatch: LorcanaActionCardDefinition = {
  id: "p6z",
  notImplemented: true,
  name: "Quick Patch",
  characteristics: ["action"],
  text: "Remove up to 3 damage from chosen location.",
  type: "action",
  abilities: [],
  flavour: "Good as new! Well, almost.",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  illustrator: "Wouter Bruneel",
  number: 27,
  set: "ITI",
  rarity: "common",
};
