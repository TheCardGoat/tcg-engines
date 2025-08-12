// TODO: DELETE THIS IN FAVOR OF THE REAL CARDS

import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const partOfOurWorld: LorcanaActionCardDefinition = {
  id: "partOfOurWorld",
  type: "action",
  name: "Part of Our World",
  characteristics: ["action", "song"],
  set: "TFC",
  cost: 3,
  colors: ["amethyst"],
  number: 0,
  illustrator: "",
  rarity: "common",
};

export const bePrepared: LorcanaActionCardDefinition = {
  id: "bePrepared",
  type: "action",
  name: "Be Prepared",
  characteristics: ["action", "song"],
  set: "TFC",
  cost: 7,
  colors: ["emerald"],
  number: 0,
  illustrator: "",
  rarity: "rare",
};
// Legacy alias expected by imported tests
export const partOfYourWorld = partOfOurWorld;

export const letItGo: LorcanaActionCardDefinition = {
  id: "letItGo",
  type: "action",
  name: "Let It Go",
  characteristics: ["action", "song"],
  set: "TFC",
  cost: 5,
  colors: ["sapphire"],
  number: 0,
  illustrator: "",
  rarity: "rare",
};

export const motherKnowsBest: LorcanaActionCardDefinition = {
  id: "motherKnowsBest",
  type: "action",
  name: "Mother Knows Best",
  characteristics: ["action", "song"],
  set: "TFC",
  cost: 4,
  colors: ["amethyst"],
  number: 0,
  illustrator: "",
  rarity: "uncommon",
};

export const oneJumpAhead: LorcanaActionCardDefinition = {
  id: "oneJumpAhead",
  type: "action",
  name: "One Jump Ahead",
  characteristics: ["action", "song"],
  set: "TFC",
  cost: 3,
  colors: ["emerald"],
  number: 0,
  illustrator: "",
  rarity: "common",
};

export const aWholeNewWorld: LorcanaActionCardDefinition = {
  id: "aWholeNewWorld",
  type: "action",
  name: "A Whole New World",
  characteristics: ["action", "song"],
  set: "TFC",
  cost: 5,
  colors: ["sapphire"],
  number: 0,
  illustrator: "",
  rarity: "rare",
};

export const hakunaMatata: LorcanaActionCardDefinition = {
  id: "hakunaMatata",
  type: "action",
  name: "Hakuna Matata",
  characteristics: ["action", "song"],
  set: "TFC",
  cost: 4,
  colors: ["amber"],
  number: 0,
  illustrator: "",
  rarity: "common",
};

export const suddenChill: LorcanaActionCardDefinition = {
  id: "suddenChill",
  type: "action",
  name: "Sudden Chill",
  characteristics: ["action"],
  set: "TFC",
  cost: 2,
  colors: ["amethyst"],
  number: 0,
  illustrator: "",
  rarity: "common",
};

export const grabYourSword: LorcanaActionCardDefinition = {
  id: "grabYourSword",
  type: "action",
  name: "Grab Your Sword",
  characteristics: ["action", "song"],
  set: "TFC",
  cost: 6,
  colors: ["ruby"],
  number: 0,
  illustrator: "",
  rarity: "rare",
};

export const reflection: LorcanaActionCardDefinition = {
  id: "reflection",
  type: "action",
  name: "Reflection",
  characteristics: ["action", "song"],
  set: "TFC",
  cost: 2,
  colors: ["amethyst"],
  number: 0,
  illustrator: "",
  rarity: "common",
};
// Re-exporting external songs is disabled to avoid tsconfig path mappings.
// Tests import songs through actions barrel and local minimal definitions above.
