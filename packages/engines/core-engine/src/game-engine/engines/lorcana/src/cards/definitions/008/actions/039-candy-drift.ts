import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const candyDrift: LorcanaActionCardDefinition = {
  id: "sf4",
  name: "Candy Drift",
  notImplemented: true,
  missingTestCase: true,
  characteristics: ["action"],
  text: "Draw a card. Chosen character of yours gets +5 {S} this turn. At the end of your turn, banish them.",
  type: "action",
  inkwell: true,
  colors: ["amber", "ruby"],
  cost: 2,
  illustrator: "Stefano Spagnuolo",
  number: 39,
  set: "008",
  rarity: "uncommon",
  abilities: [],
};
